# Minikube Dapr Deployer

## Overview
Deploy app with Dapr on Minikube:
- dapr init -k (if not done)
- Extend Helm charts with dapr.io/enabled: "true" annotations
- Deploy Dapr components first (kubectl apply)
- helm upgrade --install todo-app ./charts/todo
- Validate: dapr list, kubectl get pods -l dapr.io/enabled=true
- Test event flow locally

## Pre-execution
Before deploying, verify: "Confirm Minikube is running with sufficient resources?"

## Post-execution
Validate deployment with Dapr and test event flow functionality

## Implementation Guidelines

### 1. Dapr Initialization
- Check if Dapr is already installed with `dapr status -k`
- Run `dapr init -k` if not already installed
- Verify Dapr control plane components are running
- Wait for all Dapr system pods to be ready

### 2. Helm Chart Modification
- Add `dapr.io/enabled: "true"` annotations to deployment templates
- Configure Dapr sidecar settings (resources, ports, etc.)
- Add Dapr application port configuration if needed
- Update service account configurations for Dapr

### 3. Component Deployment
- Apply Dapr component configurations first with `kubectl apply`
- Verify components are properly registered with Dapr
- Check component statuses and connectivity
- Ensure all required components are deployed before app

### 4. Application Deployment
- Run `helm upgrade --install todo-app ./charts/todo`
- Monitor deployment progress and pod creation
- Verify Dapr sidecars are injected successfully
- Check for any deployment errors or warnings

### 5. Validation Steps
- Run `dapr list` to verify application is recognized by Dapr
- Use `kubectl get pods -l dapr.io/enabled=true` to check sidecar status
- Verify all application pods are running with Dapr sidecars
- Check Dapr sidecar logs for any errors

### 6. Event Flow Testing
- Test event publishing and consumption locally
- Verify Kafka/Redpanda connectivity through Dapr
- Confirm pub/sub functionality is working
- Validate scheduled tasks and reminders are operational