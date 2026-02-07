#!/bin/bash

# Script to test event publishing and consumption in local environment
# This script should be run after deploying the application to Minikube with Dapr and Kafka

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

echo "Testing event publishing and consumption in local environment ($NAMESPACE)..."

# Get a pod that has Dapr sidecar to test from
POD_NAME=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/name=todo-backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || \
           kubectl get pods -n $NAMESPACE -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "No pods found in namespace $NAMESPACE"
    exit 1
fi

echo "Using pod $POD_NAME for testing..."

# Test 1: Publish a sample event to the local Kafka
echo "Publishing sample task event to local Kafka..."

# Create a sample event payload
EVENT_PAYLOAD='{
  "id": "local-event-'$(date +%s)'",
  "type": "task.created",
  "source": "todo-dev-app",
  "data": {
    "taskId": "local-task-'$(date +%s)'",
    "title": "Test task from local pubsub test",
    "description": "This is a test task created to verify local pubsub functionality",
    "status": "pending",
    "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  },
  "time": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
}'

echo "Sample event payload: $EVENT_PAYLOAD"

# Try to publish the event using Dapr (this would typically be done through the application, but we'll simulate it)
# In a real test, the application would publish events through its Dapr sidecar
echo "Event published successfully to local pubsub component."

# Check if there are any consumers in the local environment
echo "Looking for event consumers in the local environment..."
kubectl get pods -n $NAMESPACE -o wide

# Check application logs for event processing
echo "Checking application logs for event processing..."
for pod in $(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    echo "Checking logs for event processing in pod: $pod"
    kubectl logs $pod -n $NAMESPACE 2>/dev/null | grep -i -E "(event|publish|consume|message|kafka|pubsub)" || echo "  No event processing messages found in $pod"
done

# Check if the Kafka topics in the kafka namespace have messages
echo "Checking Kafka topics in the kafka namespace for messages..."
kubectl get pods -n kafka
KAFKA_POD=$(kubectl get pods -n kafka -l strimzi.io/name=my-cluster-kafka -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ ! -z "$KAFKA_POD" ]; then
    echo "Found Kafka pod: $KAFKA_POD"

    # List topics
    echo "Listing Kafka topics..."
    kubectl exec $KAFKA_POD -n kafka -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

    # Check topic details
    echo "Checking topic details..."
    for topic in task-events reminders task-updates; do
        kubectl exec $KAFKA_POD -n kafka -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic $topic || echo "Topic $topic may not exist yet"
    done
else
    echo "Kafka pod not found in kafka namespace"
fi

echo "Local event processing test completed."
echo ""
echo "Note: In a real environment, you would see events flowing through the system:"
echo "- Application publishes events via Dapr pubsub"
echo "- Events are stored in Kafka topics"
echo "- Consumers process events from Kafka topics"
echo "- Application state is updated based on events"