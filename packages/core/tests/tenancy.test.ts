import { describe, expect, it } from "vitest";
import {
  DEFAULT_TIER_QUOTAS,
  TenantManager,
  TenantNotFoundError,
  TenantQuotaExceededError,
  TenantSuspendedError,
} from "../src/tenancy";

function registerAcme(
  manager: TenantManager,
  overrides: Record<string, unknown> = {},
) {
  return manager.registerTenant({
    tenantId: "acme",
    name: "Acme Corp",
    status: "active",
    ...overrides,
  });
}

describe("TenantManager lifecycle", () => {
  it("registers a tenant and stamps timestamps", () => {
    const manager = new TenantManager();
    const config = registerAcme(manager);

    expect(config.createdAt).toBeInstanceOf(Date);
    expect(manager.getTenantConfig("acme").name).toBe("Acme Corp");
  });

  it("rejects duplicate tenant ids", () => {
    const manager = new TenantManager();
    registerAcme(manager);

    expect(() => registerAcme(manager)).toThrow(/already exists/);
  });

  it("throws TenantNotFoundError for unknown tenants", () => {
    const manager = new TenantManager();

    expect(() => manager.getTenantConfig("ghost")).toThrow(TenantNotFoundError);
  });

  it("suspend blocks detection, activate restores it", async () => {
    const manager = new TenantManager();
    registerAcme(manager);

    manager.suspendTenant("acme");
    await expect(manager.detect("acme", "a@b.co")).rejects.toThrow(
      TenantSuspendedError,
    );

    manager.activateTenant("acme");
    const result = await manager.detect("acme", "mail sarah@cyberdyne.io");
    expect(result.detections.length).toBeGreaterThan(0);
  });

  it("deletes tenants and lists by status", () => {
    const manager = new TenantManager();
    registerAcme(manager);
    manager.registerTenant({
      tenantId: "trial-co",
      name: "Trial Co",
      status: "trial",
    });

    expect(manager.getAllTenants()).toHaveLength(2);
    expect(manager.getTenantsByStatus("trial")).toHaveLength(1);

    manager.deleteTenant("acme");
    expect(() => manager.getTenantConfig("acme")).toThrow(TenantNotFoundError);
  });

  it("authenticates by API key", () => {
    const manager = new TenantManager();
    registerAcme(manager, { apiKey: "sk-acme-123" });

    expect(manager.authenticateByApiKey("sk-acme-123")?.tenantId).toBe("acme");
    expect(manager.authenticateByApiKey("nope")).toBeNull();
  });
});

describe("TenantManager quotas", () => {
  it("enforces maxTextLength", async () => {
    const manager = new TenantManager();
    registerAcme(manager, { quotas: { maxTextLength: 10 } });

    await expect(
      manager.detect("acme", "definitely more than ten characters"),
    ).rejects.toThrow(TenantQuotaExceededError);
  });

  it("enforces maxRequestsPerMonth", async () => {
    const manager = new TenantManager();
    registerAcme(manager, { quotas: { maxRequestsPerMonth: 2 } });

    await manager.detect("acme", "one");
    await manager.detect("acme", "two");
    await expect(manager.detect("acme", "three")).rejects.toThrow(
      TenantQuotaExceededError,
    );
  });

  it("enforces per-minute rate limits", async () => {
    const manager = new TenantManager();
    registerAcme(manager, { quotas: { rateLimit: 1 } });

    await manager.detect("acme", "one");
    await expect(manager.detect("acme", "two")).rejects.toThrow(
      TenantQuotaExceededError,
    );
  });

  it("tracks usage across requests", async () => {
    const manager = new TenantManager();
    registerAcme(manager);

    await manager.detect("acme", "mail sarah@cyberdyne.io");
    const usage = manager.getTenantUsage("acme");

    expect(usage.requestsThisMonth).toBe(1);
    expect(usage.textProcessedThisMonth).toBeGreaterThan(0);
    expect(usage.piiDetectedThisMonth).toBeGreaterThan(0);
  });

  it("ships tiered default quotas", () => {
    expect(DEFAULT_TIER_QUOTAS.free.maxRequestsPerMonth).toBeGreaterThan(0);
    expect(DEFAULT_TIER_QUOTAS.enterprise).toBeDefined();
  });
});

describe("TenantManager detectors and config", () => {
  it("caches one detector per tenant", () => {
    const manager = new TenantManager();
    registerAcme(manager);

    expect(manager.getDetector("acme")).toBe(manager.getDetector("acme"));
  });

  it("round-trips tenant config through export/import", () => {
    const manager = new TenantManager();
    registerAcme(manager, { metadata: { plan: "gold" } });

    const json = manager.exportTenantConfig("acme");
    const fresh = new TenantManager();
    const imported = fresh.importTenantConfig(json);

    expect(imported.tenantId).toBe("acme");
    expect(fresh.getTenantConfig("acme").metadata).toEqual({ plan: "gold" });
  });
});
