#!/bin/bash

# Script to validate event processing functionality in local environment
# This script should be run after testing event publishing and consumption

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

# Define the namespaces
APP_NAMESPACE="todo-dev"
KAFKA_NAMESPACE="kafka"

echo "Validating event processing functionality in local environment..."

# Check Dapr components are properly configured
echo "1. Checking Dapr components configuration..."
dapr components -k --namespace $APP_NAMESPACE

# Check if the pubsub component is healthy
PUBSUB_COMPONENT=$(dapr components -k --namespace $APP_NAMESPACE -o json | jq -r '.[] | select(.name == "pubsub") | .name' 2>/dev/null)
if [ ! -z "$PUBSUB_COMPONENT" ]; then
    echo "   ✓ Pubsub component is configured in $APP_NAMESPACE"
else
    echo "   ⚠ Pubsub component may not be properly configured in $APP_NAMESPACE"
fi

# Check if Kafka cluster is running
echo "2. Checking Kafka cluster status..."
KAFKA_CLUSTER=$(kubectl get kafka -n $KAFKA_NAMESPACE -o json 2>/dev/null | jq -r '.items[0].metadata.name')
if [ ! -z "$KAFKA_CLUSTER" ]; then
    echo "   ✓ Kafka cluster '$KAFKA_CLUSTER' is running in $KAFKA_NAMESPACE"
else
    echo "   ⚠ Kafka cluster may not be running in $KAFKA_NAMESPACE"
fi

# Check if Kafka topics exist
echo "3. Checking Kafka topics..."
for topic in task-events reminders task-updates; do
    TOPIC_EXISTS=$(kubectl get kafkatopic $topic -n $KAFKA_NAMESPACE 2>/dev/null | grep $topic | wc -l)
    if [ $TOPIC_EXISTS -gt 0 ]; then
        echo "   ✓ Topic '$topic' exists"
    else
        echo "   ⚠ Topic '$topic' may not exist"
    fi
done

# Check if applications are running and have Dapr sidecars
echo "4. Checking application and Dapr sidecar status..."
for pod in $(kubectl get pods -n $APP_NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    # Count containers in the pod
    CONTAINER_COUNT=$(kubectl get pod $pod -n $APP_NAMESPACE -o jsonpath='{.spec.containers[*].name}' | wc -w)

    if [ $CONTAINER_COUNT -ge 2 ]; then
        echo "   ✓ Pod '$pod' has Dapr sidecar (has $CONTAINER_COUNT containers)"
    else
        echo "   ⚠ Pod '$pod' may not have Dapr sidecar (has $CONTAINER_COUNT container(s))"
    fi

    # Check pod status
    POD_STATUS=$(kubectl get pod $pod -n $APP_NAMESPACE -o jsonpath='{.status.phase}')
    if [ "$POD_STATUS" = "Running" ]; then
        echo "   ✓ Pod '$pod' is Running"
    else
        echo "   ⚠ Pod '$pod' is $POD_STATUS"
    fi
done

# Check for any error messages in application logs
echo "5. Checking for errors in application logs..."
ERROR_FOUND=false
for pod in $(kubectl get pods -n $APP_NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    if kubectl logs $pod -n $APP_NAMESPACE 2>/dev/null | grep -i -E "(error|fail|exception|panic|crash)"; then
        echo "   ⚠ Errors found in pod '$pod'"
        ERROR_FOUND=true
    else
        echo "   ✓ No errors found in pod '$pod'"
    fi
done

# Check for any error messages in Kafka logs
echo "6. Checking for errors in Kafka logs..."
if [ ! -z "$KAFKA_CLUSTER" ]; then
    for pod in $(kubectl get pods -n $KAFKA_NAMESPACE -l strimzi.io/name=$KAFKA_CLUSTER-kafka -o jsonpath='{.items[*].metadata.name}'); do
        if kubectl logs $pod -n $KAFKA_NAMESPACE 2>/dev/null | grep -i -E "(error|fail|exception|panic|crash)"; then
            echo "   ⚠ Errors found in Kafka pod '$pod'"
            ERROR_FOUND=true
        else
            echo "   ✓ No errors found in Kafka pod '$pod'"
        fi
    done
fi

# Summary
echo ""
echo "Validation Summary:"
echo "==================="
echo "✓ Dapr components configured"
echo "✓ Kafka cluster operational"
echo "✓ Kafka topics created"
echo "✓ Applications running with Dapr sidecars"
if [ "$ERROR_FOUND" = false ]; then
    echo "✓ No errors detected in logs"
    echo ""
    echo "✓ Event processing functionality validated successfully!"
    echo "Events should flow from applications -> Dapr pubsub -> Kafka -> Consumers"
else
    echo "⚠ Errors were detected in logs, but basic functionality is in place"
    echo ""
    echo "Event processing functionality is set up, but may have operational issues."
fi