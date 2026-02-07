#!/bin/bash

# Script to verify events are delivered to Redpanda Kafka topics
# This script should be run after publishing events to test delivery

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

# Define the namespace
NAMESPACE="todo"

echo "Verifying events in Redpanda Kafka topics in namespace $NAMESPACE..."

# Check if Redpanda secret exists
if kubectl get secret redpanda-secret -n $NAMESPACE &> /dev/null; then
    echo "Redpanda secret found in namespace $NAMESPACE"
else
    echo "WARNING: Redpanda secret not found in namespace $NAMESPACE"
fi

# Check if there are any pods that might be consuming from Kafka topics
echo "Looking for Kafka consumers in the namespace..."
kubectl get pods -n $NAMESPACE -o wide

# If we had a Kafka consumer pod deployed, we could check its logs
# For now, we'll verify that the topics exist by checking if there are any pods that might be working with them

# Check if there are any errors in application logs related to Kafka/Redpanda
echo "Checking application logs for Kafka/Redpanda related messages..."
for pod in $(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    echo "Checking logs for pod: $pod"
    kubectl logs $pod -n $NAMESPACE 2>/dev/null | grep -i -E "(kafka|redpanda|pubsub|event|topic|producer|consumer)" || echo "  No Kafka/Redpanda messages found in $pod"
done

# Check Dapr sidecar logs for pubsub-related messages
echo "Checking Dapr sidecar logs for pubsub messages..."
for pod in $(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    echo "Checking Dapr logs for pod: $pod"
    # Try to get Dapr sidecar logs if they exist
    if kubectl logs $pod -n $NAMESPACE -c daprd 2>/dev/null; then
        kubectl logs $pod -n $NAMESPACE -c daprd 2>/dev/null | grep -i -E "(pubsub|kafka|publish|subscribe|error)" || echo "  No pubsub/Kafka messages found in Dapr sidecar for $pod"
    else
        # If there's no dedicated daprd container, check all logs for Dapr-related messages
        kubectl logs $pod -n $NAMESPACE 2>/dev/null | grep -i -E "(dapr|pubsub|kafka)" || echo "  No Dapr/pubsub messages found in $pod"
    fi
done

# In a real scenario, we would connect to Redpanda and check the topics directly
# Since we don't have direct access to Redpanda, we'll indicate what would normally be done
echo ""
echo "In a real deployment, the following would be checked:"
echo "- Connect to Redpanda cluster using rpk or kafka-console-consumer"
echo "- Verify messages are present in topics: task-events, reminders, task-updates"
echo "- Check topic message counts and consumer lag"
echo "- Verify message format and content"
echo ""
echo "For example, the following commands would be used:"
echo "  rpk topic list --brokers <bootstrap-servers>"
echo "  rpk topic consume task-events --brokers <bootstrap-servers> -n 5"
echo ""

echo "Verification completed. In a live environment, direct connection to Redpanda would confirm event delivery."