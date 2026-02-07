# Dapr Runtime Installation on Oracle Kubernetes Engine (OKE)

## Overview
This document outlines the process for installing Dapr runtime on Oracle Kubernetes Engine (OKE) with high availability configuration for the Todo application.

## Prerequisites
- OKE cluster created and accessible via kubectl
- kubectl configured and pointing to the correct cluster
- Helm 3.x installed locally
- Administrative access to the OKE cluster
- Network connectivity to download Dapr components

## Step 1: Verify Cluster Connectivity

### Check Cluster Status:
```bash
kubectl cluster-info
kubectl get nodes
```

### Verify Kubectl Context:
```bash
kubectl config current-context
```

## Step 2: Add Dapr Helm Repository

### Add and Update Dapr Repository:
```bash
# Add the Dapr Helm repository
helm repo add dapr https://dapr.github.io/helm-charts/

# Update the repository to get the latest charts
helm repo update
```

## Step 3: Install Dapr with High Availability

### Create Dapr Namespace:
```bash
kubectl create namespace dapr-system
```

### Install Dapr with HA Configuration:
```bash
# Install Dapr with high availability settings
helm install dapr dapr/dapr \\
  --namespace dapr-system \\
  --set global.ha.enabled=true \\
  --set global.mtls.enabled=true \\
  --set dapr_operator.replicaCount=3 \\
  --set dapr_placement.replicaCount=3 \\
  --set dapr_sidecar_injector.replicaCount=2 \\
  --set dapr_sentry.replicaCount=3 \\
  --atomic \\
  --wait
```

### Alternative: Using a values file for more complex configuration:
```bash
# Create a values file for customization
cat <<EOF > dapr-ha-values.yaml
global:
  ha:
    enabled: true
  mtls:
    enabled: true

dapr_operator:
  replicaCount: 3

dapr_placement:
  replicaCount: 3

dapr_sidecar_injector:
  replicaCount: 2

dapr_sentry:
  replicaCount: 3

# Additional configuration for production
resources:
  limits:
    cpu: 4
    memory: 8Gi
  requests:
    cpu: 500m
    memory: 1Gi

affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - dapr-placement-server
        topologyKey: kubernetes.io/hostname
EOF

# Install using the values file
helm install dapr dapr/dapr \\
  --namespace dapr-system \\
  -f dapr-ha-values.yaml \\
  --atomic \\
  --wait
```

## Step 4: Verify Dapr Installation

### Check Dapr Control Plane Status:
```bash
# Verify all Dapr pods are running
kubectl get pods -n dapr-system

# Check Dapr control plane services
kubectl get svc -n dapr-system

# Verify Dapr version
dapr --version

# Check Dapr health
dapr status -k
```

### Expected Output:
You should see multiple replicas for each Dapr component (operator, placement, sidecar-injector, sentry) with all pods in "Running" state.

## Step 5: Configure Dapr Components

### Create Default Components (if needed):
```bash
# Create a default state store component
kubectl apply -f - <<EOF
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
  namespace: default
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: localhost:6379
  - name: redisPassword
    value: ""
EOF

# Create a default pubsub component
kubectl apply -f - <<EOF
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
  namespace: default
spec:
  type: pubsub.redis
  version: v1
  metadata:
  - name: redisHost
    value: localhost:6379
  - name: redisPassword
    value: ""
EOF
```

## Step 6: Configure Dapr for Your Applications

### Annotate Namespaces for Automatic Sidecar Injection:
```bash
# Enable automatic sidecar injection for the todo namespace
kubectl create namespace todo
kubectl label namespace todo dapr.io/inject-enabled=true
```

### Or Annotate Individual Deployments:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-app
spec:
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "todo-app"
        dapr.io/app-port: "8080"
        dapr.io/config: "app-config"
        dapr.io/log-level: "info"
    spec:
      containers:
      - name: app
        image: your-app-image
```

## Step 7: Verify Dapr Functionality

### Test Dapr Placement Health:
```bash
# Check placement service
kubectl logs -l app=dapr-placement-server -n dapr-system
```

### Test Sidecar Injection:
```bash
# Deploy a simple test app to verify injection
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dapr-test-app
  namespace: todo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: dapr-test-app
  template:
    metadata:
      labels:
        app: dapr-test-app
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "dapr-test-app"
        dapr.io/app-port: "3000"
    spec:
      containers:
      - name: app
        image: nginx
        ports:
        - containerPort: 3000
EOF

# Verify the pod has both app and dapr sidecar containers
kubectl get pods -n todo
kubectl describe pod -l app=dapr-test-app -n todo
```

## Step 8: Configure Dapr for Production

### Set Up Observability:
```bash
# Expose Dapr metrics to your monitoring system
kubectl patch deployment dapr-sidecar-injector -n dapr-system -p '{"spec":{"template":{"spec":{"containers":[{"name":"sidecar-injector","ports":[{"containerPort":9090,"name":"metrics","protocol":"TCP"}]}]}}}}'
```

### Configure Resource Limits:
```bash
# Update Dapr with appropriate resource limits for production
helm upgrade dapr dapr/dapr \\
  --namespace dapr-system \\
  --set global.ha.enabled=true \\
  --set dapr_operator.resources.limits.cpu=1 \\
  --set dapr_operator.resources.limits.memory=1Gi \\
  --set dapr_placement.resources.limits.cpu=1 \\
  --set dapr_placement.resources.limits.memory=1Gi \\
  --wait
```

## Security Best Practices

### For Production:
- Enable mTLS for service-to-service communication
- Use appropriate RBAC permissions
- Regularly update Dapr to the latest secure version
- Monitor Dapr logs for security events
- Use secrets management for sensitive data

### For HA Configuration:
- Ensure pods are distributed across availability zones/nodes
- Set up proper health checks and liveness probes
- Configure appropriate resource requests and limits
- Monitor cluster resources to prevent overcommitment

## Troubleshooting

### Common Issues:
1. **Sidecar injection not working**: Verify namespace labels and pod annotations
2. **Control plane not ready**: Check resource availability and cluster capacity
3. **Communication errors**: Verify mTLS configuration and network policies

### Debugging Commands:
```bash
# Check Dapr logs
kubectl logs -l app=dapr-placement-server -n dapr-system
kubectl logs -l app=dapr-operator -n dapr-system
kubectl logs -l app=dapr-sidecar-injector -n dapr-system
kubectl logs -l app=dapr-sentry -n dapr-system

# Describe pods for detailed information
kubectl describe pod -l app=dapr-placement-server -n dapr-system

# Check cluster events
kubectl get events -n dapr-system
```

## Next Steps

Once Dapr is installed:
1. Configure Dapr components for your specific needs (pubsub, state, secrets)
2. Update your application deployments to use Dapr annotations
3. Test Dapr functionality with your application
4. Monitor Dapr performance and adjust resources as needed