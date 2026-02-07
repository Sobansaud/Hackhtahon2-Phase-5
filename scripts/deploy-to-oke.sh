#!/bin/bash

# Script to deploy application to OKE using Helm with Dapr integration
# This script should be run after connecting to the OKE cluster and ensuring prerequisites are met

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
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

# Define the namespace
NAMESPACE="todo"

echo "Starting deployment to OKE with Dapr integration..."

# Create the namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo "Namespace $NAMESPACE created/verified"

# Ensure Dapr is installed in the cluster
if ! kubectl get deployment dapr-operator -n dapr-system &> /dev/null; then
    echo "Installing Dapr runtime in high availability mode..."
    helm repo add dapr https://dapr.github.io/helm-charts/
    helm repo update
    helm install dapr dapr/dapr \
      --namespace dapr-system \
      --create-namespace \
      --set global.ha.enabled=true \
      --set global.mtls.enabled=true \
      --set dapr_operator.replicaCount=3 \
      --set dapr_placement.replicaCount=3 \
      --set dapr_sidecar_injector.replicaCount=2 \
      --set dapr_sentry.replicaCount=3 \
      --atomic \
      --wait
    echo "Dapr runtime installed successfully"
else
    echo "Dapr runtime already installed"
fi

# Label the namespace for Dapr injection if not already labeled
if [[ $(kubectl get namespace $NAMESPACE -o jsonpath='{.metadata.labels.dapr\.io\/enabled}') != "true" ]]; then
    kubectl label namespace $NAMESPACE dapr.io/enabled=true --overwrite
    echo "Namespace labeled for Dapr injection"
fi

# Apply Dapr components
echo "Applying Dapr components..."
kubectl apply -f ../dapr-components/pubsub-kafka.yaml -n $NAMESPACE
kubectl apply -f ../dapr-components/statestore-postgres.yaml -n $NAMESPACE
kubectl apply -f ../dapr-components/secretstore-k8s.yaml -n $NAMESPACE
kubectl apply -f ../dapr-components/bindings-cron.yaml -n $NAMESPACE
echo "Dapr components applied"

# Add the application chart repository or use local charts
echo "Deploying application using Helm..."

# Create a temporary values file for production
cat <<EOF > temp-production-values.yaml
# Production-specific overrides
replicaCount: 2

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"

# Dapr configuration
dapr:
  enabled: true
  appId: "todo-app"
  appPort: 8000
  config: "app-config"
  logLevel: "info"
EOF

# Deploy the application
helm upgrade --install todo-backend ./charts/todo-backend \
  --namespace $NAMESPACE \
  --values temp-production-values.yaml \
  --create-namespace \
  --wait

helm upgrade --install todo-frontend ./charts/todo-frontend \
  --namespace $NAMESPACE \
  --values temp-production-values.yaml \
  --wait

# Clean up temporary file
rm temp-production-values.yaml

echo "Application deployed successfully to namespace $NAMESPACE"
echo "Verifying deployment..."

# Verify deployments
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

# Verify Dapr sidecars are injected
echo "Checking for Dapr sidecars..."
kubectl get pods -n $NAMESPACE -o json | jq '.items[].spec.containers | length' || echo "jq not available, skipping sidecar verification"

echo "Deployment completed successfully!"