# ⚙️ Configuration as Code

Monaco and Terraform examples for automating Dynatrace configuration management — covering pipeline observability (GitHub, GitLab, Azure DevOps, ArgoCD), SLOs, Site Reliability Guardian, access control / IAM, auto-tagging, Grail buckets, dashboards, and more.

Each sample is in its own subfolder. Browse the folders above; most work with **Monaco**, and many also have a **Terraform** variant (suffixed `_terraform`).

> These samples were migrated here from the former `dynatrace-configuration-as-code-samples` repository and are maintained as part of Community Examples & Solutions.

## What good looks like

- **Fully parameterized** — variables/placeholders for anything environment-specific.
- **Clear blast radius** — state exactly what the config creates or modifies, plus any merge considerations.

## Contributing

Follow the [repository standards](../STANDARDS.md) and the [quality bar](../CONTRIBUTING.md). **Dynatrace employees:** see the internal Community Examples & Solutions page for how to submit.
