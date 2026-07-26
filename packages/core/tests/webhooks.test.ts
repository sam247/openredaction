import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  verifyWebhookSignature,
  type WebhookEvent,
  WebhookManager,
} from "../src/webhooks";

function okFetch() {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => "ok",
  }));
}

function register(manager: WebhookManager, overrides: object = {}) {
  manager.registerWebhook({
    id: "hook-1",
    url: "https://example.com/hook",
    ...overrides,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("WebhookManager registration", () => {
  it("registers with defaults and rejects duplicates", () => {
    const manager = new WebhookManager();
    register(manager);

    const hook = manager.getWebhook("hook-1");
    expect(hook?.enabled).toBe(true);
    expect(hook?.retry?.maxAttempts).toBe(3);
    expect(() => register(manager)).toThrow(/already registered/);
  });

  it("rejects invalid URLs", () => {
    const manager = new WebhookManager();

    expect(() =>
      manager.registerWebhook({ id: "bad", url: "not-a-url" }),
    ).toThrow(/Invalid webhook URL/);
  });

  it("updates and deletes webhooks", () => {
    const manager = new WebhookManager();
    register(manager);

    manager.updateWebhook("hook-1", { enabled: false });
    expect(manager.getWebhook("hook-1")?.enabled).toBe(false);

    manager.deleteWebhook("hook-1");
    expect(manager.getWebhook("hook-1")).toBeUndefined();
    expect(manager.getAllWebhooks()).toHaveLength(0);
  });
});

describe("WebhookManager delivery", () => {
  it("POSTs matching events with metadata headers", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    const manager = new WebhookManager();
    register(manager);

    await manager.emitEvent({
      type: "pii.detected.high_risk",
      severity: "high",
      data: { detectionCount: 2 },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      { headers: Record<string, string>; body: string },
    ];
    expect(url).toBe("https://example.com/hook");
    expect(init.headers["X-Event-Type"]).toBe("pii.detected.high_risk");
    expect(JSON.parse(init.body).data.detectionCount).toBe(2);
  });

  it("signs payloads when a secret is configured", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    const manager = new WebhookManager();
    register(manager, { secret: "hush" });

    await manager.emitEvent({
      type: "pii.detected.high_risk",
      severity: "high",
      data: {},
    });

    const [, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      { headers: Record<string, string>; body: string },
    ];
    const signature = init.headers["X-Webhook-Signature"];
    expect(signature).toBeDefined();
    expect(verifyWebhookSignature(init.body, signature, "hush")).toBe(true);
  });

  it("skips disabled webhooks and non-subscribed event types", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    const manager = new WebhookManager();
    register(manager, { id: "off", enabled: false });
    manager.registerWebhook({
      id: "other-events",
      url: "https://example.com/other",
      events: ["pii.processing.failed"],
    });

    await manager.emitEvent({
      type: "pii.detected.high_risk",
      severity: "high",
      data: {},
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("records failed deliveries in history and stats", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        statusText: "Server Error",
        text: async () => "boom",
      })),
    );

    const manager = new WebhookManager();
    register(manager, { retry: { maxAttempts: 1 } });

    await manager.emitEvent({
      type: "pii.detected.high_risk",
      severity: "high",
      data: {},
    });

    const history = manager.getDeliveryHistory("hook-1");
    expect(history.some((d) => d.status === "failed")).toBe(true);
  });
});

describe("verifyWebhookSignature", () => {
  const event: WebhookEvent = {
    id: "evt-1",
    timestamp: new Date().toISOString(),
    type: "pii.detected.high_risk",
    severity: "high",
    data: {},
  };
  const payload = JSON.stringify(event);
  const secret = "hush";
  const valid = createHmac("sha256", secret).update(payload).digest("hex");

  it("accepts a valid signature", () => {
    expect(verifyWebhookSignature(payload, valid, secret)).toBe(true);
  });

  it("rejects a wrong-secret signature", () => {
    const forged = createHmac("sha256", "other").update(payload).digest("hex");
    expect(verifyWebhookSignature(payload, forged, secret)).toBe(false);
  });

  it("rejects malformed signatures without throwing", () => {
    expect(verifyWebhookSignature(payload, "short", secret)).toBe(false);
  });
});
