# Redpanda Credentials Kubernetes Secret Setup

## Overview
This document outlines the process for creating a Kubernetes secret in the OKE cluster to store Redpanda authentication credentials required for the Dapr pubsub component.

## Prerequisites
- kubectl configured and connected to the OKE cluster
- Redpanda Cloud cluster created with authentication credentials
- Access to Redpanda bootstrap server URL and SASL credentials
- Target namespace created (e.g., `todo`)

## Step 1: Prepare Redpanda Credentials

### Gather Required Information:
Before creating the secret, ensure you have:
- **Bootstrap Servers URL**: From your Redpanda Cloud cluster (format: `*.rpk.cloud.redpanda.com:9092`)
- **SASL Username**: From your Redpanda Cloud account
- **SASL Password**: From your Redpanda Cloud account
- **SASL Mechanism**: Usually `PLAIN` for Redpanda Cloud
- **Target Namespace**: Where your application will run (e.g., `todo`)

## Step 2: Create Kubernetes Secret

### Option 1: Using kubectl create secret command:
```bash
# Create the secret in the todo namespace
kubectl create secret generic redpanda-secret \\
  --namespace todo \\
  --from-literal=sasl-username="<your-redpanda-username>" \\
  --from-literal=sasl-password="<your-redpanda-password>" \\
  --from-literal=brokers="<your-redpanda-bootstrap-servers>"
```

### Option 2: Using a YAML manifest:
```bash
# Create a secret manifest file
cat <<EOF > redpanda-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: redpanda-secret
  namespace: todo
type: Opaque
data:
  sasl-username: $(echo -n "<your-redpanda-username>" | base64)
  sasl-password: $(echo -n "<your-redpanda-password>" | base64)
  brokers: $(echo -n "<your-redpanda-bootstrap-servers>" | base64)
EOF

# Apply the secret
kubectl apply -f redpanda-secret.yaml

# Clean up the temporary file
rm redpanda-secret.yaml
```

### Option 3: Using environment variables:
```bash
# Set environment variables (do not log these commands)
export REDPANDA_USERNAME="your-actual-username"
export REDPANDA_PASSWORD="your-actual-password"
export REDPANDA_BROKERS="your-actual-brokers-list"

# Create the secret
kubectl create secret generic redpanda-secret \\
  --namespace todo \\
  --from-literal=sasl-username="$REDPANDA_USERNAME" \\
  --from-literal=sasl-password="$REDPANDA_PASSWORD" \\
  --from-literal=brokers="$REDPANDA_BROKERS"

# Unset environment variables to remove from history
unset REDPANDA_USERNAME
unset REDPANDA_PASSWORD
unset REDPANDA_BROKERS
```

## Step 3: Verify Secret Creation

### Check if Secret Exists:
```bash
# List secrets in the todo namespace
kubectl get secrets -n todo

# Describe the specific secret
kubectl describe secret redpanda-secret -n todo
```

### Verify Secret Contents (for validation):
```bash
# Decode and verify username (be cautious in shared environments)
kubectl get secret redpanda-secret -n todo -o jsonpath='{.data.sasl-username}' | base64 --decode

# Decode and verify password (be cautious in shared environments)
kubectl get secret redpanda-secret -n todo -o jsonpath='{.data.sasl-password}' | base64 --decode

# Decode and verify brokers (be cautious in shared environments)
kubectl get secret redpanda-secret -n todo -o jsonpath='{.data.brokers}' | base64 --decode
```

## Step 4: Update Dapr Component Configuration

### Update the Dapr pubsub component to reference the secret:
```bash
# Update the pubsub-kafka.yaml component to use the secret
kubectl patch -n todo cm/dapr-config --patch '{"data":{"config.yaml":"apiVersion: dapr.io/v1alpha1\\nkind: Component\\nmetadata:\\n  name: pubsub\\nspec:\\n  type: pubsub.kafka\\n  version: v1\\n  metadata:\\n  - name: brokers\\n    value: \"{{PLACEHOLDER}}\"\\n  - name: authRequired\\n    value: \"true\"\\n  - name: saslUsername\\n    secretKeyRef:\\n      name: redpanda-secret\\n      key: sasl-username\\n  - name: saslPassword\\n    secretKeyRef:\\n      name: redpanda-secret\\n      key: sasl-password"}}'
```

Or update your existing pubsub-kafka.yaml file to reference the secret:

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    valueFromSecret:
      name: redpanda-secret
      key: brokers
  - name: authRequired
    value: "true"
  - name: saslUsername
    secretKeyRef:
      name: redpanda-secret
      key: sasl-username
  - name: saslPassword
    secretKeyRef:
      name: redpanda-secret
      key: sasl-password
  - name: saslMechanism
    value: "PLAIN"
  - name: consumerGroup
    value: "todo-app-group"
```

## Step 5: Test Secret Access

### Create a Test Pod to Verify Secret Mounting:
```yaml
# Create a temporary test pod to verify secret access
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  namespace: todo
spec:
  containers:
  - name: test-container
    image: busybox
    command: ["/bin/sh", "-c", "env | grep REDPANDA"]
    env:
    - name: REDPANDA_USERNAME
      valueFrom:
        secretKeyRef:
          name: redpanda-secret
          key: sasl-username
    - name: REDPANDA_PASSWORD
      valueFrom:
        secretKeyRef:
          name: redpanda-secret
          key: sasl-password
    - name: REDPANDA_BROKERS
      valueFrom:
        secretKeyRef:
          name: redpanda-secret
          key: brokers
  restartPolicy: Never
```

Apply this test pod, check the logs, and then delete it:
```bash
kubectl apply -f test-pod.yaml -n todo
kubectl logs secret-test-pod -n todo
kubectl delete pod secret-test-pod -n todo
```

## Security Best Practices

### For Secret Management:
- Never store secrets in plain text in Git repositories
- Use proper RBAC to restrict access to secrets
- Rotate credentials regularly
- Audit secret access and usage
- Use sealed-secrets or external secret stores for additional security

### For Redpanda Access:
- Use dedicated service accounts for each application
- Limit permissions to specific topics
- Enable encryption in transit and at rest
- Monitor authentication attempts and access patterns

## Troubleshooting

### Common Issues:
1. **Secret not found**: Verify namespace and secret name
2. **Access denied**: Check RBAC permissions
3. **Incorrect credentials**: Verify the values match your Redpanda Cloud account
4. **Base64 encoding issues**: Ensure proper encoding without newlines

### Debugging Commands:
```bash
# Check all secrets in the namespace
kubectl get secrets -n todo -o yaml

# Verify specific secret keys exist
kubectl get secret redpanda-secret -n todo -o jsonpath='{.data}' | tr ' ' '\n'

# Check if your application can access the secret
kubectl auth can-i get secrets -n todo --as=system:serviceaccount:todo:default
```

## Integration with Dapr Components

Once the secret is created, ensure your Dapr component configurations reference it properly. The pubsub component should use `secretKeyRef` to reference the values stored in the Kubernetes secret, allowing Dapr to access the credentials securely at runtime.

## Next Steps

After creating the secret:
1. Update your Dapr component configurations to reference the secret
2. Apply the updated Dapr components to your cluster
3. Verify that your application can connect to Redpanda using the credentials
4. Test event publishing and consumption through the Dapr pubsub component