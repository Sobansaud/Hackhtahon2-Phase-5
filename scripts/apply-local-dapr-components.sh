#!/bin/bash

# Script to apply local Dapr components to Minikube
# This script should be run after installing Dapr on Minikube

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

if ! command -v dapr &> /dev/null; then
    echo "dapr CLI is not installed or not in PATH"
    exit 1
fi

# Define the namespace
NAMESPACE="todo-dev"

echo "Applying local Dapr components to namespace $NAMESPACE..."

# Create the namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply all local Dapr components from the dapr-components/local directory
echo "Applying local Dapr components..."

# Apply pubsub component
if [ -f "../dapr-components/local/pubsub-kafka-local.yaml" ]; then
    kubectl apply -f ../dapr-components/local/pubsub-kafka-local.yaml -n $NAMESPACE
    echo "Applied local pubsub-kafka component"
else
    echo "Warning: pubsub-kafka-local.yaml not found"
fi

# Apply state store component
if [ -f "../dapr-components/local/statestore-postgres-local.yaml" ]; then
    kubectl apply -f ../dapr-components/local/statestore-postgres-local.yaml -n $NAMESPACE
    echo "Applied local statestore-postgres component"
else
    echo "Warning: statestore-postgres-local.yaml not found"
fi

# Apply secret store component
if [ -f "../dapr-components/local/secretstore-k8s-local.yaml" ]; then
    kubectl apply -f ../dapr-components/local/secretstore-k8s-local.yaml -n $NAMESPACE
    echo "Applied local secretstore-k8s component"
else
    echo "Warning: secretstore-k8s-local.yaml not found"
fi

# Apply bindings component
if [ -f "../dapr-components/local/bindings-cron-local.yaml" ]; then
    kubectl apply -f ../dapr-components/local/bindings-cron-local.yaml -n $NAMESPACE
    echo "Applied local bindings-cron component"
else
    echo "Warning: bindings-cron-local.yaml not found"
fi

# Verify components are applied
echo "Verifying local Dapr components..."
dapr components -k --namespace $NAMESPACE

echo "All local Dapr components applied successfully to namespace $NAMESPACE"