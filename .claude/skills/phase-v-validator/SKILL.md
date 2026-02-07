# Phase V Validator

## Overview
Run final validation checklist:
- Test advanced features (recurring, reminders, search/filter)
- Verify Kafka events flow (publish → consume)
- Check Dapr sidecar logs
- Cloud URL test: chatbot works, tasks persist
- CI/CD pipeline run success
- Prepare 90-second demo script
- Output: PASS/FAIL report with evidence

## Pre-execution
Before validation, verify: "Confirm all Phase V components are deployed?"

## Post-execution
Generate comprehensive PASS/FAIL report with validation evidence

## Implementation Guidelines

### 1. Advanced Features Testing
- Test recurring task functionality and auto-rescheduling
- Verify reminder system triggers correctly
- Validate search and filter capabilities
- Confirm priority and tag management features

### 2. Kafka Event Flow Verification
- Test event publishing to task-events topic
- Verify reminder events are sent correctly
- Confirm task-update events are flowing
- Validate event consumption by downstream services

### 3. Dapr Sidecar Validation
- Check Dapr sidecar logs for errors
- Verify pub/sub functionality
- Confirm state management operations
- Validate service-to-service communication

### 4. Cloud URL Testing
- Test chatbot functionality via cloud URL
- Verify tasks persist across sessions
- Confirm advanced features work in cloud environment
- Test user authentication and authorization

### 5. CI/CD Pipeline Validation
- Verify latest pipeline run was successful
- Confirm Docker images were built and pushed
- Validate Helm deployment completed successfully
- Check for any pipeline warnings or errors

### 6. Demo Script Preparation
- Create 90-second demo script highlighting key features
- Outline sequence of operations to showcase
- Prepare talking points for each feature
- Include backup demonstrations in case of issues

### 7. Report Generation
- Create comprehensive PASS/FAIL report
- Include evidence screenshots and logs
- Document any issues found during validation
- Provide recommendations for improvements