#!/bin/bash

# Script to create Kubernetes secret for Redpanda credentials in OKE cluster
# This script should be run after connecting to the OKE cluster

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

# Define the namespace
NAMESPACE="todo"

# Create the namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Create the secret with placeholder values
# In a real scenario, these would be replaced with actual Redpanda credentials
kubectl create secret generic redpanda-secret \
  --namespace $NAMESPACE \
  --from-literal=sasl-username="$REDPANDA_USERNAME" \
  --from-literal=sasl-password="$REDPANDA_PASSWORD" \
  --from-literal=brokers="$REDPANDA_BROKERS" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Redpanda secret created in namespace $NAMESPACE"
echo "Secret contains:"
echo "- sasl-username: stored securely in Kubernetes secret"
echo "- sasl-password: stored securely in Kubernetes secret"
echo "- brokers: stored securely in Kubernetes secret"

# Verify the secret was created
kubectl get secret redpanda-secret -n $NAMESPACE