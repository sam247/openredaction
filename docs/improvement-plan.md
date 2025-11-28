# OpenRedaction Adoption Plan

This plan turns the high-level improvement ideas into concrete, shippable work so the library is useful across industries while
remaining a lightweight NPM package. All artifacts below are intentionally small and kept in docs/examples, not bundled with the
published package.

## Guardrails and Constraints
- Keep the published package lean: no binary dependencies, no images, and target <500KB compressed publish size.
- Operational aids (dashboards, manifests) live in `docs/` or `examples/` and stay optional; they must not be required for core usage.
- Prefer code samples over generated assets; when Docker snippets are provided, use slim base images and keep them outside the NPM artifact.
- CI adds a package-size check and dependency audit to block regressions.

## Objectives
- Make privacy presets and detectors easy to adopt for industry-specific workloads.
- Provide opinionated, ready-to-run examples that reduce time-to-value.
- Strengthen operational guidance for production deployments without bloating the package size.
- Document contribution and extension paths for new locales and detectors.

## Workstreams and Deliverables

### 1) Industry starter packs
- Package compliance and domain presets (GDPR, HIPAA, CCPA, finance, education, transport) as ready-to-run recipes stored under `examples/presets/`.
- Include sample payloads, before/after redaction transcripts, and data-quality assertions for each pack.
- Add quickstart scripts that show how to switch presets and how to mix custom patterns; scripts must be runnable with `npm run` aliases and zero extra installs.

### 2) Use-case playbooks
- Author short guides for common scenarios: log scrubbing, LLM guardrails, analytics ETL, and customer-support transcripts.
- For each guide: code snippets, performance tips (streaming vs. batch), and recommended redaction modes per format (text, JSON, CSV/XLSX).
- Cross-link playbooks from README and package docs for discoverability.

### 3) Locale and pattern expansion guide
- Publish a catalog of supported locales and detectors (countries, industries, identifier types) sourced from the existing configuration.
- Ship a "missing pattern" contribution template covering regex/NLP hybrids, validation steps, naming, priority, and tests.
- Document how to add new country/industry detectors with examples and test harness instructions; confirm the examples compile via `npm test`.

### 4) Plugin and override ergonomics
- Provide a cookbook for custom detectors and whitelists, including deterministic placeholder patterns and priority tuning.
- Show examples for sensitive-but-not-PII tokens (finance, healthcare, IoT) and how to layer them on presets.
- Demonstrate override/escape hatches so teams can opt-out without forking presets.

### 5) Operational hardening (lightweight artifacts only)
- Provide minimal deploy snippets (single-service Dockerfile and Compose example kept in `docs/ops/`) that exercise audit logging, metrics hooks, RBAC, webhooks, and health checks. Keep images small and optional so the NPM package stays slim.
- Add Grafana/Prometheus dashboard JSON and sample alerts as downloadable assets rather than baked into the package; include guidance on tuning alert noise and incident triage.
- Write a runbook for production readiness and post-incident review steps, emphasizing how to integrate with existing tooling instead of shipping heavy infrastructure.

### 6) Performance and scaling baselines
- Benchmark streaming vs. batch paths using in-repo fixtures; document throughput/latency trade-offs and cache/context-analysis tuning knobs.
- Publish recommended defaults for high-throughput pipelines and guidance on profiling hotspots.
- Automate lightweight benchmarks in CI where feasible and publish results in docs; cap benchmark fixtures to stay under the package size budget.

### 7) Interoperability samples
- Add integrations for common stacks: OpenTelemetry log processors, Airflow/DBT macros, Kafka/Fluent Bit filters.
- Provide drop-in examples that fit observability/data pipelines without refactoring existing code; keep dependencies dev-only and stored in `examples/`.
- Include configuration snippets for both ingestion and egress redaction paths.

### 8) Restoration and audit safety nets
- Document safe use of deterministic placeholders and when restoration is permissible.
- Add vault-backed key management examples to prevent accidental de-redaction in untrusted contexts.
- Publish a sample policy for restoration governance and audit logging.

## Phasing
1. **Docs-first (weeks 1–2):** starter packs, playbooks, contribution templates, and override cookbook.
2. **Operational assets (weeks 2–4):** lightweight deploy snippets, dashboards, and runbooks.
3. **Performance + interoperability (weeks 3–5):** benchmarks, tuning guidance, and pipeline integrations.
4. **Safety + governance (weeks 4–6):** restoration policies, key management examples, and audit guidance.

## Success Measures
- Time-to-first-redaction under 10 minutes using a starter pack.
- Coverage: at least 4 industry playbooks and 3 interoperability examples shipped.
- Benchmarks published with clear tuning recommendations.
- Contribution template adopted (new detectors merged using the guide).
- Package footprint remains small (no large binaries or images added to the NPM publish step); CI package-size check passes.
