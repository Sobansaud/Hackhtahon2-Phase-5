# Kubernetes Deployment Guide

## Minikube Cluster Setup

### 1. Start Minikube
```powershell
minikube start --driver=docker
```

### 2. Verify Cluster Status
```powershell
minikube status
kubectl cluster-info
```

### 3. Load Docker Images into Minikube
Since we're using local images, we need to load them into Minikube:

```powershell
# Point Docker CLI to Minikube's Docker daemon
minikube docker-env | Invoke-Expression

# Rebuild images in Minikube's Docker
cd backend
docker build -t sobansaud121/todo_backend:latest .

cd ../frontend
docker build -t sobansaud121/todo_frontend:latest .
```

### 4. Deploy Applications
```powershell
# Apply all manifests
kubectl apply -f k8s/

# Verify deployments
kubectl get deployments
kubectl get pods
kubectl get services
```

### 5. Access Applications

Get the Minikube IP and access via NodePort:
```powershell
# Get Minikube IP
minikube ip

# Access frontend: http://<minikube-ip>:30300
# Access backend: http://<minikube-ip>:30800
```

Or use Minikube service command:
```powershell
minikube service frontend-service
minikube service backend-service
```

## Kubernetes Manifests Created

### Backend (`k8s/backend.yaml`)
- **Deployment**: 1 replica of backend container
- **Service**: NodePort on port 30800
- **Environment**: SQLite database, configurable secret key

### Frontend (`k8s/frontend.yaml`)
- **Deployment**: 1 replica of frontend container
- **Service**: NodePort on port 30300
- **Environment**: API URL pointing to backend service

## Useful Commands

### View Logs
```powershell
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
```

### Scale Deployments
```powershell
kubectl scale deployment backend --replicas=3
kubectl scale deployment frontend --replicas=2
```

### Update Deployments
```powershell
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend
```

### Delete Deployments
```powershell
kubectl delete -f k8s/
```

### Access Kubernetes Dashboard
```powershell
minikube dashboard
```

### Stop Minikube
```powershell
minikube stop
```

### Delete Cluster
```powershell
minikube delete
```

## Troubleshooting

### Pods not starting?
```powershell
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Image pull errors?
Make sure images are built in Minikube's Docker daemon:
```powershell
minikube docker-env | Invoke-Expression
docker images | Select-String "todo"
```

### Service not accessible?
```powershell
kubectl get services
minikube service list
```
