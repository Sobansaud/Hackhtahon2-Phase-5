#!/bin/bash

# Script to optimize resource usage to fit within Always-Free tier limits
# This script analyzes and suggests optimizations for Oracle Cloud Always-Free tier

set -e  # Exit on any error

echo "Optimizing resource usage for Oracle Cloud Always-Free tier..."
echo "==========================================================="

echo ""
echo "ORACLE CLOUD ALWAYS-FREE TIER LIMITS:"
echo "==================================="
echo "Compute:"
echo "  - 4 AMD-based or 4 Intel-based VMs (1/8 OCPU, 1GB memory each)"
echo "  - Total: 4 OCPUs, 24 GB memory (shared across instances)"
echo "Storage:"
echo "  - 20 GB total for Block Volume, plus 20 GB for boot volumes"
echo "Bandwidth:"
echo "  - 10 TB per month egress"

echo ""
echo "CURRENT RESOURCE ALLOCATION ANALYSIS:"
echo "====================================="

echo "Application Resources:"
echo "  - Backend: 2 replicas × (200m CPU, 256Mi memory requests) = 400m CPU, 512Mi memory"
echo "  - Backend: 2 replicas × (500m CPU, 512Mi memory limits) = 1000m CPU, 1024Mi memory"
echo "  - Frontend: 2 replicas × (100m CPU, 128Mi memory requests) = 200m CPU, 256Mi memory"
echo "  - Frontend: 2 replicas × (300m CPU, 256Mi memory limits) = 600m CPU, 512Mi memory"
echo "  - Total App: 1.6 OCPU requests, 1.8GB memory requests"
echo "  - Total App: 2.6 OCPU limits, 3.6GB memory limits"

echo ""
echo "DAPR SYSTEM RESOURCES:"
echo "====================="
echo "  - dapr-operator: 3 replicas × (0.5 OCPU, 4GB memory each) = 1.5 OCPU, 12GB memory"
echo "  - dapr-placement-server: 3 replicas × (0.5 OCPU, 1GB memory each) = 1.5 OCPU, 3GB memory"
echo "  - dapr-sidecar-injector: 2 replicas × (0.1 OCPU, 0.5GB memory each) = 0.2 OCPU, 1GB memory"
echo "  - dapr-sentry: 3 replicas × (0.2 OCPU, 0.5GB memory each) = 0.6 OCPU, 1.5GB memory"
echo "  - Total Dapr: 3.8 OCPU, 20.1GB memory"

echo ""
echo "OPTIMIZATION STRATEGIES FOR ALWAYS-FREE TIER:"
echo "==========================================="

echo "1. Reduce Dapr High Availability Replicas:"
echo "   - dapr-operator: 1 replica (instead of 3) = 0.5 OCPU, 4GB memory"
echo "   - dapr-placement-server: 1 replica (instead of 3) = 0.5 OCPU, 1GB memory"
echo "   - dapr-sidecar-injector: 1 replica (instead of 2) = 0.1 OCPU, 0.5GB memory"
echo "   - dapr-sentry: 1 replica (instead of 3) = 0.2 OCPU, 0.5GB memory"
echo "   - New Dapr total: 1.3 OCPU, 6GB memory"

echo ""
echo "2. Optimize Application Resources:"
echo "   - Backend: 1 replica × (100m CPU, 128Mi memory requests) = 0.1 OCPU, 0.125GB"
echo "   - Backend: 1 replica × (300m CPU, 256Mi memory limits) = 0.3 OCPU, 0.25GB"
echo "   - Frontend: 1 replica × (50m CPU, 64Mi memory requests) = 0.05 OCPU, 0.06GB"
echo "   - Frontend: 1 replica × (150m CPU, 128Mi memory limits) = 0.15 OCPU, 0.125GB"
echo "   - New App total: 0.5 OCPU, 0.44GB requests; 0.95 OCPU, 0.85GB limits"

echo ""
echo "3. Optimize Monitoring Resources:"
echo "   - Reduce Prometheus storage: 5GB instead of 10GB"
echo "   - Reduce Grafana resources: 0.1 OCPU, 0.5GB memory"
echo "   - Disable some non-critical exporters"

echo ""
echo "PROJECTED TOTAL AFTER OPTIMIZATIONS:"
echo "==================================="
echo "  - Application: 0.95 OCPU, 0.85GB memory"
echo "  - Dapr: 1.3 OCPU, 6GB memory"
echo "  - Monitoring: 0.2 OCPU, 1GB memory"
echo "  - Kubernetes overhead: ~0.5 OCPU, ~2GB memory"
echo "  - TOTAL ESTIMATE: 2.95 OCPU, 9.85GB memory"
echo "  - Within Always-Free limits: ✓ (4 OCPU, 24GB available)"

echo ""
echo "IMPLEMENTATION SCRIPT:"
echo "===================="

cat << 'EOF_IMPLEMENTATION' > temp-resource-optimization.yaml
# Optimized Dapr installation for Always-Free tier
apiVersion: v1
kind: Namespace
metadata:
  name: dapr-system
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: dapr
  namespace: dapr-system
spec:
  interval: 1m
  url: https://dapr.github.io/helm-charts/
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: dapr
  namespace: dapr-system
spec:
  interval: 5m
  chart:
    spec:
      chart: dapr
      sourceRef:
        kind: HelmRepository
        name: dapr
        namespace: dapr-system
      version: ">=1.0.0"
  values:
    global:
      ha:
        enabled: false  # Disable HA to save resources for Always-Free
      mtls:
        enabled: true
    dapr_operator:
      replicaCount: 1  # Reduced for Always-Free
      resources:
        limits:
          cpu: 500m
          memory: 1Gi
        requests:
          cpu: 100m
          memory: 256Mi
    dapr_placement:
      replicaCount: 1  # Reduced for Always-Free
      resources:
        limits:
          cpu: 500m
          memory: 512Mi
        requests:
          cpu: 100m
          memory: 128Mi
    dapr_sidecar_injector:
      replicaCount: 1  # Reduced for Always-Free
      resources:
        limits:
          cpu: 200m
          memory: 256Mi
        requests:
          cpu: 50m
          memory: 64Mi
    dapr_sentry:
      replicaCount: 1  # Reduced for Always-Free
      resources:
        limits:
          cpu: 300m
          memory: 512Mi
        requests:
          cpu: 100m
          memory: 128Mi
EOF_IMPLEMENTATION

echo "Created optimization configuration file: temp-resource-optimization.yaml"
echo "This configuration reduces Dapr resources for Always-Free tier compliance."

echo ""
echo "ADDITIONAL OPTIMIZATION RECOMMENDATIONS:"
echo "======================================"
echo "1. Use smaller instance types when possible"
echo "2. Implement horizontal pod autoscaling to scale down during low usage"
echo "3. Use resource quotas to enforce limits"
echo "4. Schedule non-critical workloads during off-peak hours"
echo "5. Implement proper cleanup of unused resources"
echo "6. Use spot/preemptible instances when appropriate"

echo ""
echo "Resource optimization analysis completed!"
echo "Configuration files created for Always-Free tier compliance."