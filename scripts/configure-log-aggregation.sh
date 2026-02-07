#!/bin/bash

# Script to configure log aggregation for application and Dapr logs
# This script sets up centralized logging using Fluent Bit as a DaemonSet

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

echo "Configuring log aggregation for application and Dapr logs..."

# Define the namespace
LOGGING_NAMESPACE="logging"
MONITORING_NAMESPACE="monitoring"

# Create the logging namespace
kubectl create namespace $LOGGING_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo "Created namespace: $LOGGING_NAMESPACE"

# Add Fluent Bit Helm repository
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update

# Create a values file for Fluent Bit configuration
cat <<EOF > temp-fluentbit-values.yaml
fluent-bit:
  config:
    service: |
      [SERVICE]
          Flush         1
          Log_Level     info
          Daemon        off
          Parsers_File  parsers.conf
          HTTP_Server   On
          HTTP_Listen   0.0.0.0
          HTTP_Port     2020

    inputs: |
      [INPUT]
          Name              tail
          Tag               kube.*
          Path              /var/log/containers/*.log
          Parser            docker
          DB                /var/log/flb_kube.db
          Mem_Buf_Limit     5MB
          Skip_Long_Lines   On
          Refresh_Interval  10

    filters: |
      [FILTER]
          Name                kubernetes
          Match               kube.*
          Merge_Log           On
          Keep_Log            Off
          K8S-Logging.Parser  On
          K8S-Logging.Exclude Off

      # Filter to add Dapr-specific labels
      [FILTER]
          Name                record_modifier
          Match               kube.*
          Record              dapr_component \${kubernetes['labels']['dapr\\.io/app-id']}

    outputs: |
      [OUTPUT]
          Name            stdout
          Match           *
          Format          json_lines

      # Forward to Loki for storage
      [OUTPUT]
          Name            loki
          Match           *
          Host            loki.logging.svc.cluster.local
          Port            3100
          Labels          job=fluentbit,cluster=oke
          Auto_Parse      Json

    parsers: |
      [PARSER]
          Name        docker
          Format      json
          Time_Key    time
          Time_Format %Y-%m-%dT%H:%M:%S.%LZ

      [PARSER]
          Name        syslog
          Format      regex
          Regex       ^(?<time>[^ ]* {1,2}[^ ]* [^ ]*) (?<host>[^ ]*) (?<ident>[a-zA-Z0-9_\/\.\-]*)(?:\[(?<pid>[0-9]+)\])?(?:[^\:]*\:)? *(?<message>.*)$
          Time_Key    time
          Time_Format %b %d %H:%M:%S

  backend:
    type: loki
    loki:
      host: loki.logging.svc.cluster.local
      port: 3100
      labels: 'job=fluentbit,cluster=oke'
      autoKubernetesLabels: true

  serviceMonitor:
    enabled: true
    interval: 10s

rbac:
  create: true

serviceAccount:
  create: true
  name: fluent-bit

# Enable host networking for better performance
hostNetwork: false
dnsPolicy: ClusterFirstWithHostNet

# Set resource limits
resources:
  limits:
    cpu: 500m
    memory: 200Mi
  requests:
    cpu: 100m
    memory: 100Mi
EOF

# Install Fluent Bit with Loki backend
helm upgrade --install fluent-bit fluent/fluent-bit \
  --namespace $LOGGING_NAMESPACE \
  --values temp-fluentbit-values.yaml \
  --create-namespace \
  --wait

# Clean up temporary file
rm temp-fluentbit-values.yaml

# Install Loki for log storage
helm upgrade --install loki grafana/loki \
  --namespace $LOGGING_NAMESPACE \
  --set "singleBinary.replicas=1" \
  --create-namespace \
  --wait

# Configure Grafana to use Loki as a data source
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: $LOGGING_NAMESPACE
data:
  loki-datasource.yaml: |-
    apiVersion: 1
    datasources:
    - name: Loki
      type: loki
      url: http://loki:3100
      access: proxy
      isDefault: false
EOF

# Patch Grafana to add the Loki data source
kubectl patch deployment prometheus-grafana-grafana -n $MONITORING_NAMESPACE -p '{"spec":{"template":{"spec":{"initContainers":[{"name":"add-loki-datasource","image":"curlimages/curl","command":["curl","-X","POST","-H","Content-Type: application/json","-d","{\"name\":\"Loki\",\"type\":\"loki\",\"url\":\"http://loki.logging.svc.cluster.local:3100\",\"access\":\"proxy\",\"isDefault\":false}","-u","admin:prom-operator","http://prometheus-grafana-grafana:80/api/datasources"],"volumeMounts":[{"name":"config","mountPath":"/etc/curl"}]}],"volumes":[{"name":"config","configMap":{"name":"grafana-datasources"}}]}}}}' || echo "Manual configuration needed for Grafana Loki datasource"

echo "Log aggregation configured successfully!"
echo ""
echo "Components deployed:"
echo "- Fluent Bit DaemonSet for log collection"
echo "- Loki for log storage"
echo "- Integration with existing Grafana dashboard"
echo ""
echo "To view logs:"
echo "- Access Grafana at http://grafana.example.com"
echo "- Use the Explore tab to query logs with Loki"
echo "- Search for application and Dapr logs by namespace or pod name"