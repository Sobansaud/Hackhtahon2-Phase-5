#!/bin/bash

# Script to test Dapr pubsub functionality by publishing sample events
# This script should be run after the application is deployed with Dapr integration

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
NAMESPACE="todo"

echo "Testing Dapr pubsub functionality in namespace $NAMESPACE..."

# Get a pod that has Dapr sidecar to test from
POD_NAME=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/name=todo-backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || \
           kubectl get pods -n $NAMESPACE -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "No pods found in namespace $NAMESPACE"
    exit 1
fi

echo "Using pod $POD_NAME for testing..."

# Test 1: Check if pubsub component is working
echo "Checking pubsub component status..."
dapr components -k --namespace $NAMESPACE | grep pubsub || echo "Pubsub component may not be configured properly"

# Test 2: Publish a sample event using Dapr sidecar
echo "Publishing sample task event..."

# Create a sample event payload
EVENT_PAYLOAD='{
  "id": "event-'$(date +%s)'",
  "type": "task.created",
  "source": "todo-app",
  "data": {
    "taskId": "task-'$(date +%s)'",
    "title": "Test task from pubsub test",
    "description": "This is a test task created to verify pubsub functionality",
    "status": "pending",
    "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  },
  "time": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
}'

echo "Sample event payload: $EVENT_PAYLOAD"

# Use Dapr CLI to publish the event (this works if dapr is running locally and can reach the cluster)
# Or use a curl command to the Dapr sidecar endpoint in the cluster
echo "Attempting to publish event to pubsub component..."

# If we're in the cluster context, we can try to exec into a pod and use the Dapr sidecar
kubectl exec -it $POD_NAME -n $NAMESPACE -- dapr --help > /dev/null 2>&1 && \
kubectl exec -it $POD_NAME -n $NAMESPACE -- sh -c "echo '$EVENT_PAYLOAD' | dapr publish --pubsub pubsub -t task-events -d @-" || \
echo "Could not execute dapr publish command in pod (may need to use HTTP API directly)"

# Alternative: Use the Dapr HTTP API directly via port forward if needed
echo "Alternative test: Verifying pubsub component configuration..."
kubectl get secret redpanda-secret -n $NAMESPACE || echo "Redpanda secret not found - pubsub may not be properly configured"

# Check if there are any pubsub-related errors in Dapr sidecar logs
echo "Checking for pubsub-related errors in Dapr logs..."
kubectl logs -l app.kubernetes.io/name=todo-backend -n $NAMESPACE | grep -i dapr | grep -E "(error|fail|warn)" || echo "No obvious Dapr errors found in application logs"

echo "Pubsub test completed. Please check Kafka/Redpanda to verify events were received."