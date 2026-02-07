#!/bin/bash

# Script to install Strimzi Kafka operator on Minikube
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

echo "Installing Strimzi Kafka operator on Minikube..."

# Check if Minikube is running
if ! minikube status &> /dev/null; then
    echo "Starting Minikube..."
    minikube start --cpus=4 --memory=8192
fi

# Install Strimzi Kafka operator
echo "Installing Strimzi Kafka operator..."

# Create a temporary directory for the installation files
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Download the Strimzi installation files
curl -L https://github.com/strimzi/strimzi-kafka-operator/releases/latest/download/strimzi-cluster-operator-x.y.z.zip -o strimzi.zip
unzip strimzi.zip

# Navigate to the install directory
cd strimzi-* && cd install

# Install the operator in the kafka namespace
kubectl create namespace kafka || true
kubectl create -f ./cluster-operator/ -n kafka

# Wait for the operator to be ready
echo "Waiting for Strimzi Kafka operator to be ready..."
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Verify installation
echo "Verifying Strimzi Kafka operator installation..."
kubectl get pods -n kafka

# Clean up
cd /
rm -rf $TEMP_DIR

echo "Strimzi Kafka operator installed successfully!"