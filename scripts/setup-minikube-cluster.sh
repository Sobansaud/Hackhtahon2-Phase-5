#!/bin/bash

# Script to set up Minikube cluster with Dapr and Kafka integration
# This script will create a Minikube cluster and install all necessary components

set -e  # Exit on any error

echo "Setting up Minikube cluster with Dapr and Kafka integration..."
echo "=========================================================="

# Check if required tools are available
if ! command -v minikube &> /dev/null; then
    echo "❌ minikube is not installed or not in PATH"
    echo "Please install minikube first:"
    echo "  Windows: choco install minikube"
    echo "  Or download from: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    echo "Please install kubectl first"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo "❌ helm is not installed or not in PATH"
    echo "Please install helm first"
    exit 1
fi

echo "✅ All required tools are available"

# Start Minikube with adequate resources for Dapr and Kafka
echo ""
echo "🚀 Starting Minikube cluster..."
minikube start --cpus=4 --memory=8192 --disk-size=20g

# Verify kubectl context
echo ""
echo "🔧 Verifying kubectl context..."
kubectl config current-context

# Enable necessary Minikube addons
echo ""
echo "🔌 Enabling required Minikube addons..."
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable dashboard

echo ""
echo "📦 Installing Dapr..."
# Initialize Dapr in Kubernetes mode
dapr init -k --wait

# Wait for Dapr to be ready
echo "⏳ Waiting for Dapr to be ready..."
kubectl wait --for=condition=ready pod -l app=dapr-operator -n dapr-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=dapr-placement-server -n dapr-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=dapr-sidecar-injector -n dapr-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=dapr-sentry -n dapr-system --timeout=300s

echo "✅ Dapr installed and ready!"

# Create application namespace with Dapr enabled
echo ""
echo "🌐 Creating application namespace..."
kubectl create namespace todo-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace todo-dev dapr.io/enabled=true --overwrite

# Install Strimzi Kafka operator
echo ""
echo ".kafka operator..."
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

# Install Strimzi from the official release
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Wait for Strimzi operator to be ready
echo "⏳ Waiting for Strimzi Kafka operator to be ready..."
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

echo "✅ Strimzi Kafka operator installed and ready!"

# Deploy Kafka cluster
echo ""
echo "📡 Deploying Kafka cluster..."
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
        memory: 1Gi
        cpu: "0.5"
      limits:
        memory: 2Gi
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
        size: 5Gi
        deleteClaim: false
  zookeeper:
    replicas: 1
    resources:
      requests:
        memory: 512Mi
        cpu: "0.25"
      limits:
        memory: 1Gi
        cpu: "0.5"
    jvmOptions:
      xx:
        UseG1GC: true
    storage:
      type: persistent-claim
      size: 2Gi
      deleteClaim: false
  entityOperator:
    topicOperator: {}
    userOperator: {}
EOF

# Wait for Kafka cluster to be ready
echo "⏳ Waiting for Kafka cluster to be ready..."
kubectl wait kafka/my-cluster -n kafka --for=condition=Ready --timeout=600s

echo "✅ Kafka cluster deployed and ready!"

# Create Kafka topics
echo ""
echo "📝 Creating Kafka topics..."
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

# Wait for topics to be ready
kubectl wait kafkatopic/task-events -n kafka --for=condition=Ready --timeout=120s
kubectl wait kafkatopic/reminders -n kafka --for=condition=Ready --timeout=120s
kubectl wait kafkatopic/task-updates -n kafka --for=condition=Ready --timeout=120s

echo "✅ Kafka topics created!"

# Apply Dapr components for local development
echo ""
echo "⚙️  Applying Dapr components..."

# Create local Dapr pubsub component
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
  namespace: todo-dev
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "my-cluster-kafka-bootstrap:9092"
  - name: consumerGroup
    value: "todo-dev-group"
  - name: clientID
    value: "todo-dev-client"
  - name: authRequired
    value: "false"
  - name: maxMessageBytes
    value: 1024
  - name: consumeRetryInterval
    value: 1s
EOF

# Create local Dapr state store component
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
  namespace: todo-dev
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: "redis-master:6379"
  - name: redisPassword
    secretKeyRef:
      name: redis
      key: password
  - name: actorStateStore
    value: "true"
EOF

# Deploy Redis for state management
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis -n todo-dev --create-namespace

echo "✅ Dapr components applied!"

# Verify all components are ready
echo ""
echo "🔍 Verifying cluster setup..."
echo "Dapr status:"
dapr status -k

echo ""
echo "Kafka cluster status:"
kubectl get pods -n kafka

echo ""
echo "Application namespace:"
kubectl get all -n todo-dev

echo ""
echo "🎯 Minikube cluster setup complete!"
echo ""
echo "Cluster details:"
echo "- Minikube status: $(minikube status)"
echo "- Current context: $(kubectl config current-context)"
echo "- Dapr system namespace: dapr-system"
echo "- Application namespace: todo-dev"
echo "- Kafka namespace: kafka"
echo "- Kafka cluster: my-cluster"
echo "- Kafka topics: task-events, reminders, task-updates"
echo ""
echo "To access the cluster:"
echo "- Dashboard: minikube dashboard"
echo "- Kubectl: kubectl get pods -A"
echo "- Dapr dashboard: dapr dashboard"
echo ""
echo "Your Minikube cluster is now ready for deploying your frontend and backend applications!"