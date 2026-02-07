# Research Document: Local Kubernetes Deployment for The Evolution of Todo - Phase IV

**Date**: 2026-01-21
**Feature**: 002-k8s-deployment

## Technical Decisions & Findings

### Decision: Docker Strategy - Gordon-first Intelligence vs. Standard Best-practice Fallback
**Rationale**: Following the constitution's mandate to prioritize AI-assisted tools (Gordon) for all DevOps tasks with zero-manual-coding goal. Gordon provides optimized, security-aware Dockerfiles that follow best practices automatically.
**Alternatives considered**:
- Manual Dockerfile creation (rejected - violates zero-manual-coding principle)
- Standard template Dockerfiles (rejected - less optimized and secure)
**Chosen approach**: Gordon-first with Docker Engineer Agent fallback if Gordon unavailable

### Decision: Helm Chart Generation - kubectl-ai First-generation vs. kagent Refinement
**Rationale**: kubectl-ai excels at initial chart generation from high-level specifications while kagent provides intelligent refinement, resource tuning, and probe hardening.
**Alternatives considered**:
- Manual Helm chart creation (rejected - violates zero-manual-coding principle)
- Using only kubectl-ai (rejected - lacks optimization capabilities)
- Using only kagent (rejected - less intuitive for initial generation)
**Chosen approach**: kubectl-ai for initial chart generation + kagent for refinement and optimization

### Decision: Minikube Configuration - Docker Driver with High Resources
**Rationale**: Docker driver provides the best performance and compatibility for local development. Higher resources (--cpus=4 --memory=8192) ensure realistic chatbot performance during demonstrations.
**Alternatives considered**:
- Default resources (rejected - insufficient for realistic performance)
- Different drivers (virtualbox/hyperv) (rejected - docker provides better integration)
**Chosen approach**: Minikube with docker driver and --cpus=4 --memory=8192

### Decision: Access Method - Ingress with Port-forward Fallback
**Rationale**: Ingress provides production-like access patterns and demonstrates enterprise-level capabilities. Port-forward serves as reliable fallback.
**Alternatives considered**:
- Port-forward only (rejected - less production-like)
- NodePort only (rejected - less flexible)
**Chosen approach**: Ingress enabled with minikube tunnel + port-forward fallback

### Decision: AI Tool Integration Pipeline
**Rationale**: Following the constitution's AI-first DevOps principle with specialized agents for specific tasks.
**Pipeline**:
1. Docker Engineer Agent: Containerization using Gordon AI
2. Helm Chart Engineer Agent: Chart generation using kubectl-ai/kagent
3. Kubernetes Deploy Agent: Deployment to Minikube
4. AIOps Troubleshooter Agent: Monitoring and troubleshooting
5. K8s Validation Agent: Final validation and optimization

### Decision: Security Implementation
**Rationale**: Following constitution's security-first principle with multiple layers of protection.
**Components**:
- Kubernetes Secrets for sensitive data (BETTER_AUTH_SECRET, COHERE_API_KEY, DATABASE_URL)
- Non-root containers with security contexts
- Resource limits to prevent resource exhaustion
- Network policies for inter-service communication (optional but recommended)

### Decision: Production-readiness Features
**Rationale**: Meeting the constitution's production hardening requirements for enterprise-level demonstration.
**Features**:
- Liveness and readiness probes for self-healing
- Horizontal Pod Autoscaler (HPA) readiness for scalability
- Resource limits and requests for stability
- Comprehensive logging and monitoring
- Graceful startup/shutdown procedures