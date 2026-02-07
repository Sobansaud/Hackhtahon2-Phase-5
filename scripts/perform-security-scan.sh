#!/bin/bash

# Script to perform security scan of deployed infrastructure
# This script outlines security scanning procedures for the deployed application

set -e  # Exit on any error

echo "Performing security scan of deployed infrastructure..."
echo "=================================================="

echo ""
echo "SECURITY SCANNING CHECKLIST:"
echo "=========================="

echo "1. Kubernetes Security Scanning:"
echo "   - RBAC configuration review"
echo "   - Network policies assessment"
echo "   - Pod security standards compliance"
echo "   - Secret management verification"

echo ""
echo "2. Dapr Security Assessment:"
echo "   - Service-to-service authentication"
echo "   - Component security configuration"
echo "   - API authentication and authorization"
echo "   - Encryption in transit and at rest"

echo ""
echo "3. Application Security:"
echo "   - Container image vulnerability scanning"
echo "   - API endpoint security"
echo "   - Input validation and sanitization"
echo "   - Authentication and authorization mechanisms"

echo ""
echo "4. Infrastructure Security:"
echo "   - Network segmentation"
echo "   - Load balancer security"
echo "   - Firewall rules"
echo "   - Access control policies"

echo ""
echo "AUTOMATED SECURITY SCANNING TOOLS:"
echo "================================="

echo "1. Trivy - Container Vulnerability Scanner:"
echo "   - Scan all container images for vulnerabilities"
echo "   - Check base OS and application dependencies"
echo "   - Generate compliance reports"

echo ""
echo "2. Kubesec - Kubernetes Resource Security Scanner:"
echo "   - Analyze Kubernetes manifests for security issues"
echo "   - Check for privileged containers"
echo "   - Verify security contexts and policies"

echo ""
echo "3. Polaris - Kubernetes Validator:"
echo "   - Assess Kubernetes configuration best practices"
echo "   - Check for security misconfigurations"
echo "   - Verify resource policies"

echo ""
echo "SECURITY SCAN EXECUTION SCRIPT:"
echo "=============================="

cat << 'EOF_SCAN_SCRIPT' > temp-security-scan.sh
#!/bin/bash

# Security Scan Script
# This script performs various security scans on the infrastructure

echo "Starting security scan of deployed infrastructure..."

# 1. Check for privileged containers
echo "Checking for privileged containers..."
kubectl get pods --all-namespaces -o json | jq '.items[].spec.containers[] | select(.securityContext.privileged == true)'

# 2. Check for secrets in environment variables
echo "Checking for secrets in environment variables..."
kubectl get pods --all-namespaces -o yaml | grep -i -E "(password|secret|key|token)" || echo "No obvious secrets found in pod definitions"

# 3. Check for latest tag usage in images
echo "Checking for 'latest' tag usage in images..."
kubectl get pods --all-namespaces -o yaml | grep -i "image:" | grep latest || echo "No 'latest' tag usage found (good practice)"

# 4. Check for host network usage
echo "Checking for host network usage..."
kubectl get pods --all-namespaces -o json | jq '.items[] | select(.spec.hostNetwork == true) | .metadata.namespace,.metadata.name'

# 5. Check for runAsRoot containers
echo "Checking for containers running as root..."
kubectl get pods --all-namespaces -o json | jq '.items[].spec.containers[] | select(.securityContext.runAsNonRoot == false)'

# 6. Check Dapr components for security
echo "Checking Dapr components for security configurations..."
dapr components -k --all-namespaces -o yaml | grep -i -E "(auth|secret|cert|tls|ssl|credential)" || echo "No security-related configurations found in Dapr components"

# 7. Check for exposed services
echo "Checking for NodePort and LoadBalancer services..."
kubectl get services --all-namespaces -o yaml | grep -E "type: (NodePort|LoadBalancer)" || echo "No external services found"

echo "Security scan completed!"
echo "Review the findings and address any security issues identified."
EOF_SCAN_SCRIPT

echo "Created security scan script: temp-security-scan.sh"

echo ""
echo "DAPR-SPECIFIC SECURITY CHECKS:"
echo "============================"

echo "1. Component Authentication:"
echo "   - Verify all Dapr components use proper authentication"
echo "   - Check secret store configurations"
echo "   - Validate pubsub authentication settings"

echo "2. Service Invocation Security:"
echo "   - Verify mTLS configuration between services"
echo "   - Check access controls for service-to-service communication"

echo "3. State Store Security:"
echo "   - Verify encryption for state storage"
echo "   - Check access permissions for state stores"

echo ""
echo "COMPLIANCE CHECKS:"
echo "================"

echo "1. CIS Kubernetes Benchmark Compliance:"
echo "   - Run kube-bench for CIS benchmark assessment"
echo "   - Address any non-compliant configurations"

echo "2. PCI DSS Considerations (if applicable):"
echo "   - Data encryption requirements"
echo "   - Access logging and monitoring"
echo "   - Network security controls"

echo "3. GDPR Compliance (if applicable):"
echo "   - Data residency requirements"
echo "   - Right to deletion implementations"
echo "   - Consent management"

echo ""
echo "RECOMMENDED SECURITY TOOLS TO RUN:"
echo "================================"

echo "- Run Trivy: trivy image <your-image-name>"
echo "- Run Kubesec: kubesec scan <manifest-file>"
echo "- Run Polaris: polaris audit --namespace <your-namespace>"
echo "- Run kube-bench: kube-bench run"
echo "- Run checkov: checkov -d <your-manifests-directory>"

echo ""
echo "Security scanning procedures documented!"
echo "Regular security scans should be integrated into CI/CD pipeline."