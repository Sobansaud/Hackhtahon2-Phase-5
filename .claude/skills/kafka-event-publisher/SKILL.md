# Kafka Event Publisher

## Overview
Publish events to Kafka topics using Dapr Pub/Sub:
- task-events (for task lifecycle events)
- reminders (for scheduled notifications)
- task-updates (for task state changes)
- Implement proper event schemas (JSON format)
- Ensure idempotency and at-least-once delivery
- Use Dapr for pub/sub – no direct Kafka code
- Validate event publishing with tests

## Pre-execution
Before publishing events, verify: "Confirm Dapr pubsub component is configured?"

## Post-execution
Validate events are published correctly with Dapr pubsub monitoring

## Implementation Guidelines

### 1. Event Topics Setup
- Configure publishing to task-events topic for task lifecycle events
- Set up reminders topic for scheduled notification events
- Implement task-updates topic for task state change events
- Ensure proper topic partitioning and replication settings

### 2. Event Schema Implementation
- Define JSON schemas for all event types
- Include proper metadata fields (timestamp, correlation ID, etc.)
- Ensure schema versioning for backward compatibility
- Validate event payload structure before publishing

### 3. Dapr Integration
- Use Dapr pub/sub API for all event publishing
- Implement proper error handling for publishing failures
- Include retry mechanisms with exponential backoff
- Ensure connection resilience to Kafka brokers

### 4. Idempotency & Delivery Guarantees
- Implement idempotency keys in events to prevent duplicates
- Ensure at-least-once delivery semantics
- Handle duplicate event processing safely
- Implement proper acknowledgment mechanisms

### 5. Event Publishing Patterns
- Publish task creation events when new tasks are created
- Send reminder events when tasks reach due date/time
- Emit task update events when task properties change
- Publish task completion events when tasks are marked complete

### 6. Testing & Validation
- Test event publishing with various payload sizes
- Verify event ordering where required
- Validate event consumption by downstream services
- Monitor event publishing performance and latency