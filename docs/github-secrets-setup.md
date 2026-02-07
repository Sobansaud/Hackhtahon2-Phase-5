# GitHub Repository Secrets Setup Guide

## Overview
This document outlines the process for setting up GitHub repository secrets required for the CI/CD deployment pipeline to Oracle OKE.

## Prerequisites
- GitHub account with admin access to the repository
- Required credentials ready (OCI, Docker Hub, etc.)

## Step 1: Access Repository Settings

1. Navigate to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables"
4. Select "Actions" from the submenu

## Step 2: Add Repository Secrets

### Docker Hub Secrets:
1. Click "New repository secret"
2. Add the following secrets:

**DOCKERHUB_USERNAME**:
- Name: `DOCKERHUB_USERNAME`
- Value: Your Docker Hub username

**DOCKERHUB_TOKEN**:
- Name: `DOCKERHUB_TOKEN`
- Value: Your Docker Hub access token (generate from Docker Hub Security settings)

### Oracle Cloud Infrastructure (OCI) Secrets:
**OCI_TENANCY_ID**:
- Name: `OCI_TENANCY_ID`
- Value: Your Oracle Cloud tenancy OCID (find in Oracle Cloud Console > Governance and Administration > Tenancy Details)

**OCI_USER_ID**:
- Name: `OCI_USER_ID`
- Value: Your Oracle Cloud user OCID (find in Oracle Cloud Console > Identity > Users > Your User > User Information)

**OCI_REGION**:
- Name: `OCI_REGION`
- Value: Your Oracle Cloud region (e.g., `us-ashburn-1`, `us-phoenix-1`, etc.)

**OCI_PRIVATE_KEY**:
- Name: `OCI_PRIVATE_KEY`
- Value: Your API signing private key content (copy the full content of your private key file, including headers)

### Oracle Kubernetes Engine (OKE) Secrets:
**OKE_CLUSTER_ID**:
- Name: `OKE_CLUSTER_ID`
- Value: Your OKE cluster OCID (find in Oracle Cloud Console > Developer Services > Kubernetes Clusters)

### Redpanda Cloud Secrets (if applicable):
**REDPANDA_BOOTSTRAP_SERVERS**:
- Name: `REDPANDA_BOOTSTRAP_SERVERS`
- Value: Your Redpanda cluster bootstrap servers URL

**REDPANDA_SASL_USERNAME**:
- Name: `REDPANDA_SASL_USERNAME`
- Value: Your Redpanda SASL username

**REDPANDA_SASL_PASSWORD**:
- Name: `REDPANDA_SASL_PASSWORD`
- Value: Your Redpanda SASL password

### Additional Secrets:
**SLACK_WEBHOOK** (optional):
- Name: `SLACK_WEBHOOK`
- Value: Your Slack webhook URL for deployment notifications

## Step 3: Verify Secret Setup

1. Confirm all required secrets are listed in the "Secrets" section
2. Check that names match exactly what's referenced in your GitHub Actions workflow
3. Secrets should show as "********" for security

## Step 4: Test Secret Accessibility

### Create a Temporary Test Workflow:
Create `.github/workflows/test-secrets.yaml`:
```yaml
name: Test Secrets Access

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Test Docker Hub Username
      run: |
        if [ ! -z "${{ secrets.DOCKERHUB_USERNAME }}" ]; then
          echo "DOCKERHUB_USERNAME is set"
        else
          echo "DOCKERHUB_USERNAME is not set"
          exit 1
        fi
```

### Run the workflow to verify secrets are accessible

## Step 5: Security Best Practices

### For All Secrets:
- Use strong, unique values
- Rotate secrets regularly
- Grant minimal required permissions
- Monitor access logs where possible

### For OCI Secrets Specifically:
- Ensure API signing key has minimal required permissions
- Use a dedicated user/service account for CI/CD
- Limit permissions to specific compartments only

### For Docker Hub:
- Use personal access tokens instead of passwords
- Limit token scope to only required repositories
- Rotate tokens regularly

## Step 6: Update GitHub Actions Workflow

Ensure your workflow file (e.g., `ci-cd/workflows/deploy-oke.yaml`) references the secrets correctly:

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Get OKE cluster credentials
  run: |
    oci ce cluster create-kubeconfig --cluster-id ${{ secrets.OKE_CLUSTER_ID }} --file $HOME/.kube/config --region ${{ secrets.OCI_REGION }}
```

## Troubleshooting

### Common Issues:
1. **Secret not found**: Verify spelling and case sensitivity
2. **Permission denied**: Check that the service account has required permissions
3. **Invalid format**: Ensure secret values are properly formatted (e.g., private keys with proper line breaks)

### Debugging Tips:
- Secrets are not available to workflows triggered by forked pull requests
- Use `workflow_dispatch` to test workflows manually
- Temporarily add echo statements to verify secret values (remove immediately after testing)

## Security Verification

1. Confirm no secrets are logged in workflow output
2. Verify secrets are not printed in console output
3. Check that secrets are properly masked in GitHub Actions logs

## Next Steps

Once secrets are configured:
1. Test the deployment workflow manually
2. Verify all required secrets are accessible
3. Remove any temporary test workflows
4. Document the secrets setup for team members