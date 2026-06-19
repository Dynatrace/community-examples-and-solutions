# CI/CD Pipeline Observability Blueprint

This blueprint provides **end-to-end observability for your CI/CD pipelines** — from build and test execution to artifact promotion and deployment — built with Dynatrace Dashboards, Workflows, and OpenTelemetry integrations.

<!-- Add screenshots here -->

## 🎯 Purpose

CI/CD pipelines can feel like black boxes. This blueprint helps you answer the questions that matter most:

- **Where is my pipeline right now, and why is it slow or unstable?**
- **Which tests are flaky and delaying releases?**
- **How fast can artifacts reach production?**
- **Which phase is slowing down my delivery?**

By combining distributed tracing, metrics, and SDLC event ingestion, this blueprint gives teams real-time visibility across every stage of the software delivery lifecycle.

## 📦 What's Inside

This blueprint includes configurations for the following components:

| Component | Description |
|---|---|
| **Dashboards** | Pipeline task and failure details and artifact flow visualizations |
| **Workflows** | Automated retrieval of build and deployment metrics from CI/CD tool APIs (Jenkins, Azure DevOps, GitLab) |
| **OpenTelemetry Config** | Collector setup for streaming real-time metrics, traces, and logs from your pipelines into Dynatrace |
| **SDLC Event Ingestion** | Pipeline configurations to push build lifecycle events (start, success, failure) to Dynatrace via the SDLC Events API |
| **Documentation** | Setup guides and customization tips for each component |

## 📊 What You'll Get

Once deployed, this blueprint surfaces observability data across several key areas:

- **Pipeline status overview** – execution status and error-prone task identification across pipeline runs
- **Test execution breakdown** – per-test-case metrics to identify flaky tests by tracking failure rates and execution patterns
- **Span & log drill-down** – context-aware end-to-end visibility from the originating endpoint down to underlying logs and exception traces
- **Artifact flow timeline** – end-to-end time from commit to deployment, visualized as pipeline traces
- **Predictive anomaly alerts** – proactive notifications of potential delays before they impact your release cycle

## ⚙️ Getting Started

This blueprint supports three instrumentation approaches. Choose the one that fits your setup:

### Option 1: OpenTelemetry (recommended for full observability)

Instrument your CI/CD pipeline to stream real-time metrics, traces, and logs into Dynatrace via the Dynatrace Collector.

1. Deploy the **Dynatrace Collector** in your environment.
2. Instrument your pipeline using the provided OpenTelemetry configuration:
   - `otel-jenkins/` – for Jenkins pipelines
   - `otel-gitlab/` – for GitLab pipelines
   - `otel-github-actions/` – for GitHub Actions
3. Verify data is flowing into Dynatrace under **Distributed Traces**.
4. Import the included dashboard JSON files via the **Dashboards app**.

### Option 2: Dynatrace Workflows (no pipeline changes required)

Use Dynatrace Workflows to periodically pull build and deployment metrics from your CI/CD tool APIs — no instrumentation needed.

1. Import the relevant workflow JSON from the `workflows/` folder:
   - `workflow-jenkins.json`
   - `workflow-azure-devops.json`
   - `workflow-gitlab.json`
2. Configure your CI/CD API credentials in the workflow connection settings.
3. Import the matching dashboard JSON from the `dashboards/` folder.
4. Run the workflow manually once to verify data ingestion, then enable the schedule.

### Option 3: SDLC Event Ingestion

Configure your CI/CD tools to push lifecycle events (build start, success, failure) directly to Dynatrace via the **SDLC Events API** or via **OpenPipeline** from pipeline logs.

1. Follow the setup guide in `sdlc-events/README.md`.
2. Use the provided DQL queries to analyze event patterns and trigger alerts.
3. Import the included dashboard to visualize SDLC event timelines.

## 🔧 Customization Tips

- **Filter by pipeline or project** – adjust the dashboard variable filters to scope views to specific repositories, environments, or teams.
- **Adjust alerting thresholds** – the included metric events are pre-configured with default thresholds; tune these to match your SLA requirements.
- **Extend with additional tools** – the OpenTelemetry and workflow configurations can be adapted to other CI/CD platforms that expose APIs or support OTel instrumentation.

## 📚 Further Reading

- [Blog post: Unlocking CI/CD success with observability](https://www.dynatrace.com/news/blog/) *(link to published post)*
- [Dynatrace OpenPipeline documentation](https://docs.dynatrace.com/docs)
- [SDLC Events API reference](https://docs.dynatrace.com/docs)
- [Dynatrace Workflows documentation](https://docs.dynatrace.com/docs)
