#!/bin/bash

# Script to test alerting functionality with simulated issues
# This script creates scenarios that should trigger alerts and verifies the alerting system

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

echo "Testing alerting functionality with simulated issues..."

# Define namespaces
MONITORING_NAMESPACE="monitoring"
TODO_NAMESPACE="todo"

echo "1. Verifying alerting system components..."

# Check if Alertmanager is running
ALERTMANAGER_POD=$(kubectl get pods -n $MONITORING_NAMESPACE -l app.kubernetes.io/name=alertmanager -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || \
                  kubectl get pods -n $MONITORING_NAMESPACE -l app=alertmanager -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ ! -z "$ALERTMANAGER_POD" ]; then
    echo "   ✓ Alertmanager pod found: $ALERTMANAGER_POD"
else
    echo "   ⚠ Alertmanager pod not found"
fi

# Check if Prometheus has alert rules configured
echo "2. Checking alert rules configuration..."
kubectl get prometheusrules -n $MONITORING_NAMESPACE || echo "   No PrometheusRules found in $MONITORING_NAMESPACE"

# Check the existing alert rules from the monitoring/alerts directory
if [ -f "../monitoring/alerts/pod-crash.rules" ]; then
    echo "   ✓ Pod crash alert rules found"
    cat ../monitoring/alerts/pod-crash.rules
else
    echo "   ⚠ Pod crash alert rules file not found"
fi

echo ""
echo "3. Testing alerting with simulated scenarios..."

# Test 1: Check if there are any current alerts firing
echo "Current alerts firing:"
kubectl exec $ALERTMANAGER_POD -n $MONITORING_NAMESPACE -- wget -qO- http://localhost:9093/api/v2/alerts || echo "Could not access Alertmanager API"

echo ""
echo "4. Creating test scenarios to trigger alerts..."

# Scenario 1: Create a pod that will crash to trigger pod crash alerts
echo "Creating a test pod that will crash (to test pod crash alert)..."
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: test-crash-pod
  namespace: $TODO_NAMESPACE
  labels:
    test: crash-alert
spec:
  containers:
  - name: crash-test
    image: busybox
    command: ['sh', '-c', 'exit 1']
  restartPolicy: Always
EOF

# Scenario 2: Create a high CPU stress pod to potentially trigger resource alerts
echo "Creating a high CPU stress pod (to test resource alerts)..."
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: test-stress-pod
  namespace: $TODO_NAMESPACE
  labels:
    test: resource-alert
spec:
  containers:
  - name: stress-test
    image: polinux/stress
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    command: ["stress"]
    args: ["--cpu", "1", "--timeout", "60s"]
EOF

echo ""
echo "5. Waiting for potential alerts to fire (waiting 2 minutes)..."
sleep 120

# Check for any firing alerts again
echo "Alerts firing after test scenarios:"
kubectl exec $ALERTMANAGER_POD -n $MONITORING_NAMESPACE -- wget -qO- http://localhost:9093/api/v2/alerts | grep -i firing || echo "No alerts currently firing"

echo ""
echo "6. Cleaning up test pods..."
kubectl delete pod test-crash-pod -n $TODO_NAMESPACE --ignore-not-found
kubectl delete pod test-stress-pod -n $TODO_NAMESPACE --ignore-not-found

echo ""
echo "7. Verifying alertmanager configuration..."
if [ ! -z "$ALERTMANAGER_POD" ]; then
    kubectl exec $ALERTMANAGER_POD -n $MONITORING_NAMESPACE -- cat /etc/alertmanager/config.yml || echo "Could not access Alertmanager config"
fi

echo ""
echo "Alerting functionality test completed!"
echo ""
echo "Note: In a real environment, you would see:"
echo "- Alerts triggered by the simulated scenarios"
echo "- Notifications sent to configured channels (Slack, email, etc.)"
echo "- Alerts visible in the Alertmanager UI"
echo ""
echo "The alerting system includes rules for:"
echo "- Pod crashes and restart loops"
echo "- High CPU and memory usage"
echo "- Unready pods"
echo "- Node resource exhaustion"
echo "- Dapr component failures"