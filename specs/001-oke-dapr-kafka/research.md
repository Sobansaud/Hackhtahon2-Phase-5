# Research & Decisions: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

**Date**: February 04, 2026
**Feature**: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

## Decision: Kafka Choice - Redpanda Cloud vs. Self-Hosted Strimzi
**Rationale**: Redpanda Cloud serverless free tier selected as primary option due to zero management overhead, instant setup, and sufficient capacity for demo purposes. Self-hosted Strimzi on OKE is the fallback option for production scenarios requiring more control.
**Alternatives considered**:
- Self-hosted Kafka on OKE with Strimzi operator (higher maintenance but more control)
- Confluent Cloud (paid service with more features)
- Apache Kafka on VMs (high maintenance, not recommended)

## Decision: Dapr Deployment Style - Helm Annotations vs. dapr run
**Rationale**: Helm annotations approach selected as it's consistent with existing charts, production-ready, and allows centralized management of Dapr sidecars through Kubernetes manifests rather than runtime injection.
**Alternatives considered**:
- dapr run wrapper (more suitable for development, not production)
- Manual sidecar injection (error-prone and not maintainable)

## Decision: CI/CD Trigger - On Push vs. Manual Dispatch
**Rationale**: On push to main branch with manual approval gate for production selected to enable continuous delivery while maintaining safety for production deployments.
**Alternatives considered**:
- Manual dispatch only (slower delivery, but more control)
- On every commit (too frequent, potential for unstable deployments)

## Decision: Monitoring Stack - Prometheus+Grafana vs. Oracle Native
**Rationale**: Prometheus + Grafana selected as primary option due to open-source nature, portability across environments, and rich dashboarding capabilities that allow deep insight into Dapr and Kafka metrics.
**Alternatives considered**:
- Oracle native monitoring only (vendor lock-in, limited customization)
- Hybrid approach (complexity trade-off, but comprehensive coverage)

## Decision: Secret Injection - Kubernetes + Dapr Secretstores
**Rationale**: Combined approach selected where Kubernetes Secrets handle cluster-level secrets and Dapr secretstores provide application-level abstraction and secure access patterns.
**Alternatives considered**:
- Kubernetes Secrets only (exposes secrets directly to applications)
- Dapr secretstores only (might miss some cluster-level configuration needs)

## Decision: OKE Cluster Sizing - Always-Free vs. Paid Scale
**Rationale**: Always-Free tier (4 OCPUs, 24GB RAM) selected to maintain zero cost during development and demo phases while providing sufficient capacity for the application.
**Alternatives considered**:
- Paid scaling (higher cost, unnecessary for demo)
- Smaller cluster (might not handle load adequately)

## Technology Research Findings

### Oracle OKE Setup Best Practices
- Use OCI CLI for cluster creation and management
- Configure proper IAM roles for cluster access
- Implement VCN and subnet configurations for security
- Enable cluster encryption and audit logging

### Dapr Integration Patterns
- Sidecar injection via Helm annotations using `dapr.io/enabled: "true"`
- Component configuration via Kubernetes Custom Resources
- Service invocation through Dapr HTTP/gRPC APIs
- State management using Dapr state APIs
- Pub/Sub messaging through Dapr pubsub building blocks

### Redpanda Cloud Integration
- Serverless tier provides up to 5 topics with 100MB storage
- SASL/SCRAM authentication for secure connections
- Bootstrap servers accessible via public internet
- Compatible with Kafka protocol and ecosystem tools

### GitHub Actions for OKE Deployment
- OCI CLI authentication via GitHub secrets
- Docker image building and pushing to registries
- Helm chart deployment with versioning
- Rollback capabilities via Helm history

### Monitoring & Observability
- Prometheus for metrics collection
- Grafana for dashboarding and visualization
- Dapr-sidecar metrics for service-to-service communication
- Kafka metrics for event processing performance
- Distributed tracing with Jaeger/Zipkin integration

## Architecture Considerations

### Event-Driven Patterns
- Command Query Responsibility Segregation (CQRS) for separation of read/write models
- Saga pattern for managing distributed transactions across services
- Circuit breaker pattern for fault tolerance in service communication
- Event sourcing for audit trails and system state reconstruction

### Resilience Strategies
- Health checks with liveness and readiness probes
- Circuit breakers for failing services
- Retry mechanisms with exponential backoff
- Timeout management for service calls
- Graceful degradation when non-critical services fail

### Security Measures
- Network policies restricting inter-service communication
- Zero-trust secrets management with runtime injection
- OAuth2/JWT-based authentication with Dapr middleware
- Role-based access control for service interactions
- End-to-end encryption for data in transit and at rest