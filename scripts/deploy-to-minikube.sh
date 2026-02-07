#!/bin/bash

# Script to deploy application to Minikube with Dapr integration
# This script should be run after setting up Dapr and Kafka on Minikube

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

if ! command -v minikube &> /dev/null; then
    echo "minikube is not installed or not in PATH"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo "helm is not installed or not in PATH"
    exit 1
fi

if ! command -v dapr &> /dev/null; then
    echo "dapr CLI is not installed or not in PATH"
    exit 1
fi

echo "Starting deployment to Minikube with Dapr integration..."

# Check if Minikube is running
if ! minikube status &> /dev/null; then
    echo "Starting Minikube..."
    minikube start --cpus=4 --memory=8192
fi

# Verify kubectl context is pointing to Minikube
kubectl config use-context minikube

# Define the namespace
NAMESPACE="todo-dev"

# Create the namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Ensure the namespace is labeled for Dapr injection
kubectl label namespace $NAMESPACE dapr.io/enabled=true --overwrite

# Apply local Dapr components first
echo "Applying local Dapr components..."
kubectl apply -f ../dapr-components/local/pubsub-kafka-local.yaml -n $NAMESPACE
kubectl apply -f ../dapr-components/local/statestore-postgres-local.yaml -n $NAMESPACE
kubectl apply -f ../dapr-components/local/secretstore-k8s-local.yaml -n $NAMESPACE
kubectl apply -f ../dapr-components/local/bindings-cron-local.yaml -n $NAMESPACE

# Create a temporary values file for development
cat <<EOF > temp-development-values.yaml
# Development-specific overrides
replicaCount: 1

image:
  repository: todo-app-dev
  tag: "latest"

resources:
  limits:
    cpu: 300m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /\$2

# Dapr configuration for development
dapr:
  enabled: true
  appId: "todo-dev-app"
  appPort: 8000
  config: "app-config"
  logLevel: "debug"  # More verbose logging for development

service:
  type: ClusterIP
  port: 8000
EOF

# Deploy the application
echo "Deploying application using Helm..."
helm upgrade --install todo-backend ./charts/todo-backend \
  --namespace $NAMESPACE \
  --values temp-development-values.yaml \
  --create-namespace \
  --wait

helm upgrade --install todo-frontend ./charts/todo-frontend \
  --namespace $NAMESPACE \
  --values temp-development-values.yaml \
  --wait

# Clean up temporary file
rm temp-development-values.yaml

echo "Application deployed successfully to namespace $NAMESPACE"

# Verify deployment
echo "Verifying deployment..."
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

# Verify Dapr sidecars are injected
echo "Checking for Dapr sidecars..."
for pod in $(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    CONTAINER_COUNT=$(kubectl get pod $pod -n $NAMESPACE -o jsonpath='{.spec.containers[*].name}' | wc -w)
    if [ $CONTAINER_COUNT -ge 2 ]; then
        echo "OK: Pod $pod has $CONTAINER_COUNT containers (app + Dapr sidecar)"
    else
        echo "WARNING: Pod $pod has only $CONTAINER_COUNT container(s)"
    fi
done

echo "Minikube deployment completed successfully!"