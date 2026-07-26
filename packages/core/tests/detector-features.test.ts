import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger, OpenRedaction } from "../src/index";
import { LiteOpenRedaction } from "../src/lite";

describe("profile and feature resolution", () => {
  it("standard profile (default) enables learning and context rules only", () => {
    const d = new OpenRedaction();

    expect(d.getLearningStore()).toBeDefined();
    expect(d.getAuditLogger()).toBeUndefined();
    expect(d.getMetricsCollector()).toBeUndefined();
    expect(d.getRBACManager()).toBeUndefined();
    expect(d.getPriorityOptimizer()).toBeUndefined();
  });

  it("minimal profile disables all optional subsystems", () => {
    const d = new OpenRedaction({ profile: "minimal" });

    expect(d.getLearningStore()).toBeUndefined();
    expect(d.getAuditLogger()).toBeUndefined();
    expect(d.getMetricsCollector()).toBeUndefined();
    expect(d.getRBACManager()).toBeUndefined();
  });

  it("features override the profile baseline", () => {
    const d = new OpenRedaction({
      profile: "minimal",
      features: { learning: true, auditLog: true },
    });

    expect(d.getLearningStore()).toBeDefined();
    expect(d.getAuditLogger()).toBeDefined();
    expect(d.getMetricsCollector()).toBeUndefined();
  });

  it("providing a collaborator implies enabling its subsystem", () => {
    const logger = new InMemoryAuditLogger();
    const d = new OpenRedaction({ auditLogger: logger });

    expect(d.getAuditLogger()).toBe(logger);
  });

  it("role implies RBAC", () => {
    const d = new OpenRedaction({ role: "viewer" });

    expect(d.getRBACManager()).toBeDefined();
  });

  it("minimal profile still detects and restores", async () => {
    const d = new OpenRedaction({ profile: "minimal" });
    const result = await d.detect("reach me at sarah.connor@cyberdyne.io");

    expect(result.detections.length).toBeGreaterThan(0);
    expect(d.restore(result.redacted, result.redactionMap)).toBe(
      result.original,
    );
  });
});

describe("LiteOpenRedaction shared core", () => {
  it("detects and restores like the full detector", async () => {
    const lite = new LiteOpenRedaction();
    const result = await lite.detect("reach me at sarah.connor@cyberdyne.io");

    expect(result.detections.length).toBeGreaterThan(0);
    expect(lite.restore(result.redacted, result.redactionMap)).toBe(
      result.original,
    );
  });

  it("respects presets", () => {
    const lite = new LiteOpenRedaction({ preset: "gdpr" });

    expect(lite.getPatterns().length).toBeGreaterThan(0);
  });
});
