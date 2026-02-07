# AI Helm Chart Creator Skill

## Purpose
This skill provides implementation details for generating complete Helm chart structures using kubectl-ai for frontend and backend applications, with configurable parameters and support for environment variables from secrets and configmaps.

## Capabilities
- Generate complete Helm chart structure with all necessary files
- Create basic Deployment and Service resources for frontend and backend
- Implement configurable parameters (replicas, imagePullPolicy, resources)
- Support environment variables from secrets and configmaps
- Generate values.yaml with sensible defaults
- Create templates for common Kubernetes resources

## Implementation Details

### Helm Chart Structure
- Create standard Helm chart directory structure
- Generate Chart.yaml with proper metadata
- Create values.yaml with configurable parameters
- Implement templates for Deployments, Services, and other resources
- Include NOTES.txt for post-installation instructions

### Deployment Configuration
- Generate Deployment manifests with configurable replicas
- Implement imagePullPolicy configuration (Always, IfNotPresent, Never)
- Configure resource limits and requests (CPU, memory)
- Support container port configuration
- Implement proper labels and selectors

### Service Configuration
- Generate Service manifests for frontend and backend
- Support different service types (ClusterIP, LoadBalancer, NodePort)
- Configure appropriate ports and targetPorts
- Implement proper selectors to match Deployments

### Environment Variables Support
- Support environment variables from ConfigMaps
- Support sensitive data from Secrets
- Implement proper mounting of ConfigMaps and Secrets as volumes
- Allow inline environment variable definitions in values

### Configurable Parameters
- Replicas count for scaling
- Resource limits and requests for CPU and memory
- Image pull policy configuration
- Port configurations
- Health check parameters (liveness, readiness probes)

## Usage

### Chart Structure Example:
```
my-app/
├── Chart.yaml
├── values.yaml
├── charts/
└── templates/
    ├── deployment-frontend.yaml
    ├── deployment-backend.yaml
    ├── service-frontend.yaml
    ├── service-backend.yaml
    ├── _helpers.tpl
    └── NOTES.txt
```

### Values.yaml Example:
```yaml
frontend:
  replicaCount: 1
  image:
    repository: my-frontend
    pullPolicy: IfNotPresent
    tag: ""
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 64Mi
  service:
    type: ClusterIP
    port: 3000

backend:
  replicaCount: 1
  image:
    repository: my-backend
    pullPolicy: IfNotPresent
    tag: ""
  resources:
    limits:
      cpu: 200m
      memory: 256Mi
    requests:
      cpu: 100m
      memory: 128Mi
  service:
    type: ClusterIP
    port: 8000
  envFromSecrets:
    - name: backend-secrets
  envFromConfigMaps:
    - name: backend-config
```

### Deployment Template Example:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}-{{ .Values.component.name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "my-app.fullname" . }}-{{ .Values.component.name }}
  template:
    metadata:
      labels:
        app: {{ include "my-app.fullname" . }}-{{ .Values.component.name }}
    spec:
      containers:
      - name: {{ .Values.component.name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: {{ .Values.service.port }}
        resources:
{{ toYaml .Values.resources | indent 10 }}
        envFrom:
{{- if .Values.envFromSecrets }}
{{- range .Values.envFromSecrets }}
        - secretRef:
            name: {{ .name }}
{{- end }}
{{- end }}
{{- if .Values.envFromConfigMaps }}
{{- range .Values.envFromConfigMaps }}
        - configMapRef:
            name: {{ .name }}
{{- end }}
{{- end }}
```