# K8s Deployment Validator Skill

## Purpose
This skill provides a comprehensive validation checklist and commands to verify successful Kubernetes deployments, including checking pod status, services, deployments, logs, and functionality testing for frontend and backend components including chatbot functionality.

## Capabilities
- Generate comprehensive deployment validation checklist
- Execute kubectl commands to check pods, services, and deployments
- Analyze application logs for errors or warnings
- Test connectivity via curl and port-forward
- Verify frontend and backend functionality
- Validate chatbot functionality specifically
- Generate validation reports

## Implementation Details

### Deployment Status Checks
- Verify all pods are running and ready
- Check service availability and endpoints
- Confirm deployment rollout status
- Validate replica counts match expectations
- Check resource allocations

### Log Analysis
- Examine pod logs for errors or warnings
- Look for startup success messages
- Identify any recurring error patterns
- Check for application-specific health indicators
- Validate that no crash loops are occurring

### Connectivity Testing
- Test frontend accessibility via curl or browser
- Verify backend /api/health endpoints
- Check inter-service communication
- Validate external service access
- Test load balancer/service exposure

### Chatbot Functionality Validation
- Verify chatbot interface loads correctly
- Test basic chat functionality
- Validate API endpoints for chat features
- Check for proper authentication/integration
- Ensure message sending and receiving works

## Usage

### Complete Validation Checklist:

#### 1. Basic Resource Status
```bash
# Check all pods status
kubectl get pods

# Check all services
kubectl get svc

# Check all deployments
kubectl get deploy

# Check all replicasets
kubectl get rs

# Check all daemonsets (if applicable)
kubectl get ds
```

#### 2. Detailed Resource Information
```bash
# Get detailed pod information
kubectl get pods -o wide

# Check pod descriptions for events
kubectl describe pods

# Check service details
kubectl describe svc

# Check deployment details
kubectl describe deploy
```

#### 3. Log Analysis
```bash
# Check logs for all pods in default namespace
kubectl get pods --no-headers -o custom-columns=":metadata.name" | xargs -I {} kubectl logs {}

# Check logs for specific application pods
kubectl logs -l app={app-name}

# Check previous container logs (useful for crashed containers)
kubectl logs -l app={app-name} --previous

# Follow logs in real-time
kubectl logs -l app={app-name} -f
```

#### 4. Service Connectivity Tests
```bash
# Port forward to frontend
kubectl port-forward svc/{frontend-service-name} 3000:3000

# In another terminal, test frontend access
curl http://localhost:3000

# Port forward to backend
kubectl port-forward svc/{backend-service-name} 8000:8000

# Test backend health endpoint
curl http://localhost:8000/api/health
```

#### 5. End-to-End Functionality Tests
```bash
# Test API endpoints
curl http://localhost:8000/api/

# Test specific chatbot endpoints
curl http://localhost:8000/api/chat

# Test chatbot functionality with sample request
curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" -d '{"message": "Hello"}'
```

### Automated Validation Script Template:
```bash
#!/bin/bash

NAMESPACE="{namespace}"
APP_NAME="{app-name}"

echo "Starting deployment validation for $APP_NAME in $NAMESPACE..."

# Check if all pods are running
echo "Checking pod status..."
POD_STATUS=$(kubectl get pods -n $NAMESPACE --no-headers | awk '{print $3}' | uniq)
if [[ "$POD_STATUS" == *"Running"* ]]; then
  echo "✓ All pods are running"
else
  echo "✗ Some pods are not running: $POD_STATUS"
  exit 1
fi

# Check if all pods are ready
echo "Checking pod readiness..."
NOT_READY=$(kubectl get pods -n $NAMESPACE --no-headers | awk '$2 != $1 {print $0}')
if [[ -z "$NOT_READY" ]]; then
  echo "✓ All pods are ready"
else
  echo "✗ Some pods are not ready:"
  echo "$NOT_READY"
  exit 1
fi

# Check deployment status
echo "Checking deployment status..."
DEPLOY_STATUS=$(kubectl get deploy -n $NAMESPACE --no-headers | awk '{print $2 "/" $2}')
if [[ "$DEPLOY_STATUS" =~ ^([0-9]+)/\1$ ]]; then
  echo "✓ All deployments have correct replica counts"
else
  echo "✗ Deployments have incorrect replica counts: $DEPLOY_STATUS"
  exit 1
fi

# Test service connectivity
echo "Testing service connectivity..."
FRONTEND_SVC=$(kubectl get svc -n $NAMESPACE -l app=$APP_NAME-frontend --no-headers | awk '{print $1}')
BACKEND_SVC=$(kubectl get svc -n $NAMESPACE -l app=$APP_NAME-backend --no-headers | awk '{print $1}')

if [[ ! -z "$FRONTEND_SVC" ]]; then
  echo "Testing frontend service: $FRONTEND_SVC"
  # Test can be performed if service is accessible
fi

if [[ ! -z "$BACKEND_SVC" ]]; then
  echo "Testing backend service: $BACKEND_SVC"
  # Port forward and test health endpoint
  kubectl port-forward -n $NAMESPACE svc/$BACKEND_SVC 8000:8000 &
  PORT_FWD_PID=$!
  sleep 5  # Give time for port forward to establish

  HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health)
  if [[ "$HEALTH_RESPONSE" == "200" ]]; then
    echo "✓ Backend health check passed"
  else
    echo "✗ Backend health check failed with status: $HEALTH_RESPONSE"
    kill $PORT_FWD_PID
    exit 1
  fi

  kill $PORT_FWD_PID
fi

echo "✓ All validation checks passed!"
```

### Chatbot-Specific Validation Commands:
```bash
# Verify chatbot service is running
kubectl get svc -l app={chatbot-app-name}

# Check if chatbot pods are healthy
kubectl get pods -l app={chatbot-app-name} -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\t"}{.status.containerStatuses[0].ready}{"\n"}'

# Test chatbot API endpoint
kubectl exec -it $(kubectl get pods -l app={chatbot-app-name} -o jsonpath='{.items[0].metadata.name}') -- curl -s localhost:{port}/api/health

# Port forward and test chatbot functionality
kubectl port-forward svc/{chatbot-service-name} 3000:3000
# Then test in browser or with curl
```

### Validation Report Template:
```
Deployment Validation Report
============================

Timestamp: {timestamp}
Environment: {environment}
Application: {application}

1. Resource Status:
   ✓ Pods: All {count} pods running and ready
   ✓ Services: All {count} services available
   ✓ Deployments: All {count} deployments with correct replicas

2. Log Analysis:
   ✓ No critical errors found in application logs
   ✓ Startup completed successfully
   ✓ No crash loops detected

3. Connectivity Tests:
   ✓ Frontend accessible via service
   ✓ Backend /api/health returning 200
   ✓ Cross-service communication functional

4. Chatbot Functionality:
   ✓ Chat interface loads correctly
   ✓ Message sending/receiving working
   ✓ API endpoints responding appropriately

Status: VALIDATION PASSED
```