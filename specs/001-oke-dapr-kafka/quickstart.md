# Quickstart Guide: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

**Date**: February 04, 2026
**Feature**: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

## Prerequisites

- Oracle Cloud account with Always-Free tier access
- Redpanda Cloud account (free tier)
- Docker installed locally
- kubectl installed
- Helm 3.x installed
- OCI CLI installed and configured
- GitHub account with repository access

## Local Development Setup

1. **Install Dapr locally**:
   ```bash
   dapr init -k
   ```

2. **Set up Strimzi Kafka for local development**:
   ```bash
   # Apply Strimzi operator
   kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
   # Create Kafka cluster
   kubectl apply -f kafka/strimzi/kafka-single.yaml
   ```

3. **Configure Dapr components for local development**:
   ```bash
   kubectl apply -f dapr-components/pubsub-kafka.yaml
   kubectl apply -f dapr-components/statestore-postgres.yaml
   kubectl apply -f dapr-components/secretstore-k8s.yaml
   kubectl apply -f dapr-components/bindings-cron.yaml
   ```

4. **Deploy application to Minikube with Dapr enabled**:
   ```bash
   helm install todo-app ./charts/todo \
     --set dapr.enabled=true \
     --set image.tag=dev \
     --namespace todo --create-namespace
   ```

5. **Verify local deployment**:
   ```bash
   dapr status -k
   kubectl get pods -n todo
   ```

## Oracle OKE Production Setup

1. **Create Oracle OKE cluster**:
   ```bash
   # Create VCN and cluster using OCI CLI
   oci ce cluster create --name todo-cluster \
     --compartment-id <your-compartment-id> \
     --vcn-id <your-vcn-id> \
     --endpoint-subnet-id <your-subnet-id>
   ```

2. **Get cluster credentials**:
   ```bash
   # Configure kubectl context
   oci ce cluster create-kubeconfig --cluster-id <cluster-id> --file $HOME/.kube/config
   kubectl config use-context <oke-cluster-context>
   ```

3. **Install Dapr on OKE cluster**:
   ```bash
   dapr init -k --enable-ha=true
   ```

4. **Set up Redpanda Cloud**:
   - Sign up at https://cloud.redpanda.com
   - Create a cluster and copy the bootstrap servers URL
   - Create topics: `task-events`, `reminders`, `task-updates`
   - Copy SASL credentials

5. **Configure Kubernetes secrets for Redpanda**:
   ```bash
   kubectl create secret generic redpanda-secret \
     --from-literal=sasl-username=<your-redpanda-username> \
     --from-literal=sasl-password=<your-redpanda-password> \
     --namespace todo
   ```

6. **Update Dapr pubsub component with Redpanda credentials**:
   ```bash
   # Update the pubsub-kafka.yaml with Redpanda settings
   kubectl apply -f dapr-components/pubsub-kafka.yaml
   ```

7. **Deploy application to OKE**:
   ```bash
   helm install todo-app ./charts/todo \
     --set dapr.enabled=true \
     --set image.tag=latest \
     --set replicaCount=3 \
     --set ingress.hostname=todo.your-domain.com \
     --namespace todo --create-namespace
   ```

## CI/CD Pipeline Setup

1. **Configure GitHub repository secrets**:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
   - `ORACLE_OKE_KUBECONFIG`: Base64-encoded kubeconfig for OKE
   - `REDPANDA_BOOTSTRAP_SERVERS`: Redpanda cluster bootstrap servers
   - `REDPANDA_SASL_USERNAME`: Redpanda SASL username
   - `REDPANDA_SASL_PASSWORD`: Redpanda SASL password

2. **Push workflow file to repository**:
   ```bash
   git add ci-cd/workflows/deploy-oke.yaml
   git commit -m "Add OKE deployment workflow"
   git push origin main
   ```

3. **Verify pipeline execution**:
   - Go to GitHub repository → Actions
   - Check that the workflow runs successfully
   - Verify deployment in OKE cluster

## Monitoring Setup

1. **Install monitoring stack**:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   helm install monitoring prometheus-community/kube-prometheus-stack \
     --namespace monitoring --create-namespace
   ```

2. **Port forward to access Grafana**:
   ```bash
   kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
   ```

3. **Access Grafana dashboard**:
   - Open http://localhost:3000
   - Login with admin/admin (change password on first login)
   - Import Dapr-specific dashboards from monitoring/dashboards/

## Verification Steps

1. **Check all pods are running**:
   ```bash
   kubectl get pods -n todo
   ```

2. **Verify Dapr sidecars are injected**:
   ```bash
   kubectl get pods -n todo -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .spec.containers[*]}{.name}{"\t"}{end}{"\n"}{end}'
   ```

3. **Test event publishing**:
   ```bash
   # Send a test event to the application
   curl -X POST http://todo.your-domain.com/api/tasks -H "Content-Type: application/json" -d '{"title":"Test Event","description":"Event published via Dapr"}'
   ```

4. **Verify event consumption in Redpanda**:
   - Check Redpanda Console for events in `task-events` topic
   - Verify events are processed successfully

5. **Check monitoring dashboards**:
   - Verify application metrics are visible in Grafana
   - Check Dapr-specific metrics for sidecar health
   - Confirm Kafka metrics for event processing

## Troubleshooting

- **Dapr sidecar not injected**: Verify Helm values have `dapr.enabled=true` and `dapr.io/enabled: "true"` annotation
- **Kafka connection issues**: Check Redpanda credentials in Kubernetes secrets and Dapr pubsub configuration
- **Deployment failures**: Verify resource quotas in OKE cluster and update Helm values accordingly
- **Ingress not accessible**: Confirm domain mapping and load balancer configuration in OKE