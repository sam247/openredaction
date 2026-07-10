import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import {
  detectPII,
  generateReport,
  openredactionMiddleware,
  type PIIContextVariables,
} from "../src/index";

describe("Hono integration", () => {
  it("openredactionMiddleware attaches PII info to context for configured string fields", async () => {
    const app = new Hono<{ Variables: PIIContextVariables }>();

    app.use(
      openredactionMiddleware({
        enableFalsePositiveFilter: false,
        fields: ["message"],
      }),
    );

    app.post("/api", (c) => {
      const pii = c.get("pii");
      return c.json({ detected: pii?.detected, count: pii?.count });
    });

    const res = await app.request("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email: lead@company.test" }),
    });

    const j = (await res.json()) as { detected: boolean; count: number };

    expect(j.detected).toBe(true);
    expect(j.count).toBeGreaterThan(0);
  });

  it("openredactionMiddleware with failOnPII returns 400 when PII present", async () => {
    const app = new Hono();

    app.use(
      openredactionMiddleware({
        failOnPII: true,
        enableFalsePositiveFilter: false,
        fields: ["body"],
      }),
    );

    app.post("/strict", (c) => c.json({ ok: true }));

    const res = await app.request("/strict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "SSN 123-45-6789" }),
    });

    expect(res.status).toBe(400);
    const j = (await res.json()) as { error: string };
    expect(j.error).toMatch(/PII/i);
  });

  it("detectPII route handler returns detection payload", async () => {
    const app = new Hono();

    app.post(
      "/d",
      detectPII({ enableFalsePositiveFilter: false, patterns: ["EMAIL"] }),
    );

    const res = await app.request("/d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello a@b.co" }),
    });

    expect(res.status).toBe(200);

    const j = (await res.json()) as {
      detected: boolean;
      detections: unknown[];
    };

    expect(j.detected).toBe(true);
    expect(Array.isArray(j.detections)).toBe(true);
  });

  it("autoRedact stores redacted body in context", async () => {
    const app = new Hono<{ Variables: PIIContextVariables }>();

    app.use(
      openredactionMiddleware({
        autoRedact: true,
        enableFalsePositiveFilter: false,
        fields: ["message"],
      }),
    );

    app.post("/api", (c) => {
      const redacted = c.get("redactedBody");
      return c.json({ redacted });
    });

    const res = await app.request("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email: lead@company.test" }),
    });

    expect(res.status).toBe(200);

    const j = (await res.json()) as {
      redacted: { message: string };
    };

    expect(j.redacted).toBeDefined();
    expect(j.redacted.message).not.toContain("lead@company.test");
  });

  it("generateReport route handler returns HTML report", async () => {
    const app = new Hono();

    app.post(
      "/report",
      generateReport({ enableFalsePositiveFilter: false, patterns: ["EMAIL"] }),
    );

    const res = await app.request("/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "hello a@b.co",
        format: "html",
        title: "Test Report",
      }),
    });

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("<!DOCTYPE html>");
    expect(text).toContain("Test Report");
  });

  it("skipRoutes bypasses middleware for matching paths", async () => {
    const app = new Hono<{ Variables: PIIContextVariables }>();

    app.use(
      openredactionMiddleware({
        enableFalsePositiveFilter: false,
        fields: ["message"],
        skipRoutes: [/^\/skip/],
      }),
    );

    app.post("/skip", (c) => {
      const pii = c.get("pii");
      return c.json({ hasPii: pii !== undefined });
    });

    const res = await app.request("/skip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email: lead@company.test" }),
    });

    expect(res.status).toBe(200);

    const j = (await res.json()) as { hasPii: boolean };

    expect(j.hasPii).toBe(false);
  });
});
