# Minikube Deploy Skill

## Purpose
This skill provides a complete deployment sequence for Minikube, including cluster setup, addon configuration, Helm chart installation, and validation commands for the todo-app chart.

## Capabilities
- Start Minikube with Docker driver
- Enable necessary Minikube addons (ingress, etc.)
- Add Helm repositories and install todo-app chart
- Set up port forwarding for services
- Validate deployment status and functionality
- Provide comprehensive deployment sequence

## Implementation Details

### Minikube Initialization
- Start Minikube cluster with Docker driver
- Configure appropriate resources (CPUs, memory, disk)
- Verify cluster status after startup
- Handle common startup issues and troubleshooting

### Addon Configuration
- Enable ingress addon if required for the application
- Verify addon status after enabling
- Configure addon settings as needed
- Handle addon-specific prerequisites

### Helm Repository Management
- Add Helm repositories for required charts
- Update Helm repositories to fetch latest charts
- Verify repository addition and availability
- Handle repository authentication if required

### Chart Installation
- Install todo-app chart with appropriate values
- Configure chart parameters during installation
- Monitor installation progress
- Handle installation errors and rollback if needed

### Service Exposure
- Set up port forwarding for frontend and backend services
- Configure appropriate ports (3000 for frontend, 8000 for backend)
- Verify service connectivity after port forwarding
- Handle firewall and network configuration issues

### Validation Commands
- Check pod statuses and readiness
- Verify service endpoints are reachable
- Test basic functionality of deployed application
- Generate status reports for deployment validation

## Usage

### Complete Deployment Sequence:
```bash
# Start Minikube cluster
minikube start --driver=docker

# Enable necessary addons
minikube addons enable ingress

# Verify cluster status
kubectl cluster-info
kubectl get nodes

# Add Helm repository
helm repo add my-repo https://my-helm-repo.com/charts
helm repo update

# Install todo-app chart
helm install todo-app my-repo/todo-app --values values.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=todo-app --timeout=300s

# Set up port forwarding
kubectl port-forward svc/todo-app-frontend 3000:3000 &
kubectl port-forward svc/todo-app-backend 8000:8000 &

# Validate deployment
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get ingress  # if using ingress
```

### Validation Commands:
```bash
# Check pod statuses
kubectl get pods -o wide

# Check service endpoints
kubectl get svc

# Check deployment status
kubectl get deployments -o wide

# Describe pods for detailed information
kubectl describe pods

# Check logs for any issues
kubectl logs -l app=todo-app

# Test service connectivity
curl http://localhost:3000  # frontend
curl http://localhost:8000  # backend

# Verify ingress (if applicable)
minikube tunnel  # in separate terminal
kubectl get ingress
```

### Cleanup Commands:
```bash
# Uninstall the chart
helm uninstall todo-app

# Stop port forwarding (Ctrl+C or kill the process)

# Stop Minikube
minikube stop

# Delete Minikube cluster (optional)
minikube delete
```