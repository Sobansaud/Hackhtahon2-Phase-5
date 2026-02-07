# Implementation Plan: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

**Branch**: `001-oke-dapr-kafka` | **Date**: February 04, 2026 | **Spec**: [specs/001-oke-dapr-kafka/spec.md](spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deploy the Todo application to Oracle Cloud OKE with full Dapr integration and Redpanda Kafka event streaming. The implementation will establish a production-hardened, event-driven architecture using Dapr sidecars for pub/sub, state management, and secret stores, with automated CI/CD pipeline and comprehensive monitoring.

## Technical Context

**Language/Version**: Infrastructure as Code (HCL/YAML), Docker containers with Python/FastAPI backend and TypeScript/Next.js frontend
**Primary Dependencies**: Dapr runtime, Redpanda Kafka, Oracle OKE, Helm charts, Prometheus/Grafana, GitHub Actions
**Storage**: PostgreSQL (via Neon), Kubernetes Secrets, Dapr state stores
**Testing**: Manual validation of deployment, event flow, and resilience scenarios
**Target Platform**: Oracle Cloud Always-Free OKE Kubernetes cluster (4 OCPUs, 24GB RAM), local Minikube for development
**Project Type**: Web application (existing backend/frontend enhanced with event-driven architecture)
**Performance Goals**: Sub-second event delivery, 99% uptime, 100 concurrent users support
**Constraints**: Oracle OKE only, Always-Free tier resource limits, Redpanda Cloud free tier, zero manual kubectl/helm commands

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Event-First Architecture: All system interactions will follow event-driven patterns with loose coupling
- ✅ Infrastructure-as-Code: All infrastructure configurations will be declarative and version-controlled
- ✅ Dapr-Enabled Portability: All infrastructure dependencies will be abstracted through Dapr
- ✅ Cloud-Native Excellence: All deployments will follow cloud-native best practices
- ✅ Zero-Downtime Operations: Deployments will use Helm upgrades for minimal disruption
- ✅ Agentic Automation: All infrastructure and deployment tasks will be AI-generated
- ✅ Production Resilience: Systems will include comprehensive error handling and self-healing
- ✅ Cost Optimization: Will utilize Oracle Always-Free tier and Redpanda free tier
- ✅ Security-First: Security will be integrated from the beginning with secrets management

## Project Structure

### Documentation (this feature)
```
specs/001-oke-dapr-kafka/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
```
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

charts/                  # Helm charts for deployment
├── todo/
│   ├── templates/
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── dapr-components/
│   │   │   ├── pubsub.yaml
│   │   │   ├── statestore.yaml
│   │   │   └── secretstore.yaml
│   │   ├── kafka-topics.yaml
│   │   └── ingress.yaml
│   ├── values.yaml
│   └── Chart.yaml

dapr-components/         # Dapr component definitions
├── pubsub-kafka.yaml    # Kafka pub/sub configuration
├── statestore-postgres.yaml  # PostgreSQL state management
├── bindings-cron.yaml   # Cron bindings for reminders
└── secretstore-k8s.yaml # Kubernetes secret store

kafka/                   # Kafka configurations
├── topics/
│   ├── task-events.yaml
│   ├── reminders.yaml
│   └── task-updates.yaml
└── strimzi/             # Strimzi configurations for local dev

ci-cd/
└── workflows/
    └── deploy-oke.yaml  # GitHub Actions workflow for OKE deployment

monitoring/
├── dashboards/          # Grafana dashboard configurations
└── alerts/              # Prometheus alert rules

docs/
└── deployment-guide.md  # Oracle OKE deployment documentation
```

**Structure Decision**: Web application with backend and frontend services deployed to Oracle OKE using Helm charts. Infrastructure components include Dapr configurations, Kafka topic definitions, CI/CD workflows, and monitoring setups.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-component architecture | Event-driven system requires separation of concerns | Direct database access would not support loose coupling |
| Dapr integration | Provides vendor portability and distributed systems primitives | Custom service mesh would require more development effort |
| Kafka event streaming | Enables decoupling and resilience through event sourcing | Direct service-to-service calls would create tight coupling |