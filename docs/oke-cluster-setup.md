# Oracle Kubernetes Engine (OKE) Cluster Setup Guide

## Overview
This document outlines the process for creating an Oracle Kubernetes Engine (OKE) cluster in the Always-Free tier with 4 OCPUs and 24GB RAM for the Todo application deployment.

## Prerequisites
- Oracle Cloud account with appropriate permissions
- OCI CLI installed and configured
- Required compartments, VCN, and subnets created (per oci-infrastructure-setup.md)
- API signing key configured

## Step 1: Verify Always-Free Eligibility

### Check Always-Free Limits:
1. Navigate to Oracle Cloud Console > Governance and Administration > Limits, Quotas and Usage
2. Verify available Always-Free resources:
   - Container Instances: 10 OCPU
   - Container Memory: 50 GB
3. Ensure sufficient resources are available for your cluster

## Step 2: Create OKE Cluster via OCI Console

### Using Oracle Cloud Console:
1. Navigate to Developer Services > Kubernetes Clusters (OKE)
2. Click "Create Cluster"
3. Select "Quick Create" for a simple setup or "Custom Create" for advanced configuration

### Quick Create Method:
1. Fill in cluster details:
   - Name: `todo-oke-cluster`
   - Version: Latest stable Kubernetes version
   - Compartment: Select your dedicated compartment
   - VCN: Select the VCN created earlier
   - Public Subnet: Select one of the public subnets created earlier
   - Private Subnet: Select one of the private subnets created earlier

2. Configure Node Pool:
   - Name: `todo-node-pool`
   - Version: Match cluster version
   - Shape: For Always-Free, use `VM.Standard.E4.Flex` with flexible configuration
   - OCPUs per node: 4 (to stay within Always-Free limits)
   - Memory per node: 24 GB (to stay within Always-Free limits)
   - Number of nodes: 1 (to stay within Always-Free limits)
   - Availability Domain: Select one AD or "No Preference"

3. Configure Node Security:
   - SSH public key (for node access if needed)
   - Kubernetes Network Policy: Calico (recommended)

4. Click "Create Cluster" and wait for provisioning

## Step 3: Create OKE Cluster via OCI CLI

### Using OCI CLI:
```bash
# Create the cluster
oci ce cluster create \\
  --name "todo-oke-cluster" \\
  --kubernetes-version "v1.28.2" \\  # Use latest supported version
  --vcn-id "<your-vcn-ocid>" \\
  --service-lb-subnet-ids "[\\"<public-subnet-ocid>\\"]" \\
  --compartment-id "<your-compartment-ocid>" \\
  --endpoint-config "{\"isPublicIpEnabled\": true}" \\
  --options "{\"serviceLbSubnetIds\": [\"<public-subnet-ocid>\"]}"

# Create the node pool
NODEPOOL_ID=$(oci ce nodepool create \\
  --name "todo-node-pool" \\
  --cluster-id <cluster-ocid> \\
  --compartment-id "<your-compartment-ocid>" \\
  --node-shape "VM.Standard.E4.Flex" \\
  --node-shape-config '{"ocpus": 4, "memoryInGBs": 24}' \\
  --subnet-ids "[\\"<private-subnet-ocid>\\"]" \\
  --num-nodes 1 \\
  --ssh-public-key-file ~/.ssh/id_rsa.pub \\
  --wait-for-state ACTIVE \\
  --query 'data.id' \\
  --raw-output)
```

## Step 4: Configure kubectl Access

### Get Cluster Kubeconfig:
```bash
# Via OCI CLI
oci ce cluster create-kubeconfig --cluster-id <your-cluster-ocid> --file $HOME/.kube/config

# Set appropriate permissions
chmod 600 $HOME/.kube/config

# Verify cluster access
kubectl get nodes
```

### Via Console:
1. Navigate to your cluster in the console
2. Click "Access Cluster"
3. Choose "Local Access"
4. Follow the instructions to download and configure kubeconfig

## Step 5: Verify Cluster Configuration

### Check Cluster Status:
```bash
# Check cluster info
kubectl cluster-info

# Check nodes
kubectl get nodes -o wide

# Check node resources
kubectl describe nodes

# Verify Always-Free compliance
kubectl top nodes
```

## Step 6: Configure Cluster Add-ons

### Install NVIDIA GPU Operator (if needed):
```bash
# Only if GPU workloads are planned
kubectl apply -f https://raw.githubusercontent.com/NVIDIA/gpu-operator/master/deployments/gpu-operator.yaml
```

### Configure Network Policies:
```bash
# If using Calico, verify it's running
kubectl get pods -n kube-system | grep calico
```

## Step 7: Set Up Monitoring and Logging

### Enable OKE Monitoring:
1. In Oracle Cloud Console > OKE cluster details
2. Navigate to "Monitoring" tab
3. Enable Container Insights if available in your tier

## Step 8: Configure Cluster Autoscaling (Optional)

### For Production Clusters:
```bash
# Install Cluster Autoscaler (check if compatible with Always-Free)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/oci/examples/cluster-autoscaler-one-oke.yaml
```

## Step 9: Set Up Resource Quotas and Limit Ranges

### Create Resource Quotas:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: todo
spec:
  hard:
    requests.cpu: "4"      # Adjust based on your node capacity
    requests.memory: 24Gi  # Adjust based on your node capacity
    limits.cpu: "4"
    limits.memory: 24Gi
```

## Security Best Practices

### For Cluster Creation:
- Use private subnets for worker nodes
- Apply appropriate security lists
- Use Kubernetes RBAC for access control
- Enable audit logging if available
- Use pod security policies/admission controllers

### For Always-Free Optimization:
- Monitor resource usage closely
- Set up alerts for approaching limits
- Use resource limits and requests in deployments
- Schedule non-critical workloads during off-peak hours

## Cost Management

### Always-Free Tier Monitoring:
- Track OCPU and memory usage
- Monitor for any charges beyond Always-Free allowance
- Set up billing alerts
- Regularly review running resources

## Troubleshooting

### Common Issues:
1. **Insufficient Resources**: Verify Always-Free limits haven't been exceeded
2. **Node Pool Creation Failure**: Check shape availability in your region/AD
3. **Networking Issues**: Verify subnet configurations and security lists

### Debugging Commands:
```bash
# Check cluster events
kubectl get events --all-namespaces

# Check OKE service status
oci ce cluster list --compartment-id <your-compartment-ocid>

# Verify kubeconfig
kubectl config current-context
```

## Next Steps

Once the cluster is created:
1. Install Dapr runtime on the cluster
2. Deploy Dapr components
3. Configure monitoring and logging
4. Deploy the application using Helm charts
5. Test the full deployment pipeline