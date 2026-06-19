
# Azure DevOps Pipeline — Pull & Push SDLC Events Workflow

This README describes the Azure DevOps implementation of a Dynatrace Automation workflow that:

- Pulls completed Azure DevOps pipeline builds and timelines (stages/jobs/tasks)
- Transforms pipeline and stage data into Dynatrace SDLC events
- Pushes SDLC events to Dynatrace for pipeline observability.

---

## Overview

This workflow calls Azure DevOps REST APIs to fetch completed builds within a configurable lookback window and retrieves each build’s timeline to generate SDLC events. It:

1. Creates and ingests a **build-level SDLC task event**.
2. Retrieves the build **timeline** and ingests **stage/job/task SDLC events**.
3. Sends SDLC events to Dynatrace via the **OpenPipeline SDLC ingest API**.

---

## Prerequisites

- Dynatrace tenant with **Workflows** enabled.
- Dynatrace **Credential Vault** for storing secure tokens.
- Azure DevOps PAT with **Build (Read)** scope.
- Dynatrace API token with **`openpipeline.events_sdlc`** scope.

---

## Configuration

Update the workflow configuration values:

- `organization` — Azure DevOps organization
- `project` — Azure DevOps project
- `adoPatCredentialId` — Credential Vault ID (Azure DevOps PAT)
- `sdlcTokenCredentialId` — Credential Vault ID (Dynatrace SDLC ingest token)
- `lookbackMinutes` — Default: 60
- `pageSize` — Default: 200
- `batchSize` — Default: 50


---

## How it works

1. Calls Azure DevOps **Builds API** to get completed builds.
2. Maps each build into a **build-finished SDLC event**.
3. Calls Azure DevOps **Timeline API** to get stage/job/task records.
4. Converts timeline records into SDLC events.
5. Sends events in batches to Dynatrace SDLC ingest endpoint.

---

## Deployment Steps

1. Upload the [workflow template](./workflow%20template/leverage-ado-timeline-api-transform-to-sldc-events.workflow.json) to get started. 
2. Once executed, SDLC events will be populated with the ADO completed pipeline details.  
3. To fetch these SDLC events, you can leverage a DQL as below:

```
fetch events
| filter event.kind == "SDLC_EVENT"
| sort timestamp desc
| limit 1
```

---

## Example SDLC Payloads

### Build Event
```json
{
  "event.provider": "azure-devops",
  "event.type": "build",
  "event.status": "finished",
  "event.category": "task",
  "event.id": "ado:org:project:build:123",
  "start_time": 1770695745712000000,
  "end_time": 1770695900242000000,
  "cicd.pipeline.id": "42",
  "cicd.pipeline.run.id": "123",
  "task.id": "123",
  "task.name": "Azure DevOps build 20260210.1",
  "vcs.branch.name": "refs/heads/main",
  "vcs.commit.id": "abc123def456",
  "build.number": "20260210.1",
  "build.result": "succeeded",
  "build.webUrl": "https://dev.azure.com/org/project/_build/results?buildId=123"
}
```

### Task Event
```json
{
  "event.provider": "azure-devops",
  "event.type": "task",
  "event.status": "finished",
  "event.category": "task",
  "event.id": "ado:org:project:build:123:record:999",
  "start_time": 1770695745712000000,
  "end_time": 1770695800000000000,
  "task.id": "999",
  "task.name": "Run Tests",
  "task.type": "Task",
  "task.result": "failed",
  "task.state": "completed",
  "vcs.branch.name": "refs/heads/main",
  "vcs.commit.id": "abc123def456"
}
```

---
