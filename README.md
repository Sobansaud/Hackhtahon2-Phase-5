# The Evolution of Todo - Phase V

## Intermediate & Advanced Features Guide

This document provides an overview of the intermediate and advanced features implemented in the Todo application.

## Features Overview

### 1. Priority Management
- **Three-level priority system**: High, Medium, Low
- **Visual indicators**: Color-coded badges in task list
- **Filtering**: Tasks can be filtered by priority level
- **Sorting**: Tasks can be sorted by priority (High → Medium → Low)

### 2. Tag Management
- **Multiple tags per task**: Assign multiple tags to organize tasks
- **Tag filtering**: Filter tasks by specific tags
- **Tag display**: Tags shown as interactive chips in task list
- **On-the-fly creation**: Create new tags while adding tasks

### 3. Search & Filter Enhancement
- **Full-text search**: Search across task titles and descriptions
- **Combined filtering**: Apply multiple filters simultaneously (status + priority + tag)
- **Efficient queries**: Optimized database queries for fast results

### 4. Due Date Management
- **Due date assignment**: Set due dates in YYYY-MM-DD format
- **Overdue indicators**: Visual markers for overdue tasks ([OVERDUE] red + bold)
- **Date-based sorting**: Sort tasks by due date
- **Date validation**: Proper validation for date format

### 5. Recurring Tasks
- **Recurrence patterns**: Daily, Weekly, Monthly options
- **Auto-generation**: Next task instance created automatically upon completion
- **Property preservation**: Title, description, priority, and tags preserved
- **Due date calculation**: Next due date calculated based on recurrence pattern

### 6. Advanced Sorting
- **Multiple options**: Sort by due date, priority, title, creation date
- **Direction toggle**: Ascending/descending for each sort option
- **Combined sorting**: Works in combination with filters and search

## API Endpoints

### GET /api/tasks/
Query parameters:
- `status`: Filter by status (all, pending, completed)
- `filter_status`: Filter by status (all, pending, completed)
- `filter_priority`: Filter by priority (all, High, Medium, Low)
- `filter_tag`: Filter by tag
- `search`: Keyword search in title/description
- `sort`: Sort order (due_date_asc, due_date_desc, priority_asc, priority_desc, title_asc, title_desc, created_at_asc, created_at_desc)

### POST /api/tasks/
Request body:
```json
{
  "title": "Task title",
  "description": "Task description",
  "priority": "High",
  "tags": ["tag1", "tag2"],
  "due_date": "2026-12-31",
  "recurrence": "weekly"
}
```

### PATCH /api/tasks/{id}/complete
Handles recurring task logic automatically.

## Frontend Components

### TodoCard Component
- Displays priority badges with color coding
- Shows tags as interactive chips
- Visual indicators for overdue tasks
- Due date formatting with appropriate styling

### Task Form
- Priority dropdown selector
- Tags multi-select input
- Date picker for due dates
- Recurrence pattern selector

### Filter & Sort Controls
- Search input with debounce
- Status, priority, and tag filters
- Sort dropdown with multiple options
- Clear filters functionality

## Environment Configuration

### Backend (.env)
- `COHERE_API_KEY`: API key for Cohere integration
- `BETTER_AUTH_SECRET`: Secret for authentication
- `DATABASE_URL`: Database connection string

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Development

### Running the Application
1. Install dependencies: `npm install`
2. Start backend: `cd backend && uvicorn main:app --reload`
3. Start frontend: `cd frontend && npm run dev`

## Testing

The application includes comprehensive testing for all new features:
- Unit tests for backend business logic
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Performance tests for search and filter operations

## Architecture

The application follows a clean architecture pattern:
- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+, SQLModel
- **Database**: PostgreSQL with JSONB support for tags
- **API**: RESTful endpoints with JSON responses

## Deployment

The application is designed for deployment to cloud platforms with:
- Kubernetes orchestration
- Dapr for service-to-service communication
- Kafka for event streaming
- CI/CD pipeline with GitHub Actions
- Comprehensive monitoring and logging

## Contributing

We welcome contributions to the project. Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

### Overview

This project implements the deployment of the Todo application to Oracle Cloud OKE with full Dapr integration and Redpanda Kafka event streaming. The implementation establishes a production-hardened, event-driven architecture using Dapr sidecars for pub/sub, state management, and secret stores, with automated CI/CD pipeline and comprehensive monitoring.

### Architecture

- **Backend**: FastAPI application with Dapr sidecar
- **Frontend**: Next.js application with Dapr sidecar
- **Event Streaming**: Redpanda Kafka for task events, reminders, and updates
- **State Management**: PostgreSQL via Neon with Dapr state management
- **Service Mesh**: Dapr for service invocation and component abstraction
- **Monitoring**: Prometheus/Grafana stack for metrics and alerting

### Prerequisites

- Oracle Cloud account with Always-Free tier access
- Redpanda Cloud account (free tier)
- Docker installed locally
- kubectl installed
- Helm 3.x installed
- OCI CLI installed and configured
- GitHub account with repository access
- Dapr CLI installed

### Deployment Steps

#### 1. Oracle OKE Cluster Setup

1. Create an Oracle OKE cluster in the Always-Free tier:
   ```bash
   oci ce cluster create --name todo-cluster \
     --compartment-id <your-compartment-id> \
     --vcn-id <your-vcn-id> \
     --endpoint-subnet-id <your-subnet-id>
   ```

2. Get cluster credentials:
   ```bash
   oci ce cluster create-kubeconfig --cluster-id <cluster-id> --file $HOME/.kube/config
   kubectl config use-context <oke-cluster-context>
   ```

3. Install Dapr on OKE cluster:
   ```bash
   dapr init -k --enable-ha=true
   ```

#### 2. Redpanda Cloud Setup

1. Sign up at https://cloud.redpanda.com
2. Create a cluster and copy the bootstrap servers URL
3. Create topics: `task-events`, `reminders`, `task-updates`
4. Copy SASL credentials

#### 3. Dapr Component Configuration

1. Create Kubernetes secret for Redpanda credentials:
   ```bash
   kubectl create secret generic redpanda-secret \
     --from-literal=sasl-username=<your-redpanda-username> \
     --from-literal=sasl-password=<your-redpanda-password> \
     --namespace todo
   ```

2. Update the Dapr component files in `dapr-components/` with your actual Redpanda settings
3. Apply Dapr components to the cluster:
   ```bash
   kubectl apply -f dapr-components/
   ```

#### 4. Application Deployment

1. Update Helm values in `charts/todo/values.yaml` with your configuration
2. Deploy the application:
   ```bash
   helm install todo-app ./charts/todo \
     --set dapr.enabled=true \
     --set image.tag=latest \
     --set replicaCount=3 \
     --set ingress.hostname=todo.your-domain.com \
     --namespace todo --create-namespace
   ```

#### 5. CI/CD Pipeline Setup

1. Configure GitHub repository secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
   - `OCI_TENANCY_ID`: Oracle Cloud tenancy ID
   - `OCI_USER_ID`: Oracle Cloud user ID
   - `OCI_REGION`: Oracle Cloud region
   - `OCI_PRIVATE_KEY`: Oracle Cloud private key
   - `OKE_CLUSTER_ID`: OKE cluster ID

2. The GitHub Actions workflow in `.github/workflows/deploy-oke.yaml` will automatically deploy on pushes to main

#### 6. Monitoring Setup

1. Deploy Prometheus and Grafana monitoring stack:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   helm install monitoring prometheus-community/kube-prometheus-stack \
     --namespace monitoring --create-namespace
   ```

2. Import the dashboards from `monitoring/dashboards/` into Grafana

### Local Development

For local development with Minikube:

1. Install Strimzi Kafka operator:
   ```bash
   kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
   ```

2. Deploy local Kafka cluster:
   ```bash
   kubectl apply -f kafka/strimzi/kafka-single.yaml
   ```

3. Install Dapr locally:
   ```bash
   dapr init -k
   ```

4. Deploy with local Dapr components:
   ```bash
   helm install todo-app ./charts/todo \
     --set dapr.enabled=true \
     --set image.tag=dev \
     --namespace todo --create-namespace
   ```

### Event-Driven Architecture

The system uses Kafka topics for event streaming:
- `task-events`: All task lifecycle events (created, updated, deleted, completed)
- `reminders`: Automated reminder triggers with due date information
- `task-updates`: Real-time sync preparation events

Dapr pub/sub components handle the event publishing and consumption, abstracting the underlying Kafka infrastructure.

### Security

- Network policies restrict inter-service communication
- Kubernetes Secrets store sensitive information
- Dapr secret stores provide secure access patterns
- All communications are encrypted in transit

### Scaling

The application is designed to scale horizontally:
- Multiple replicas for backend and frontend services
- Kafka partitions for parallel event processing
- Dapr state stores handle distributed state management