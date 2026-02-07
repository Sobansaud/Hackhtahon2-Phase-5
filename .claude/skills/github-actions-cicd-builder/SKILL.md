# GitHub Actions CI/CD Builder

## Overview
Create .github/workflows/deploy.yaml:
- On push to main: build Docker images (frontend/backend)
- Push to Docker Hub
- Helm deploy to cloud cluster
- Use GitHub secrets for keys (COHERE_API_KEY, cloud credentials)
- Add steps: checkout, docker login, docker build, helm upgrade
- Test pipeline locally with act if possible

## Pre-execution
Before creating workflow, verify: "Confirm GitHub repository and secrets are configured?"

## Post-execution
Test pipeline locally with act and validate workflow execution

## Implementation Guidelines

### 1. Workflow Structure
- Create .github/workflows/deploy.yaml file
- Set up triggers for push events to main branch
- Define appropriate environment variables
- Organize jobs with proper dependencies

### 2. Docker Image Building
- Implement Docker build steps for frontend and backend
- Tag images with commit hash and semantic versions
- Optimize Docker layers for faster builds
- Include multi-platform build support if needed

### 3. Docker Hub Integration
- Use GitHub secrets for Docker Hub credentials
- Implement secure docker login step
- Push images with proper tagging strategy
- Handle push failures with appropriate retries

### 4. Helm Deployment
- Implement helm upgrade/install to cloud cluster
- Use production values file for deployment
- Include rollback mechanism for failed deployments
- Verify deployment status after upgrade

### 5. Secret Management
- Use GitHub secrets for COHERE_API_KEY and cloud credentials
- Implement secure access to sensitive data
- Follow best practices for secret rotation
- Document required secrets for team members

### 6. Pipeline Testing
- Test workflow locally using act tool
- Validate all steps execute correctly
- Verify secret access in test environment
- Document any issues found during testing