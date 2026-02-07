# Redpanda Cloud Setup Guide

## Overview
This document outlines the setup process for Redpanda Cloud, which will serve as the Kafka-compatible event streaming platform for the Todo application's event-driven architecture.

## Prerequisites
- Active internet connection
- Web browser for accessing Redpanda Cloud Console
- Account on Redpanda Cloud (free tier available)

## Step 1: Create Redpanda Cloud Account
1. Navigate to https://cloud.redpanda.com/
2. Click on "Sign Up" or "Get Started Free"
3. Follow the registration process with your email and organization details
4. Verify your email address through the confirmation link sent to your inbox
5. Complete the initial onboarding questionnaire

## Step 2: Create a Free Serverless Cluster
1. Log in to your Redpanda Cloud Console
2. Click on "Create Cluster"
3. Select "Serverless" option
4. Choose the "Free Tier" plan (up to 5 topics with 100MB storage)
5. Select an appropriate region closest to your users
6. Give your cluster a descriptive name (e.g., "todo-app-cluster")
7. Click "Create Cluster" and wait for provisioning

## Step 3: Generate Authentication Credentials
1. Once cluster is created, go to the "Settings" or "Security" tab
2. Click on "Create New Credential" or "API Keys"
3. Provide a descriptive name for the credentials (e.g., "todo-app-producer-consumer")
4. Note down the generated credentials:
   - Access Key (equivalent to username)
   - Secret Key (equivalent to password)
5. Save these credentials securely as they will be needed for application configuration

## Step 4: Obtain Bootstrap Server URL
1. In your cluster dashboard, locate the "Connection Settings" or "Connect" section
2. Copy the bootstrap server URL, which typically looks like:
   ```
   <unique-id>.<region>.managed-aws-us-west-2.redpanda.cloud:9092
   ```
3. This URL will be used in the Dapr pubsub component configuration

## Step 5: Create Required Topics
Using the Redpanda Cloud Console or rpk (Redpanda's command-line tool):

1. Create `task-events` topic:
   - Partitions: 3 (for parallelism)
   - Replication: 1 (for free tier)
   - Retention: 7 days (or as needed)

2. Create `reminders` topic:
   - Partitions: 3
   - Replication: 1
   - Retention: 7 days

3. Create `task-updates` topic:
   - Partitions: 3
   - Replication: 1
   - Retention: 7 days

## Step 6: Configure Application Integration
1. Update the Dapr pubsub component configuration with:
   - Bootstrap server URL
   - SASL credentials (Access Key and Secret Key)
   - Topic names created in Step 5

2. The configuration should match the pubsub-kafka.yaml created in the dapr-components directory.

## Step 7: Test Connection
1. Use the Redpanda Cloud Console to verify connectivity
2. Optionally, use rpk command-line tool to test produce/consume operations
3. Verify that your application can successfully publish and consume messages from the topics

## Security Best Practices
- Rotate credentials periodically
- Use the principle of least privilege when setting permissions
- Monitor cluster usage and performance metrics
- Implement proper error handling for connection failures

## Troubleshooting
- If connection fails, verify bootstrap server URL and credentials
- Check firewall settings if connecting from restricted networks
- Verify that topic names match exactly between application and Redpanda
- Review cluster logs in the Redpanda Cloud Console for detailed error messages