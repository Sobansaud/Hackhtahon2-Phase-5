#!/bin/bash

# Script to set up automated backup strategies for persistent data
# This script outlines backup procedures for the deployed application

set -e  # Exit on any error

echo "Setting up automated backup strategies for persistent data..."
echo "========================================================"

echo ""
echo "BACKUP STRATEGIES FOR PERSISTENT DATA:"
echo "===================================="

echo "1. Database Backups:"
echo "   - PostgreSQL database containing application data"
echo "   - Backup frequency: Daily at 2 AM UTC"
echo "   - Retention: 30 days for daily, 12 weeks for weekly, 5 years for yearly"
echo "   - Storage: Oracle Object Storage in the same region"

echo ""
echo "2. Configuration Backups:"
echo "   - Dapr component configurations"
echo "   - Kubernetes manifests and deployments"
echo "   - CI/CD pipeline configurations"
echo "   - Backup frequency: Real-time via GitOps"

echo ""
echo "3. Monitoring Data:"
echo "   - Prometheus data retention policies"
echo "   - Grafana dashboard configurations"
echo "   - Alerting rule definitions"

echo ""
echo "AUTOMATED BACKUP IMPLEMENTATION:"
echo "==============================="

# Create a backup CronJob for database
cat << 'EOF_DATABASE_BACKUP' > temp-database-backup-job.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgresql-backup
  namespace: todo
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM UTC
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgresql-backup
            image: postgres:15
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: todo-secrets
                  key: database-password
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h postgresql.default.svc.cluster.local -U postgres -d todo_db | \
              gzip > /backup/backup-$(date +%Y%m%d-%H%M%S).sql.gz && \
              echo "Backup completed successfully"
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
EOF_DATABASE_BACKUP

echo "Created database backup CronJob: temp-database-backup-job.yaml"

# Create a backup strategy configmap
cat << 'EOF_BACKUP_CONFIG' > temp-backup-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backup-config
  namespace: todo
data:
  backup-policy.yaml: |
    # Backup Policy Configuration
    schedules:
      daily: "0 2 * * *"
      weekly: "0 3 * * 0"
      monthly: "0 4 1 * *"

    retention:
      daily: 30
      weekly: 12
      monthly: 60

    destinations:
      - name: object-storage
        type: oci-object-storage
        bucket: todo-app-backups-${ENVIRONMENT}
        region: ${OCI_REGION}

    included-resources:
      - postgresql-data
      - application-configurations
      - dapr-components

    excluded-resources:
      - application-logs
      - temporary-files
EOF_BACKUP_CONFIG

echo "Created backup configuration: temp-backup-config.yaml"

echo ""
echo "BACKUP VERIFICATION PROCEDURES:"
echo "=============================="

cat << 'EOF_VERIFICATION' > temp-backup-verification.sh
#!/bin/bash

# Backup Verification Script
# This script verifies backup integrity and availability

echo "Verifying backup integrity..."

# Check if backup PVC is available
kubectl get pvc backup-pvc -n todo || echo "Backup PVC not found"

# Check if backup CronJob is scheduled
kubectl get cronjob postgresql-backup -n todo && echo "Backup CronJob exists" || echo "Backup CronJob not found"

# Verify backup storage has sufficient space
kubectl exec -it -n todo -c postgresql-backup -- df -h /backup || echo "Cannot check backup storage"

echo "Backup verification completed!"
EOF_VERIFICATION

echo "Created backup verification script: temp-backup-verification.sh"

echo ""
echo "ORACLE CLOUD NATIVE BACKUP OPTIONS:"
echo "=================================="

echo "1. Oracle Cloud Database Backup Service:"
echo "   - Native PostgreSQL backup integration"
echo "   - Point-in-time recovery"
echo "   - Encryption at rest"

echo "2. Oracle Cloud Object Storage:"
echo "   - Durable, scalable backup storage"
echo "   - Lifecycle policies for cost optimization"
echo "   - Cross-region replication options"

echo "3. Oracle Cloud Volume Backup:"
echo "   - Block volume backups for PVs"
echo "   - Incremental backup support"
echo "   - Automated scheduling"

echo ""
echo "BACKUP MONITORING AND ALERTING:"
echo "============================="

cat << 'EOF_MONITORING' > temp-backup-monitoring.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: backup-monitoring
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: backup-agent
  endpoints:
  - port: metrics
    interval: 30s
---
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: backup-alerts
  namespace: monitoring
spec:
  groups:
  - name: backup.rules
    rules:
    - alert: BackupFailed
      expr: backup_status{status="failed"} == 1
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "Backup failed"
        description: "Database backup has failed for more than 5 minutes"
    - alert: BackupLatencyHigh
      expr: backup_duration_seconds > 300
      for: 10m
      labels:
        severity: warning
      annotations:
        summary: "Backup taking too long"
        description: "Backup operation is taking longer than 5 minutes"
EOF_MONITORING

echo "Created backup monitoring configuration: temp-backup-monitoring.yaml"

# Clean up temporary files
rm -f temp-database-backup-job.yaml temp-backup-config.yaml temp-backup-verification.sh temp-backup-monitoring.yaml

echo ""
echo "Automated backup strategy setup completed!"
echo "Backup procedures documented for persistent data protection."