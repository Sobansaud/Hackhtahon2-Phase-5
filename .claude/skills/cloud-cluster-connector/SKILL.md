# Cloud Cluster Connector

## Overview
Connect to cloud Kubernetes clusters:
- Azure AKS: az aks get-credentials --resource-group ... --name ...
- Google GKE: gcloud container clusters get-credentials ...
- Oracle OKE: oci ce cluster create-kubeconfig ...
- Switch context: kubectl config use-context ...
- Verify: kubectl get nodes
- Ask before switching: "Switch to [cloud] cluster?"

## Pre-execution
Before connecting, verify: "Switch to [cloud] cluster?"

## Post-execution
Validate connection with kubectl get nodes command

## Implementation Guidelines

### 1. Azure AKS Connection
- Use az aks get-credentials command to connect to AKS cluster
- Specify resource group and cluster name
- Verify credentials are stored in kubeconfig
- Check cluster access permissions

### 2. Google GKE Connection
- Use gcloud container clusters get-credentials command
- Specify cluster name, zone, and project
- Verify credentials are properly configured
- Test access to GKE cluster

### 3. Oracle OKE Connection
- Use oci ce cluster create-kubeconfig command
- Specify cluster OCID and output location
- Verify kubeconfig is properly formatted
- Test connectivity to OKE cluster

### 4. Context Management
- Switch to appropriate context with kubectl config use-context
- Verify current context with kubectl config current-context
- Save original context before switching if needed
- Manage multiple contexts efficiently

### 5. Connection Validation
- Run kubectl get nodes to verify cluster connectivity
- Check node status and readiness
- Verify cluster capacity and resources
- Confirm access permissions are sufficient

### 6. Safety Checks
- Always ask for confirmation before switching contexts
- Warn about potential impacts of context switching
- Verify cluster stability before performing operations
- Document current context state before and after switching