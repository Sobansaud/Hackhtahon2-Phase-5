#!/bin/bash

# Script to install Dapr on Minikube cluster
# This script should be run after starting Minikube

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

if ! command -v dapr &> /dev/null; then
    echo "dapr CLI is not installed or not in PATH"
    exit 1
fi

echo "Installing Dapr on Minikube cluster..."

# Check if Minikube is running
if ! minikube status &> /dev/null; then
    echo "Starting Minikube..."
    minikube start --cpus=4 --memory=8192
fi

# Verify kubectl context is pointing to Minikube
kubectl config use-context minikube

# Install Dapr runtime in the cluster
echo "Installing Dapr runtime..."
dapr init -k --wait

# Wait for Dapr to be ready
echo "Waiting for Dapr to be ready..."
kubectl wait --for=condition=ready pod -l app=dapr-operator -n dapr-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=dapr-placement-server -n dapr-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=dapr-sidecar-injector -n dapr-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=dapr-sentry -n dapr-system --timeout=300s

# Verify Dapr installation
echo "Verifying Dapr installation..."
kubectl get pods -n dapr-system
dapr status -k

# Create a test namespace for Dapr
kubectl create namespace todo-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace todo-dev dapr.io/enabled=true --overwrite

echo "Dapr installed successfully on Minikube!"