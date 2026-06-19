# Contributing

Dynatrace Community Examples & Solutions are contributed by **Dynatrace employees** who have built and proven these artifacts in real customer scenarios.

> ⚠️ Community Examples & Solutions are shared as-is and are not officially maintained or supported by Dynatrace.

## For Dynatrace employees

The full contribution process — how to submit, what's reviewed, and how publishing works — lives on the internal **Community Examples & Solutions** page (search "Community Examples & Solutions" on the internal SharePoint). Please start there; that's where submissions are handled.

## What we look for (quality bar)

Every solution, regardless of category, should be:

- **Clear customer value** — solves a concrete, real-world problem; the "why use this" is obvious in a sentence.
- **Reusable by design** — works in any tenant; no hard-coded environments, IDs, or org-specific assumptions.
- **Production-ready** — complete and robust; follows best practices; works as-is or with minimal adjustment.
- **Low adoption friction** — minimal dependencies, sensible defaults, few prerequisites — all stated upfront.
- **Self-service documentation** — a README that lets someone adopt it without asking the author.

Per category:

- 📊 **Dashboards, Notebooks & Launchpads** — meaningful layout and actionable insights, not walls of metrics.
- ✨ **Agentic** — clear intent and boundaries; destructive actions require explicit confirmation; tools/permissions documented.
- ⚙️ **Config as Code** — fully parameterized; clearly states what it creates or modifies.
- 🧩 **Apps** — follows the Strato design system and current patterns; requests only the permissions it needs; provides a support path.
- 🗺 **Blueprints** — lists every component and how they fit together, with a complete end-to-end setup path.

## Repository standards

All solutions follow the **[repository standards](./STANDARDS.md)** — folder placement, naming, required files, and README format. The fastest way to get it right is to copy the **[gold-standard example](./example-entry/dashboards/order-fulfillment-observability/)**.

## Reporting an issue

Found a problem with an example? Open a [GitHub issue](../../issues).

## Using these solutions

Community Examples & Solutions are free to use and adapt. They're provided as-is, without warranty, and are not officially supported by Dynatrace.
