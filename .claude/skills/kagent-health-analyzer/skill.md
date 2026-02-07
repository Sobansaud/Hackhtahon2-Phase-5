# kagent Health Analyzer Skill

## Purpose
This skill provides cluster-level insights using kagent for analyzing health, optimizing resource allocation, diagnosing pod failures, and generating actionable recommendations based on kagent output.

## Capabilities
- Execute kagent commands for cluster health analysis
- Optimize resource allocation based on cluster usage patterns
- Diagnose pod failures and their root causes
- Generate comprehensive summaries of kagent output
- Provide actionable recommendations for cluster improvements
- Interpret kagent analysis results and translate to practical actions

## Implementation Details

### Cluster Health Analysis
- Analyze overall cluster status and component health
- Check control plane component statuses (API server, etcd, scheduler, controller manager)
- Evaluate node health and resource utilization
- Assess networking and storage subsystems
- Identify potential bottlenecks or issues

### Resource Allocation Optimization
- Analyze current resource usage patterns across the cluster
- Identify over-provisioned and under-provisioned resources
- Recommend resource limit and request adjustments
- Suggest node pool scaling based on workload demands
- Optimize scheduling efficiency

### Pod Failure Diagnostics
- Analyze failed pod patterns and common causes
- Check for resource contention issues
- Identify configuration errors leading to failures
- Examine node-related issues affecting pods
- Review logs and events for failure patterns

### Output Interpretation
- Summarize kagent analysis results in a clear format
- Highlight critical issues requiring immediate attention
- Prioritize recommendations based on severity
- Translate technical findings into actionable steps
- Provide context for recommendations

## Usage

### Common kagent Commands:

#### Cluster Health Analysis:
```
kagent "analyze cluster health"
```

#### Resource Optimization:
```
kagent "optimize resource allocation"
```

#### Pod Failure Investigation:
```
kagent "why are pods failing"
```

#### Comprehensive Analysis:
```
kagent "perform complete cluster analysis"
```

### Analysis Workflow:

#### Step 1: Execute kagent command
```
kagent_output=$(kagent "{analysis_request}")
```

#### Step 2: Parse and summarize results
- Extract key metrics and findings
- Identify critical issues
- Group related problems
- Determine severity levels

#### Step 3: Generate recommendations
- Immediate actions for critical issues
- Medium-term optimizations
- Long-term capacity planning suggestions
- Best practice implementations

### Example Output Format:
```
Cluster Health Analysis Summary:
- Overall Status: {status}
- Critical Issues Found: {count}
- Resource Utilization: {overview}
- Recommendations: {list}

Detailed Findings:
- {finding_1}: {description}
- {finding_2}: {description}

Recommended Actions:
1. {action_1}: {priority_level}
2. {action_2}: {priority_level}
3. {action_3}: {priority_level}
```

### kagent Command Examples:

#### For Cluster Health:
```
kagent "analyze cluster health and provide a summary of any issues"
```

#### For Resource Optimization:
```
kagent "analyze resource allocation and suggest optimizations for CPU and memory"
```

#### For Pod Failures:
```
kagent "investigate recent pod failures and explain the most common causes"
```

#### For Capacity Planning:
```
kagent "analyze current usage trends and recommend scaling actions"
```

### Recommended Actions Framework:

#### Immediate (0-1 hour):
- Critical security patches
- Failed components requiring restart
- Resource exhaustion issues

#### Short-term (1-24 hours):
- Configuration corrections
- Minor resource adjustments
- Pod restarts/redeployments

#### Medium-term (1-7 days):
- Resource limit optimizations
- Node pool adjustments
- Storage optimizations

#### Long-term (1-4 weeks):
- Architecture improvements
- Scaling strategy implementations
- Monitoring enhancements