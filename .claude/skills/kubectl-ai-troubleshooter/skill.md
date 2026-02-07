# kubectl-ai Troubleshooter Skill

## Purpose
This skill provides intelligent kubectl-ai prompts for diagnosing and resolving common Kubernetes issues, including pod crashes, image pull errors, resource OOM issues, and service connectivity problems. It suggests fixes via Helm values overrides.

## Capabilities
- Generate intelligent kubectl-ai prompts for common Kubernetes issues
- Diagnose Pod crashloop issues with root cause analysis
- Identify and resolve Image pull errors
- Address Resource OOM (Out of Memory) problems
- Troubleshoot Service not reachable issues
- Suggest fixes via Helm values overrides
- Provide remediation commands for identified issues

## Implementation Details

### Pod CrashLoopBackOff Diagnosis
- Analyze pod logs for crash patterns
- Check container exit codes and reasons
- Examine resource constraints causing crashes
- Identify configuration issues leading to crashes
- Generate appropriate kubectl-ai diagnostic prompts

### Image Pull Error Resolution
- Identify registry authentication issues
- Check image name and tag correctness
- Verify pull secrets configuration
- Analyze image pull policy settings
- Generate kubectl-ai prompts for image-related issues

### Resource OOM Troubleshooting
- Analyze memory usage patterns
- Check resource limits and requests
- Identify memory leaks in applications
- Suggest appropriate resource adjustments
- Generate kubectl-ai prompts for resource analysis

### Service Connectivity Issues
- Check Service and Endpoint configurations
- Verify NetworkPolicies affecting connectivity
- Analyze Ingress configurations if applicable
- Examine DNS resolution issues
- Generate kubectl-ai prompts for networking issues

### Helm Values Override Suggestions
- Identify parameters that can be adjusted via Helm values
- Suggest resource limit increases
- Recommend replica count adjustments
- Propose configuration changes via values override
- Generate appropriate Helm upgrade commands

## Usage

### Common kubectl-ai Prompts for Issues:

#### Pod CrashLoopBackOff:
```
kubectl-ai "Analyze pod {pod-name} in namespace {namespace} showing CrashLoopBackOff. Check logs, describe pod, and identify the root cause."
```

#### Image Pull Error:
```
kubectl-ai "Investigate ImagePullBackOff for pod {pod-name}. Check image name, registry access, and pull secrets."
```

#### Resource OOM Issues:
```
kubectl-ai "Examine pod {pod-name} for OutOfMemory issues. Analyze resource usage and suggest appropriate limits."
```

#### Service Not Reachable:
```
kubectl-ai "Troubleshoot why service {service-name} is not reachable. Check endpoints, network policies, and ingress."
```

### Diagnostic Commands:
```bash
# Generic troubleshooting
kubectl-ai "Analyze the current state of pods in {namespace} and identify any issues."

# Pod-specific diagnostics
kubectl-ai "Describe pod {pod-name} and explain any abnormal conditions."

# Service connectivity
kubectl-ai "Check connectivity for service {service-name} and suggest fixes."

# Resource analysis
kubectl-ai "Analyze resource usage for deployment {deployment-name} and suggest optimizations."
```

### Helm Values Override Examples:
```bash
# Increase memory limits
helm upgrade {release-name} {chart-name} --set backend.resources.limits.memory=512Mi

# Increase CPU limits
helm upgrade {release-name} {chart-name} --set frontend.resources.limits.cpu=500m

# Adjust replica count
helm upgrade {release-name} {chart-name} --set backend.replicaCount=2

# Fix image pull issues
helm upgrade {release-name} {chart-name} --set image.pullSecrets={secret-name}

# Adjust liveness/readiness probes
helm upgrade {release-name} {chart-name} \\
  --set backend.livenessProbe.initialDelaySeconds=60 \\
  --set backend.readinessProbe.periodSeconds=10
```

### Issue-Specific Remediation Patterns:

#### For CrashLoopBackOff:
1. Check logs: `kubectl-ai "Show logs from pod {pod-name} --previous"`
2. Describe pod: `kubectl-ai "Describe pod {pod-name} and explain the events"`
3. Suggest fix: `kubectl-ai "Based on the crash reason, suggest Helm values to fix this"`

#### For Image Pull Errors:
1. Check event messages: `kubectl-ai "Explain the events in pod {pod-name} related to image pulling"`
2. Verify registry: `kubectl-ai "Verify if image {image-name} exists in the registry"`
3. Suggest fix: `kubectl-ai "Recommend Helm values to fix image pull issue"`

#### For OOM Issues:
1. Analyze usage: `kubectl-ai "Analyze resource usage of pod {pod-name}"`
2. Check limits: `kubectl-ai "Compare current limits with actual usage for pod {pod-name}"`
3. Suggest adjustment: `kubectl-ai "Recommend increased memory limits via Helm values"`