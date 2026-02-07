# Docker Hub Repository Setup Guide

## Overview
This document outlines the process for setting up Docker Hub repositories to store the container images for the Todo application.

## Prerequisites
- Docker installed and running locally
- Docker Hub account (free tier available)
- Administrative access to Docker Hub organization (if using organization)

## Step 1: Create Docker Hub Account (if needed)
1. Navigate to https://hub.docker.com/
2. Click "Sign Up"
3. Choose a unique username (this will be your namespace)
4. Provide email and password
5. Verify your email address
6. Log in to your Docker Hub account

## Step 2: Create Docker Repositories

### For Backend Service:
1. Log in to Docker Hub
2. Click on your profile icon > "Create Repository"
3. Fill in the details:
   - Name: `todo-backend` (or your preferred name)
   - Description: "Backend service for Todo application with Dapr integration"
   - Visibility: Public (or Private based on your needs)
   - Template: None
4. Click "Create"

### For Frontend Service:
1. Repeat the process to create:
   - Name: `todo-frontend`
   - Description: "Frontend service for Todo application with Dapr integration"
   - Visibility: Public (or Private based on your needs)

## Step 3: Configure Repository Settings

### For Each Repository:
1. Go to the repository page
2. Click on "Settings" tab
3. Under "Build & testing" section, you can configure:
   - Automated builds (connect to GitHub/Bitbucket repository)
   - Build triggers
   - Environment variables

### Enable Vulnerability Scanning (Optional):
1. In repository settings
2. Look for "Security" or "Vulnerabilities" section
3. Enable vulnerability scanning if available in your tier

## Step 4: Configure Automated Builds (Recommended)

### Link to GitHub Repository:
1. In repository settings, find "Build & testing"
2. Click "Configure Automated Builds"
3. Select your GitHub account
4. Choose the repository containing your application code
5. Configure build rules:
   - Source Type: Branch
   - Source: main (or your default branch)
   - Dockerfile Location: /backend (for backend repo) or /frontend (for frontend repo)
   - Build Context: /backend (for backend repo) or /frontend (for frontend repo)

## Step 5: Authenticate Docker Client

### Login to Docker Hub:
```bash
docker login
```
- Enter your Docker Hub username
- Enter your password or personal access token

### For Automated Systems:
For CI/CD pipelines, use personal access tokens instead of passwords:
1. Go to Docker Hub > Account Settings > Security
2. Create a new access token
3. Use this token for automated authentication

## Step 6: Test Repository Access

### Pull a Test Image:
```bash
# Test pulling a simple image to verify access
docker pull hello-world
```

### Tag and Push Test:
```bash
# Tag a local image (replace with your actual image)
docker tag hello-world <your-username>/todo-test:latest

# Push to your repository
docker push <your-username>/todo-test:latest
```

## Step 7: Configure for CI/CD Pipeline

### In GitHub Actions (for example):
```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

### Required Secrets to Set in GitHub:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

## Security Best Practices
- Use strong, unique passwords
- Enable two-factor authentication on your Docker Hub account
- Use personal access tokens instead of passwords for automated systems
- Regularly rotate access tokens
- Limit repository permissions where possible
- Monitor repository activity and access logs

## Repository Naming Convention
For consistency and clarity, consider using:
- `todo-backend` for backend service
- `todo-frontend` for frontend service
- `todo-base-image` for shared base images
- Or use a prefix like `<org>-todo-backend` if part of an organization

## Troubleshooting
- If push fails, verify login with `docker login`
- Check repository name spelling and case sensitivity
- Verify account permissions for organization repositories
- Ensure Docker daemon is running

## Cleanup Policy
- Regularly remove outdated image tags
- Use tags appropriately (version numbers, semantic versions)
- Consider using image retention policies if available in your tier

## Next Steps
Once repositories are created:
1. Update your CI/CD pipeline to use these repositories
2. Configure automated builds if desired
3. Test the full build and deployment pipeline
4. Monitor image builds and deployments