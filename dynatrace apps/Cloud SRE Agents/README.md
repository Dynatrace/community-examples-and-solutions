# Cloud SRE Agents
Combine the power of Dynatrace Intelligence, your engineering teams, and cloud-native AI agents from AWS, Azure, and Google Cloud to reduce Mean Time to Resolution.

## How It Works
When Dynatrace Intelligence detects a problem, Cloud SRE Agents automatically dispatches it to the right cloud-native AI agents based on your Interaction Profiles. The agents investigate using their platform's native tooling, collaborate with Dynatrace and return insights back to the Dynatrace problem — all without leaving Dynatrace.

1. Dynatrace detects a problem matching the workflow trigger.
2. Profiles are evaluated — filters determine which agents should handle it.
3. Agents are dispatched (with optional deferral) in parallel.
4. Investigation results are written back as problem annotations and stored as bizevents.
5. Mitigation (AWS and Azure only) may follow a successful investigation.
6. The Periodic Tasks workflow polls for incomplete investigations (Azure, Google Cloud) and detects stale tasks (AWS).

## Supported Cloud Agents
- [AWS DevOps Agent](https://aws.amazon.com/devops-agent/) — Investigation and mitigation.
- [Azure SRE Agent](https://learn.microsoft.com/en-us/azure/sre-agent/) — Investigation and mitigation.
- [Google Cloud Assist](https://docs.cloud.google.com/cloud-assist/investigations) — Investigation only.

## Key Concepts
```
  ┌─────────────┐
  │   Problem    │    Dynatrace detects an issue
  └──────┬───────┘
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │          Interaction Profile                 │
  │  ┌───────────────────────────────────────┐  │
  │  │  Global Filters (AND / OR / nested)   │  │
  │  └───────────────────┬───────────────────┘  │
  │                      │                      │
  │        ┌─────────────┼─────────────┐        │
  │        ▼             ▼             ▼        │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
  │  │  Agent   │  │  Agent   │  │  Agent   │  │
  │  │  (AWS)   │  │ (Azure)  │  │  (GCP)   │  │
  │  │ per-agent│  │ per-agent│  │ per-agent│  │
  │  │ filters  │  │ filters  │  │ filters  │  │
  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
  └───────┼──────────────┼─────────────┼────────┘
          │              │             │
          ▼              ▼             ▼
       Activities (investigation or mitigation)
    ┌───────────┬───────────┬───────────┬──────────────────┐
    │  ongoing  │ completed │ timed out │ user input req'd │
    └───────────┴───────────┴───────────┴──────────────────┘
```
- **Agents** are connections to cloud AI services. Each agent has a type (AWS, Azure, or Google Cloud), an endpoint, a credential, and optional budget settings. Disable an agent to pause it without losing configuration.
- **Interaction Profiles** are routing rules that decide which problems go to which agents. Each profile has global filters, one or more agent assignments, and optional per-agent filters. Only enabled profiles are evaluated.
- **Filters** control dispatch. They can be combined with AND/OR logic and nested arbitrarily. See the complete filter reference below.
- **Activities** represent a single investigation or mitigation. Statuses: ongoing, completed, timed out, or user input required. When a problem has multiple activities they roll up to in progress, done, or stalled.

## Filters Reference

### AWS
| Filter	| Description | 
| --- | ---| 
| AWS Account ID	| Match by AWS account | 
| AWS Resource Type	| Match by resource type | 
| AWS Tag Key	| Resource has a tag with this key | 
| AWS Tag Value	| Tag key has a specific value | 
| Has AWS Resources	| Problem affects AWS resources (boolean) | 

### Azure
| Filter	| Description | 
| --- | --- | 
| Azure Subscription ID| 	Match by subscription | 
| Azure Resource Type	| Match by resource type | 
| Azure Tag Key	| Resource has a tag with this key | 
| Azure Tag Value	| Tag key has a specific value | 
| Has Azure Resources	| Problem affects Azure resources (boolean) | 

### Google Cloud
| Filter	| Description | 
| --- | --- | 
| GCP Project ID	| Match by project | 
| GCP Resource Type	| Match by resource type | 
| GCP Tag Key	| Resource has a tag with this key | 
| GCP Tag Value	| Tag key has a specific value | 
| GCP Label Key	| Resource has a label with this key | 
| GCP Label Value	| Label key has a specific value | 
| Has GCP Resources | Problem affects GCP resources (boolean) | 

### Problem
| Filter	| Description | 
| --- | --- | 
| Problem Category	| AVAILABILITY, ERROR, SLOWDOWN, RESOURCE_CONTENTION, MONITORING_UNAVAILABLE, CUSTOM_ALERT | 
| Problem Status	|  ACTIVE or CLOSED | 
| Entity Type	| Affected entity type (HOST, SERVICE, PROCESS_GROUP, etc.) | 
| Has Similar Problems	| Dynatrace identified similar historical problems (boolean) | 
| Problem Field	| Match any problem field with equals / not_equals / contains / not_contains — useful for event.name, k8s.cluster.name, affected_entity_ids, or custom attributes | 

## Budget
| Filter	| Description | 
| --- |  --- | 
| Has Available Budget	| Agent's monthly duration budget is not exceeded. With strict enforcement on, blocks dispatch; otherwise records a warning.
Filters can be combined with AND / OR logic and nested arbitrarily.

## Tabs
- **Overview** — Interactive network graph of problems, agents, profiles, and activities. Click to highlight, double-click to navigate.
- **Activity** — Timeline of all investigations and mitigations. Expand cards to see findings. Rate responses (Good / OK / Bad) to track quality.
- **Statistics** — Performance analytics: problems handled, agent time, success rates, satisfaction scores, and per-agent breakdowns. Agent working time drives cloud costs, so this is your primary cost lens.
- **Trigger Investigation** — Manually dispatch a problem to a specific agent or through profile-based routing. Use Test (Dry Run) to validate filters without invoking agents.
- **Configuration** — Create and manage agents and interaction profiles. Each row supports enable/disable, edit, permissions, and delete.
- **Setup** — Guided setup for IAM policy, group, service user, and workflows. Live status badges show what's configured and what's missing.

## Troubleshooting
- **No activities appearing?** Check that workflows are installed and enabled (Setup tab), the service user is correct, and at least one profile + agent is enabled. Use Trigger Investigation → Test (Dry Run) to validate filters.
- **Investigation timeouts?** Verify the agent credential is valid, the endpoint is on the outbound allowlist, and the cloud service is reachable. Enable Store Raw Messages for debugging.
- **Budget blocking dispatch?** Check the agent's Monthly Duration Budget in Configuration. The budget resets at UTC month start. Toggle strict enforcement off to let dispatch proceed with a warning.

## Cost Model
| DPS Surface	| Cost Driver | 
| --- | --- | 
| Events — Ingest & Process	| Dispatched problems and AWS raw events | 
| Events — Retain	| Tenant retention window | 
| Events — Query (DQL)	| Scheduler ticks, UI loads, in-action queries | 
| Automation Workflow	| Workflow execution duration | 
| AppEngine Functions	| One invocation per action execution | 

Details: [Dynatrace Rate Card](https://www.dynatrace.com/pricing/rate-card/)
