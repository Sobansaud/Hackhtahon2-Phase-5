# Oracle Cloud Infrastructure (OCI) Setup Guide

## Overview
This document outlines the process for setting up the required Oracle Cloud Infrastructure components for deploying the Todo application to Oracle Kubernetes Engine (OKE).

## Prerequisites
- Oracle Cloud account with appropriate permissions (Administrator or equivalent)
- OCI CLI installed and configured (if using CLI approach)
- API signing key configured
- Payment method registered (for tracking usage against Always-Free tier)

## Step 1: Create OCI Compartment

### Using OCI Console:
1. Log in to Oracle Cloud Console (console.oraclecloud.com)
2. Navigate to Identity & Security > Compartments
3. Click "Create Compartment"
4. Fill in the details:
   - Name: `todo-app-compartment` (or preferred name)
   - Description: "Compartment for Todo application resources"
   - Parent Compartment: Select your root compartment or preferred parent
5. Click "Create Compartment"
6. Note down the compartment OCID for future reference

### Using OCI CLI:
```bash
oci iam compartment create \\
  --name "todo-app-compartment" \\
  --description "Compartment for Todo application resources" \\
  --compartment-id <parent-compartment-ocid>
```

## Step 2: Create Virtual Cloud Network (VCN)

### Using OCI Console:
1. Navigate to Networking > Virtual Cloud Networks
2. Click "Create Virtual Cloud Network"
3. Fill in the details:
   - Name: `todo-app-vcn`
   - Compartment: Select the compartment created in Step 1
   - Region: Select your preferred region
   - CIDR Block: Use default (10.0.0.0/16) or customize
4. Ensure "Use DNS Hostnames in this VCN" is checked
5. Click "Create Virtual Cloud Network"

### Using OCI CLI:
```bash
oci network vcn create \\
  --compartment-id <compartment-ocid> \\
  --display-name "todo-app-vcn" \\
  --cidr-block "10.0.0.0/16" \\
  --dns-label "todoappvcn"
```

## Step 3: Create Required Subnets for OKE Cluster

### Public Subnets (for load balancers):
1. Navigate to your VCN
2. Click "Create Subnet"
3. Configure:
   - Name: `todo-public-subnet-01`
   - Type: Regional
   - Subnet CIDR: 10.0.1.0/24
   - Route Table: Default
   - DHCP Options: Default
   - DNS Resolution: Use VCN DNS
   - Security Lists: Default
   - Access: Public

Repeat for additional availability domains if needed (e.g., `todo-public-subnet-02`, `todo-public-subnet-03`)

### Private Subnets (for worker nodes):
1. Create subnet:
   - Name: `todo-private-subnet-01`
   - Type: Regional
   - Subnet CIDR: 10.0.2.0/24
   - Route Table: Default
   - DHCP Options: Default
   - DNS Resolution: Use VCN DNS
   - Security Lists: Default
   - Access: Private

Repeat for additional availability domains if needed.

## Step 4: Configure Security Lists

### For Public Subnet:
- Ingress Rules:
  - TCP 6 (SSH) from your IP: `<your-ip>/32`
  - TCP 443 (HTTPS) from 0.0.0.0/0 (for application access)
  - TCP 80 (HTTP) from 0.0.0.0/0 (for application access)
  - ICMP Type 3 Code 4 (Traceroute) from 0.0.0.0/0

### For Private Subnet:
- Ingress Rules:
  - TCP 6 (SSH) from public subnet: `10.0.1.0/24`
  - All ports from VCN: `10.0.0.0/16`
  - ICMP Type 3 Code 4 from VCN: `10.0.0.0/16`

## Step 5: Create Internet Gateway (for public subnet access)
1. In your VCN, click "Create Internet Gateway"
2. Name: `todo-internet-gateway`
3. Attach to your VCN
4. Update public subnet route table to direct 0.0.0.0/0 traffic to this gateway

## Step 6: Create NAT Gateway (for private subnet internet access)
1. In your VCN, click "Create NAT Gateway"
2. Name: `todo-nat-gateway`
3. Associate with public subnet
4. Update private subnet route table to direct 0.0.0.0/0 traffic to this NAT gateway

## Step 7: Set Up Service Gateway (for OCI service access)
1. In your VCN, click "Create Service Gateway"
2. Name: `todo-service-gateway`
3. Select services: Object Storage, Container Registry, etc.
4. Update private subnet route table for service traffic

## Step 8: Configure DNS (Optional)
If using custom domain:
1. Navigate to DNS Management > Zones
2. Create a zone for your domain
3. Configure DNS records for application access

## Security Best Practices
- Use compartments to isolate resources
- Apply principle of least privilege
- Regularly audit security lists and network access rules
- Use private subnets for worker nodes
- Enable Cloud Guard for threat detection

## Cost Management
- Monitor usage against Always-Free tier limits
- Set up budget alerts
- Terminate unused resources
- Use reserved instances for predictable workloads

## Troubleshooting
- If resources fail to create, check compartment permissions
- Verify CIDR blocks don't overlap
- Ensure proper route table configurations
- Check security list rules for connectivity issues

## Next Steps
Once infrastructure is set up:
1. Create OKE cluster in private subnets
2. Configure Kubernetes network policies
3. Set up monitoring and logging
4. Deploy application with Dapr and Kafka integration