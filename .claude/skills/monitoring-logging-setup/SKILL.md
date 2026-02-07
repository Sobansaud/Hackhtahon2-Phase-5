# Monitoring & Logging Setup

## Overview
Add monitoring/logging to deployment:
- Install Prometheus + Grafana via Helm (prometheus-community/kube-prometheus-stack)
- Configure alerts for high CPU, pod crashes
- Cloud: Enable Azure Monitor / GCP Logging
- Validate: kubectl port-forward grafana pod 3000:3000
- Generate dashboard screenshots for demo

## Pre-execution
Before installing monitoring, verify: "Confirm cluster resources for monitoring stack?"

## Post-execution
Validate monitoring setup and generate dashboard screenshots

## Implementation Guidelines

### 1. Prometheus + Grafana Installation
- Install kube-prometheus-stack via Helm
- Configure resource limits for monitoring components
- Set up proper service accounts and permissions
- Verify all monitoring components are running

### 2. Alert Configuration
- Create alerts for high CPU utilization
- Set up pod crash detection and alerting
- Configure memory usage alerts
- Implement custom application-specific alerts

### 3. Cloud Monitoring Integration
- Enable Azure Monitor for AKS clusters
- Set up GCP Logging for GKE clusters
- Configure Oracle Cloud Infrastructure Monitoring for OKE
- Integrate cloud logs with Prometheus where possible

### 4. Dashboard Creation
- Create custom dashboards for application metrics
- Design task management system specific views
- Set up Dapr sidecar monitoring dashboards
- Configure Kafka event monitoring views

### 5. Validation Steps
- Use kubectl port-forward to access Grafana locally
- Verify metrics are being collected properly
- Test alert firing with simulated conditions
- Confirm all dashboards are displaying data correctly

### 6. Demo Preparation
- Generate screenshots of key monitoring dashboards
- Create before/after comparison images
- Document important metrics to highlight in demos
- Prepare dashboard annotations for presentation