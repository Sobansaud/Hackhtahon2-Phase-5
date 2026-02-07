#!/bin/bash

# Script to deploy Kafka cluster using Strimzi operator on Minikube
# This script should be run after installing the Strimzi operator

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

echo "Deploying Kafka cluster using Strimzi operator..."

# Create a Kafka cluster custom resource
cat <<EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: my-cluster
  namespace: kafka
spec:
  kafka:
    version: 3.7.0
    replicas: 1
    resources:
      requests:
        memory: 2Gi
        cpu: "0.5"
      limits:
        memory: 4Gi
        cpu: "1"
    jvmOptions:
      xx:
        UseG1GC: true
    config:
      offsets.topic.replication.factor: 1
      transaction.state.log.replication.factor: 1
      transaction.state.log.min.isr: 1
      default.replication.factor: 1
      min.insync.replicas: 1
      inter.broker.protocol.version: "3.7"
    storage:
      type: jbod
      volumes:
      - id: 0
        type: persistent-claim
        size: 10Gi
        deleteClaim: false
  zookeeper:
    replicas: 1
    resources:
      requests:
        memory: 1Gi
        cpu: "0.5"
      limits:
        memory: 2Gi
        cpu: "1"
    jvmOptions:
      xx:
        UseG1GC: true
    storage:
      type: persistent-claim
      size: 5Gi
      deleteClaim: false
  entityOperator:
    topicOperator: {}
    userOperator: {}
EOF

echo "Kafka cluster deployment initiated. Waiting for cluster to be ready..."

# Wait for Kafka cluster to be ready
kubectl wait kafka/my-cluster -n kafka --for=condition=Ready --timeout=600s

# Verify Kafka cluster status
kubectl get kafka -n kafka
kubectl get pods -n kafka

# Get Kafka cluster information
echo "Kafka cluster information:"
kubectl describe kafka/my-cluster -n kafka

echo "Kafka cluster deployed successfully!"