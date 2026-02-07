#!/bin/bash

# Script to deploy Prometheus and Grafana monitoring stack to OKE
# This script should be run to set up the monitoring infrastructure

set -e  # Exit on any error

# Check if required tools are available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo "helm is not installed or not in PATH"
    exit 1
fi

echo "Deploying Prometheus and Grafana monitoring stack to OKE..."

# Define the namespace
NAMESPACE="monitoring"

# Create the monitoring namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo "Created namespace: $NAMESPACE"

# Add Prometheus community Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo "Installing kube-prometheus-stack (includes Prometheus, Alertmanager, and Grafana)..."

# Create a values file for monitoring stack configuration
cat <<EOF > temp-monitoring-values.yaml
prometheus:
  prometheusSpec:
    retention: 7d
    storageSpec:
      volumeClaimTemplate:
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
  ingress:
    enabled: true
    ingressClassName: nginx
    hosts:
      - prometheus.example.com
    annotations:
      kubernetes.io/ingress.class: nginx
      cert-manager.io/cluster-issuer: letsencrypt-prod

alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 5Gi

grafana:
  adminPassword: "prom-operator"
  ingress:
    enabled: true
    ingressClassName: nginx
    hosts:
      - grafana.example.com
    annotations:
      kubernetes.io/ingress.class: nginx
      cert-manager.io/cluster-issuer: letsencrypt-prod
  plugins:
    - grafana-piechart-panel
  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-operated.monitoring.svc:9090/
        access: proxy
        isDefault: true
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
      - name: 'default'
        orgId: 1
        folder: ''
        type: file
        disableDeletion: false
        editable: true
        options:
          path: /var/lib/grafana/dashboards/default
  dashboards:
    default:
      dapr-dashboard:
        gnetId: 11835  # Dapr dashboard from Grafana.com
        revision: 1
        datasource: Prometheus
EOF

# Install the monitoring stack
helm upgrade --install prometheus-grafana prometheus-community/kube-prometheus-stack \
  --namespace $NAMESPACE \
  --values temp-monitoring-values.yaml \
  --create-namespace \
  --wait \
  --timeout=15m

# Clean up temporary file
rm temp-monitoring-values.yaml

# Wait for all pods to be ready
echo "Waiting for monitoring stack to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=prometheus -n $NAMESPACE --timeout=600s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=alertmanager -n $NAMESPACE --timeout=600s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana -n $NAMESPACE --timeout=600s

# Verify installation
echo "Verifying monitoring stack installation..."
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

echo "Prometheus and Grafana monitoring stack deployed successfully!"
echo ""
echo "Access details:"
echo "- Prometheus: http://prometheus.example.com (configure DNS or use port forwarding)"
echo "- Grafana: http://grafana.example.com (admin password: prom-operator)"
echo "- Alertmanager: http://alertmanager.example.com"