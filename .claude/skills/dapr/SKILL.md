# Dapr Component Generator

## Overview
Generate Dapr component YAML files:
- pubsub.kafka (for Kafka/Redpanda)
- state.postgresql (for Neon DB)
- bindings.cron (scheduled reminders)
- secretstores.kubernetes (for API keys)
- Output in dapr-components/ folder
- Include metadata for local (Minikube) & cloud (AKS/GKE/OKE)
- Ask before applying: "Apply this component? (kubectl apply -f file.yaml)"

## Pre-execution
Before applying any component, ask: "Apply this component? (kubectl apply -f file.yaml)"

## Post-execution
Verify component is applied correctly with kubectl get commands

## Implementation Guidelines

### 1. PubSub Component (Kafka)
- Generate pubsub.kafka.yaml with proper Kafka/Redpanda configuration
- Include broker addresses and topic configurations
- Set up authentication for both local and cloud environments
- Add appropriate metadata for Minikube and cloud platforms

### 2. State Store Component (PostgreSQL)
- Generate state.postgresql.yaml for Neon DB integration
- Include connection string configurations
- Set up proper authentication mechanisms
- Add retry policies and connection pooling settings

### 3. Cron Bindings Component
- Generate bindings.cron.yaml for scheduled reminders
- Include cron expressions and trigger configurations
- Set up proper error handling and retry mechanisms
- Configure for both local and cloud scheduling

### 4. Secret Store Component
- Generate secretstores.kubernetes.yaml for API key management
- Configure Kubernetes secret store integration
- Include proper RBAC permissions
- Set up secure access to secrets

### 5. Metadata Configuration
- Include appropriate metadata for local Minikube deployment
- Add cloud-specific configurations for AKS/GKE/OKE
- Ensure platform-specific settings are properly isolated
- Use environment variables for dynamic configurations

### 6. Output Organization
- Save all generated components to dapr-components/ folder
- Use descriptive filenames that indicate component type
- Maintain consistent naming conventions
- Include comments explaining configuration options