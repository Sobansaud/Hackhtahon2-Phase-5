#!/bin/bash

# Script to prepare demo materials and document where screenshots should be taken
# This script outlines the key views that should be captured for demo purposes

set -e  # Exit on any error

echo "Preparing demo materials and screenshot documentation..."

echo ""
echo "Demo Screenshot Checklist:"
echo "========================="

echo ""
echo "1. Application Interface:"
echo "   - Screenshot of the main Todo application UI"
echo "   - Show task creation and management functionality"
echo "   - Highlight Dapr integration features if visible"

echo ""
echo "2. OKE Cluster Dashboard:"
echo "   - Oracle Cloud Console view of the OKE cluster"
echo "   - Show cluster health and node status"
echo "   - Display running pods and services"

echo ""
echo "3. Dapr Components:"
echo "   - Dapr dashboard showing pubsub, state management, and bindings"
echo "   - Dapr sidecar status in the application pods"
echo "   - Component configuration view"

echo ""
echo "4. Kafka/Redpanda Integration:"
echo "   - Redpanda Cloud dashboard showing topics"
echo "   - Message flow visualization"
echo "   - Event processing statistics"

echo ""
echo "5. Monitoring Dashboards:"
echo "   - Grafana dashboard showing application metrics"
echo "   - Dapr runtime metrics"
echo "   - Kafka event processing metrics"
echo "   - System resource utilization"

echo ""
echo "6. CI/CD Pipeline:"
echo "   - GitHub Actions workflow execution view"
echo "   - Successful deployment logs"
echo "   - Automated testing results"

echo ""
echo "7. Terminal Commands:"
echo "   - kubectl get pods output showing healthy state"
echo "   - dapr status output"
echo "   - Application health check results"

echo ""
echo "Screenshot Requirements:"
echo "======================="
echo "- High resolution (at least 1920x1080)"
echo "- Clear visibility of important UI elements"
echo "- Good lighting and contrast"
echo "- Consistent naming convention: demo-step-[number]-[description].png"
echo "- Store in docs/screenshots/ directory"

echo ""
echo "Demo Materials Preparation:"
echo "========================"
echo "1. Create a demo video showing the complete workflow"
echo "2. Prepare a slide deck highlighting key features"
echo "3. Document the demo sequence and talking points"
echo "4. Create a backup plan for offline demonstration"

echo ""
echo "Demo screenshot preparation completed!"
echo "Actual screenshots should be taken when the system is fully deployed and functional."