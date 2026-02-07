#!/bin/bash

# Script to apply Dapr components to OKE cluster
# This script should be run after connecting to the OKE cluster and ensuring Dapr is installed

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if Dapr is installed
if ! command -v dapr &> /dev/null; then
    echo "Dapr CLI is not installed or not in PATH"
    exit 1
fi

# Define the namespace
NAMESPACE="todo"

# Create the namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply all Dapr components from the dapr-components directory
echo "Applying Dapr components..."

# Apply pubsub component
if [ -f "../dapr-components/pubsub-kafka.yaml" ]; then
    kubectl apply -f ../dapr-components/pubsub-kafka.yaml -n $NAMESPACE
    echo "Applied pubsub-kafka component"
else
    echo "Warning: pubsub-kafka.yaml not found"
fi

# Apply state store component
if [ -f "../dapr-components/statestore-postgres.yaml" ]; then
    kubectl apply -f ../dapr-components/statestore-postgres.yaml -n $NAMESPACE
    echo "Applied statestore-postgres component"
else
    echo "Warning: statestore-postgres.yaml not found"
fi

# Apply secret store component
if [ -f "../dapr-components/secretstore-k8s.yaml" ]; then
    kubectl apply -f ../dapr-components/secretstore-k8s.yaml -n $NAMESPACE
    echo "Applied secretstore-k8s component"
else
    echo "Warning: secretstore-k8s.yaml not found"
fi

# Apply bindings component
if [ -f "../dapr-components/bindings-cron.yaml" ]; then
    kubectl apply -f ../dapr-components/bindings-cron.yaml -n $NAMESPACE
    echo "Applied bindings-cron component"
else
    echo "Warning: bindings-cron.yaml not found"
fi

# Verify components are applied
echo "Verifying Dapr components..."
dapr components -k --namespace $NAMESPACE

echo "All Dapr components applied successfully to namespace $NAMESPACE"