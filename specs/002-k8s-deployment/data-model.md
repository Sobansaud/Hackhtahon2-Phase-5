# Data Model: Kubernetes Resources for Local Deployment

**Date**: 2026-01-21
**Feature**: 002-k8s-deployment

## Kubernetes Resource Models

### Containerized Applications
- **Frontend Image**: Next.js application container with optimized multi-stage build
  - Fields: image name, tag, registry, security context
  - Relationships: Connected to backend service via network policies
- **Backend Image**: FastAPI application with Cohere integration container
  - Fields: image name, tag, registry, security context, API keys
  - Relationships: Connects to database and external Cohere API

### Kubernetes Deployment Resources
- **Frontend Deployment**:
  - Fields: replicas, resource limits/requests, liveness/readiness probes, environment variables
  - Validation: Must include security context with non-root user
  - State transitions: Pending → Running → Terminated
- **Backend Deployment**:
  - Fields: replicas, resource limits/requests, liveness/readiness probes, secret mounts
  - Validation: Must include security context and secret references
  - State transitions: Pending → Running → Terminated

### Service Resources
- **Frontend Service**:
  - Fields: service type, ports, selector
  - Relationships: Connected to frontend deployment
  - Validation: Must expose correct port for web traffic
- **Backend Service**:
  - Fields: service type, ports, selector
  - Relationships: Connected to backend deployment
  - Validation: Must expose correct API port

### Ingress Resource
- **Application Ingress**:
  - Fields: host, path rules, TLS configuration, backend services
  - Relationships: Routes to frontend and backend services
  - Validation: Must handle both frontend routes and API calls to backend

### Configuration Resources
- **Secrets**:
  - Fields: BETTER_AUTH_SECRET, COHERE_API_KEY, DATABASE_URL
  - Relationships: Mounted to backend deployment
  - Validation: Must not be stored in plain text
- **ConfigMaps**:
  - Fields: application configuration, environment-specific settings
  - Relationships: Referenced by deployments
  - Validation: Must not contain sensitive information

### Horizontal Pod Autoscaler (HPA)
- **Frontend HPA**:
  - Fields: min/max replicas, CPU/memory targets, scale-down policies
  - Relationships: Targets frontend deployment
  - Validation: Must have reasonable scaling thresholds
- **Backend HPA**:
  - Fields: min/max replicas, CPU/memory targets, custom metrics
  - Relationships: Targets backend deployment
  - Validation: Must have appropriate scaling parameters

### Persistent Storage (if needed)
- **PersistentVolumeClaim**:
  - Fields: storage size, access modes, storage class
  - Relationships: Mounted to backend deployment (for database)
  - Validation: Must have appropriate size and access mode

### Network Policies
- **Frontend Network Policy**:
  - Fields: ingress/egress rules, allowed sources/destinations
  - Relationships: Applied to frontend pods
  - Validation: Must allow necessary traffic only
- **Backend Network Policy**:
  - Fields: ingress/egress rules, allowed sources/destinations
  - Relationships: Applied to backend pods
  - Validation: Must allow necessary traffic only