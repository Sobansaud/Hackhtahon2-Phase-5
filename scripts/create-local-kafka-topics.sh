#!/bin/bash

# Script to create local Kafka topics for Minikube environment
# This script should be run after the Kafka cluster is deployed

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

echo "Creating Kafka topics: task-events, reminders, task-updates"

# Create KafkaTopic custom resources for each topic
cat <<EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: task-events
  namespace: kafka
  labels:
    strimzi.io/cluster: my-cluster
spec:
  partitions: 3
  replicas: 1
  config:
    retention.ms: 604800000
    segment.bytes: 1073741824
    cleanup.policy: compact,delete
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: reminders
  namespace: kafka
  labels:
    strimzi.io/cluster: my-cluster
spec:
  partitions: 3
  replicas: 1
  config:
    retention.ms: 604800000
    segment.bytes: 1073741824
    cleanup.policy: compact,delete
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: task-updates
  namespace: kafka
  labels:
    strimzi.io/cluster: my-cluster
spec:
  partitions: 3
  replicas: 1
  config:
    retention.ms: 604800000
    segment.bytes: 1073741824
    cleanup.policy: compact,delete
EOF

echo "Kafka topics created. Waiting for them to be ready..."

# Wait for topics to be ready
kubectl wait kafkatopic/task-events -n kafka --for=condition=Ready --timeout=120s
kubectl wait kafkatopic/reminders -n kafka --for=condition=Ready --timeout=120s
kubectl wait kafkatopic/task-updates -n kafka --for=condition=Ready --timeout=120s

# Verify topics
echo "Verifying Kafka topics..."
kubectl get kafkatopic -n kafka
kubectl describe kafkatopic/task-events -n kafka
kubectl describe kafkatopic/reminders -n kafka
kubectl describe kafkatopic/task-updates -n kafka

echo "Kafka topics created successfully!"