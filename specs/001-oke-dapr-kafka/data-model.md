# Data Model: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

**Date**: February 04, 2026
**Feature**: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

## Dapr Components

### Dapr PubSub Component (Kafka)
- **Component Name**: `pubsub`
- **Type**: `pubsub.kafka`
- **Fields**:
  - `brokerList`: Redpanda bootstrap servers URL
  - `consumerGroup`: Consumer group for event processing
  - `authRequired`: Boolean indicating SASL authentication
  - `saslUsername`: Redpanda SASL username
  - `saslPassword`: Reference to Kubernetes secret containing SASL password
- **Relationships**: Connects to Redpanda Cloud Kafka cluster
- **Validation**: Must have valid broker URL and authentication credentials

### Dapr State Store Component (PostgreSQL)
- **Component Name**: `statestore`
- **Type**: `state.postgresql`
- **Fields**:
  - `connectionString`: PostgreSQL connection string
  - `actorStateStore`: Boolean indicating if used for actor state
  - `versioning`: Versioning strategy for state updates
- **Relationships**: Connects to Neon PostgreSQL database
- **Validation**: Must have valid connection string and database connectivity

### Dapr Secret Store Component (Kubernetes)
- **Component Name**: `secretstore`
- **Type**: `secretstores.kubernetes`
- **Fields**:
  - `namespace`: Kubernetes namespace for secrets
  - `permissions`: Read/write permissions for secrets
- **Relationships**: Accesses Kubernetes Secrets in cluster
- **Validation**: Must have proper RBAC permissions

### Dapr Bindings Component (Cron)
- **Component Name**: `bindings`
- **Type**: `bindings.cron`
- **Fields**:
  - `schedule`: Cron expression for task execution
  - `direction`: Input/output binding direction
- **Relationships**: Triggers reminder functionality
- **Validation**: Must have valid cron expression

## Kafka Topics

### Task Events Topic
- **Topic Name**: `task-events`
- **Fields**:
  - `eventId`: Unique identifier for the event
  - `eventType`: Type of event (created, updated, deleted, completed)
  - `taskId`: ID of the associated task
  - `timestamp`: Event creation timestamp
  - `payload`: Event data payload
- **Relationships**: Stores all task lifecycle events
- **Validation**: Must have valid eventType and taskId

### Reminders Topic
- **Topic Name**: `reminders`
- **Fields**:
  - `reminderId`: Unique identifier for the reminder
  - `taskId`: ID of the associated task
  - `dueTime`: Scheduled time for the reminder
  - `userId`: User who owns the task
  - `status`: Current status (pending, sent, cancelled)
- **Relationships**: Handles automated reminder triggers
- **Validation**: Must have valid dueTime and userId

### Task Updates Topic
- **Topic Name**: `task-updates`
- **Fields**:
  - `updateId`: Unique identifier for the update
  - `taskId`: ID of the associated task
  - `updateType`: Type of update (priority, tags, dueDate)
  - `newValue`: New value for the update
  - `timestamp`: Update timestamp
- **Relationships**: Tracks real-time task sync preparation
- **Validation**: Must have valid updateType and newValue

## Kubernetes Resources

### Helm Chart Values
- **Entity Name**: `values`
- **Fields**:
  - `image.repository`: Container image repository
  - `image.tag`: Container image tag
  - `replicaCount`: Number of pod replicas
  - `resources.limits.cpu`: CPU limit per pod
  - `resources.limits.memory`: Memory limit per pod
  - `resources.requests.cpu`: CPU request per pod
  - `resources.requests.memory`: Memory request per pod
  - `dapr.enabled`: Boolean for Dapr sidecar injection
  - `ingress.enabled`: Boolean for ingress creation
  - `ingress.hostname`: Hostname for ingress routing
- **Relationships**: Defines deployment configuration for all services
- **Validation**: Resource limits must not exceed cluster capacity

### GitHub Actions Secrets
- **Entity Name**: `secrets`
- **Fields**:
  - `DOCKERHUB_USERNAME`: Docker Hub username
  - `DOCKERHUB_TOKEN`: Docker Hub access token
  - `ORACLE_OKE_KUBECONFIG`: Kubernetes config for OKE cluster
  - `REDPANDA_BOOTSTRAP_SERVERS`: Redpanda cluster bootstrap servers
  - `REDPANDA_SASL_USERNAME`: Redpanda SASL username
  - `REDPANDA_SASL_PASSWORD`: Redpanda SASL password
- **Relationships**: Provides authentication for deployment pipeline
- **Validation**: All secrets must be properly encoded and accessible

## Monitoring Configuration

### Prometheus Alerts
- **Entity Name**: `alerts`
- **Fields**:
  - `alertName`: Name of the alert
  - `expression`: PromQL expression for alert condition
  - `duration`: Duration for alert evaluation
  - `labels.severity`: Severity level (critical, warning)
  - `annotations.summary`: Brief description of alert
  - `annotations.description`: Detailed alert description
- **Relationships**: Defines alerting rules for system monitoring
- **Validation**: Expressions must be valid PromQL

### Grafana Dashboards
- **Entity Name**: `dashboards`
- **Fields**:
  - `dashboardName`: Name of the dashboard
  - `panels`: Array of visualization panels
  - `metrics`: Array of metrics to display
  - `refreshInterval`: Dashboard refresh interval
- **Relationships**: Visualizes system metrics and performance
- **Validation**: Panel configurations must be valid Grafana JSON