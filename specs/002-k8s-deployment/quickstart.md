# Quickstart Guide: Local Kubernetes Deployment for The Evolution of Todo - Phase IV

**Date**: 2026-01-21
**Feature**: 002-k8s-deployment

## Prerequisites

- Docker Desktop with Gordon AI enabled (or Docker Engine)
- Minikube (latest version)
- Helm 3+
- kubectl
- kubectl-ai plugin
- kagent (Kubernetes AI agent)
- Access to Cohere API key

## Setup Process

### 1. Environment Preparation

```bash
# Start Minikube with recommended resources for chatbot performance
minikube start --driver=docker --cpus=4 --memory=8192

# Enable ingress addon
minikube addons enable ingress

# Verify cluster is ready
kubectl cluster-info
kubectl get nodes
```

### 2. Containerization Phase

```bash
# Use Gordon AI to generate optimized Dockerfiles for frontend and backend
# (This step would typically be handled by the Docker Engineer agent)

# Build Docker images
# Frontend
docker build -t todo-frontend:latest ./frontend

# Backend
docker build -t todo-backend:latest ./backend

# Load images into Minikube
minikube image load todo-frontend:latest
minikube image load todo-backend:latest
```

### 3. Helm Chart Generation

```bash
# Use kubectl-ai to generate initial Helm charts
# (This step would typically be handled by the Helm Chart Engineer agent)

# Example commands that might be used:
kubectl ai create deployment todo-frontend --image=todo-frontend:latest --dry-run=client -o yaml
kubectl ai create service todo-frontend --tcp=80:3000 --dry-run=client -o yaml

# Then kagent would refine and optimize the charts
```

### 4. Deployment to Minikube

```bash
# Install Helm charts to Minikube
helm install todo-app ./charts/todo-app --set frontend.image.tag=latest --set backend.image.tag=latest

# Wait for all pods to be ready
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=300s
```

### 5. Access the Application

```bash
# Option 1: Using ingress (recommended)
minikube tunnel  # Run in separate terminal

# Access via browser: http://todo.local (or configured ingress host)

# Option 2: Using port forwarding (fallback)
kubectl port-forward svc/todo-frontend 3000:80
kubectl port-forward svc/todo-backend 8000:8000
```

### 6. Verification

```bash
# Check all resources are running
kubectl get pods,services,ingress,hpa

# Verify application functionality
curl http://localhost:3000/api/health  # Backend health check
# Or test via UI in browser

# Check logs
kubectl logs -l app=todo-frontend
kubectl logs -l app=todo-backend
```

## AI-Assisted Operations

### Using kagent for optimization:
```bash
# Get recommendations for resource optimization
kagent analyze todo-frontend

# Scale deployments based on load
kagent scale todo-backend --replicas=3

# Troubleshoot issues
kagent troubleshoot pod/todo-frontend-xxxxx
```

### Using kubectl-ai for management:
```bash
# Get current status in natural language
kubectl ai "show me the status of all deployments"

# Create resources with natural language
kubectl ai "create a service monitor for the frontend"
```

## Environment Variables & Secrets Setup

Before deploying, ensure you have the required environment variables:

```bash
# Create Kubernetes secrets for sensitive data
kubectl create secret generic todo-secrets \
  --from-literal=BETTER_AUTH_SECRET="your_auth_secret" \
  --from-literal=COHERE_API_KEY="your_cohere_api_key" \
  --from-literal=DATABASE_URL="your_database_url"
```

## Troubleshooting

### Common Issues:

1. **Images not found in Minikube**:
   - Ensure images are loaded: `minikube image load <image>:<tag>`

2. **Ingress not accessible**:
   - Verify minikube tunnel is running
   - Check ingress controller status: `kubectl get pods -n ingress-nginx`

3. **Resource constraints**:
   - Increase Minikube resources if pods are evicted
   - Monitor resource usage: `kubectl top nodes,pods`

### Reset Deployment:
```bash
# Uninstall Helm release
helm uninstall todo-app

# Clean up any remaining resources
kubectl delete pvc --all
kubectl delete secrets --selector=app=todo
```

## Demo Script

For hackathon judges, prepare this script:

1. Show the containerization with Gordon AI
2. Demonstrate Helm chart generation with kubectl-ai
3. Deploy to Minikube and access the application
4. Show AI-assisted operations with kagent
5. Demonstrate resilience with simulated failures
6. Highlight production-ready features (HPA, probes, etc.)

## Cleanup

```bash
# Uninstall Helm release
helm uninstall todo-app

# Stop minikube
minikube stop

# Optionally delete the cluster
minikube delete
```