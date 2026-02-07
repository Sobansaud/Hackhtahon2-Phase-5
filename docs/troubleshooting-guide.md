# Troubleshooting Guide: Oracle OKE Cloud-Native Deployment & Dapr + Kafka Integration

## Common Issues and Solutions

### Dapr Sidecar Issues

#### Issue: Dapr sidecar not injected
**Symptoms**: Pods start without Dapr sidecar, application can't access Dapr services
**Solution**:
1. Verify Helm values have `dapr.enabled=true`
2. Check that pods have the annotation `dapr.io/enabled: "true"`
3. Verify Dapr control plane is running: `kubectl get pods -n dapr-system`
4. Check Dapr logs: `kubectl logs -n dapr-system <dapr-operator-pod>`

#### Issue: Dapr sidecar fails to start
**Symptoms**: Dapr sidecar crashes or enters CrashLoopBackOff
**Solution**:
1. Check Dapr logs: `kubectl logs <pod-name> -c daprd`
2. Verify Dapr component configurations: `kubectl get components.dapr.io -A`
3. Check if there are syntax errors in Dapr component YAML files
4. Verify network connectivity between sidecar and control plane

### Kafka Connectivity Issues

#### Issue: Cannot connect to Redpanda
**Symptoms**: Application fails to publish/consume events, Kafka connection errors
**Solution**:
1. Verify Redpanda bootstrap servers URL in Dapr component configuration
2. Check if SASL credentials are correctly configured in Kubernetes secret
3. Test connectivity: `kubectl run test-kafka --image=busybox --rm -it --restart=Never -- wget <bootstrap-server-url>`
4. Verify Redpanda cluster status in Redpanda Cloud console

#### Issue: Kafka topics not created
**Symptoms**: Events are not flowing, topic not found errors
**Solution**:
1. For local Strimzi: `kubectl apply -f kafka/topics/`
2. For Redpanda Cloud: Verify topics exist in the Redpanda console
3. Check if Dapr pubsub component has correct topic names
4. Verify topic permissions and ACLs

### Kubernetes Deployment Issues

#### Issue: Pod fails to start
**Symptoms**: Pod stuck in Pending or CrashLoopBackOff state
**Solution**:
1. Check pod status: `kubectl describe pod <pod-name> -n todo`
2. Check pod logs: `kubectl logs <pod-name> -n todo`
3. Verify resource limits/requests in Helm values match cluster capacity
4. Check if all required secrets are available: `kubectl get secrets -n todo`
5. Verify image pull secrets if using private registry

#### Issue: Service unavailable
**Symptoms**: Cannot reach application via service or ingress
**Solution**:
1. Check service endpoints: `kubectl get endpoints <service-name> -n todo`
2. Verify service selectors match pod labels
3. Check ingress configuration: `kubectl get ingress -n todo`
4. Verify LoadBalancer/NodePort is properly configured

### Helm Deployment Issues

#### Issue: Helm install fails
**Symptoms**: `helm install` command fails with various errors
**Solution**:
1. Check Helm chart syntax: `helm lint charts/todo/`
2. Verify values.yaml is properly formatted
3. Check if namespace exists: `kubectl get namespace todo`
4. Verify Helm repository dependencies: `helm dependency build charts/todo/`

#### Issue: Helm upgrade fails
**Symptoms**: `helm upgrade` command fails
**Solution**:
1. Check for breaking changes in new chart version
2. Use `--dry-run` flag to preview changes
3. Check if CRDs need manual update
4. Consider rolling back: `helm rollback <release-name>`

### Monitoring and Observability Issues

#### Issue: Metrics not appearing in Prometheus
**Symptoms**: Grafana dashboards show no data
**Solution**:
1. Check Prometheus targets: `kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090`
2. Verify service monitors are correctly configured
3. Check if applications expose metrics endpoints
4. Verify Prometheus can reach application pods

#### Issue: Grafana not accessible
**Symptoms**: Cannot access Grafana dashboard
**Solution**:
1. Check Grafana service: `kubectl get svc -n monitoring | grep grafana`
2. Port forward to access: `kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80`
3. Get admin password: `kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode`
4. Verify Grafana dashboards are imported correctly

### Dapr Component Issues

#### Issue: State store not working
**Symptoms**: Cannot save/retrieve state via Dapr
**Solution**:
1. Verify state store component configuration
2. Check if the backing store (PostgreSQL) is accessible
3. Verify connection string and credentials
4. Test state operations with Dapr CLI: `dapr state get <state-store-name> <key>`

#### Issue: Secret store not working
**Symptoms**: Cannot retrieve secrets via Dapr
**Solution**:
1. Verify secret store component configuration
2. Check if Kubernetes secrets exist: `kubectl get secrets -n todo`
3. Verify Dapr has proper RBAC permissions for secret access
4. Test secret retrieval: `dapr secret get <secret-store-name> <key>`

### Network and Security Issues

#### Issue: Service-to-service communication fails
**Symptoms**: Services cannot call each other
**Solution**:
1. Check if Dapr service invocation is used correctly
2. Verify service names match Dapr app-id
3. Check network policies blocking traffic
4. Verify TLS settings if enabled

#### Issue: Ingress not routing correctly
**Symptoms**: Requests to ingress URL return 404 or connection refused
**Solution**:
1. Check ingress rules: `kubectl describe ingress -n todo`
2. Verify backend service names match ingress backend specification
3. Check if ingress controller is running: `kubectl get pods -n ingress-nginx`
4. Verify DNS resolution and hostname configuration

## Diagnostic Commands

### Dapr Diagnostics
```bash
# Check Dapr control plane
kubectl get pods -n dapr-system

# Check Dapr components
kubectl get components.dapr.io -A

# Check Dapr subscriptions
kubectl get subscriptions.dapr.io -A

# Get Dapr status
dapr status -k
```

### Kubernetes Diagnostics
```bash
# Check all pods in todo namespace
kubectl get pods -n todo

# Describe problematic pod
kubectl describe pod <pod-name> -n todo

# Check logs
kubectl logs <pod-name> -n todo

# Check services
kubectl get svc -n todo

# Check ingress
kubectl get ingress -n todo
```

### Application Diagnostics
```bash
# Check if Dapr sidecars are running
kubectl get pods -n todo -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .spec.containers[*]}{.name}{"\t"}{end}{"\n"}{end}'

# Check Dapr sidecar logs
kubectl logs <pod-name> -c daprd -n todo
```

## Prevention Tips

1. Always validate Dapr component YAMLs before applying
2. Use resource limits to prevent resource exhaustion
3. Regularly rotate secrets and credentials
4. Monitor cluster resources to prevent capacity issues
5. Keep Dapr runtime updated to latest stable version
6. Test disaster recovery procedures regularly
7. Implement proper logging and monitoring from day one