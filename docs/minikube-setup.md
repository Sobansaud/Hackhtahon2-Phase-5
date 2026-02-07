# Minikube Setup for Local Development

## Overview
This document describes the local Minikube environment setup for development and testing of the Dapr and Kafka integration before deploying to production.

## Prerequisites
- Virtualization enabled in BIOS/UEFI (Intel VT-x or AMD-V)
- At least 8GB of RAM (recommended 16GB for smooth operation)
- Administrative privileges to run hypervisor tools
- Docker Desktop or compatible container runtime

## Windows Hypervisor Options
Choose one of the following hypervisor backends:

### Option 1: Hyper-V (Recommended for Windows Pro/Enterprise)
1. Enable Hyper-V feature in Windows Features:
   - Go to "Turn Windows features on or off"
   - Check "Hyper-V" and "Hyper-V Platform"
   - Restart your computer

2. Configure Hyper-V:
   - Open Hyper-V Manager as Administrator
   - Ensure virtualization is properly enabled
   - Create an external virtual switch if needed

3. Start Minikube with Hyper-V:
   ```bash
   minikube start --cpus=4 --memory=8192 --driver=hyperv
   ```

### Option 2: VirtualBox
1. Download and install VirtualBox from virtualbox.org
2. Install VirtualBox Extension Pack
3. Start Minikube with VirtualBox:
   ```bash
   minikube start --cpus=4 --memory=8192 --driver=virtualbox
   ```

### Option 3: Docker Driver (Alternative for Windows)
If using Docker Desktop:
```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

## Minikube Configuration for Dapr & Kafka

### 1. Install Dapr in Minikube
```bash
# Ensure minikube is running
minikube status

# Install Dapr runtime
dapr init -k
```

### 2. Install Strimzi Kafka Operator
```bash
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl create -f 'https://strimzi.io/examples/latest/kafka/kafka-ephemeral-single.yaml' -n kafka
```

### 3. Verify Installation
```bash
# Check Dapr status
dapr status -k

# Check Kafka cluster
kubectl get pods -n kafka

# Check if Kafka topics can be created
kubectl apply -f kafka/topics/task-events.yaml
kubectl apply -f kafka/topics/reminders.yaml
kubectl apply -f kafka/topics/task-updates.yaml
```

## Common Issues and Solutions

### Issue: Driver not found
**Solution**: Install the appropriate hypervisor (Hyper-V, VirtualBox) and ensure it's running

### Issue: Insufficient resources
**Solution**: Adjust the --memory and --cpus parameters based on available system resources

### Issue: Permission errors
**Solution**: Run command prompt/powershell as Administrator

### Issue: Network connectivity problems
**Solution**: Check firewall settings and ensure Docker/Hyper-V services are running

## Development Workflow

### 1. Start the environment
```bash
minikube start --cpus=4 --memory=8192
dapr init -k
# Wait for Dapr to be ready
kubectl wait --for=condition=ready pods -l app=dapr-operator -n dapr-system --timeout=300s
```

### 2. Deploy the application
```bash
helm install todo-app ./charts/todo --set dapr.enabled=true --set image.tag=dev --namespace todo --create-namespace
```

### 3. Test event streaming
```bash
# Port forward to access the application
kubectl port-forward -n todo svc/todo-frontend 3000:80

# Create test events and verify they flow through Kafka
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test","description":"Test event"}'
```

### 4. Stop the environment
```bash
minikube stop
```

## Resource Optimization for Windows
- Close unnecessary applications to free up RAM
- Consider increasing Windows virtual memory settings
- Use SSD storage for better I/O performance
- Monitor system resources during development

## Alternative: Using Docker Desktop
If Minikube proves challenging on your Windows system, consider using Docker Desktop with kind (Kubernetes in Docker):
```bash
# Install kind
go install sigs.k8s.io/kind@v0.20.0

# Create cluster
kind create cluster --name todo-dev --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```