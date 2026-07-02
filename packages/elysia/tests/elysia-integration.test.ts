import { Elysia } from "elysia";
import { describe, expect, it } from "vitest";
import {
  detectPIIPlugin,
  generateReportPlugin,
  openredactionPlugin,
} from "../src/index";

describe("Elysia integration", () => {
  it("openredactionPlugin attaches PII info to context for configured string fields", async () => {
    const app = new Elysia()
      .use(
        openredactionPlugin({
          enableFalsePositiveFilter: false,
          fields: ["message"],
        }),
      )
      .post("/api", ({ pii }) => {
        return { detected: pii?.detected, count: pii?.count };
      });

    const res = await app.handle(
      new Request("http://localhost/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Email: lead@company.test" }),
      }),
    );

    const j = (await res.json()) as { detected: boolean; count: number };

    expect(j.detected).toBe(true);
    expect(j.count).toBeGreaterThan(0);
  });

  it("openredactionPlugin with failOnPII returns 400 when PII present", async () => {
    const app = new Elysia()
      .use(
        openredactionPlugin({
          failOnPII: true,
          enableFalsePositiveFilter: false,
          fields: ["body"],
        }),
      )
      .post("/strict", () => ({ ok: true }));

    const res = await app.handle(
      new Request("http://localhost/strict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: "SSN 123-45-6789" }),
      }),
    );

    expect(res.status).toBe(400);
    const j = (await res.json()) as { error: string };
    expect(j.error).toMatch(/PII/i);
  });

  it("detectPIIPlugin returns detection payload", async () => {
    const app = new Elysia().use(
      detectPIIPlugin({
        enableFalsePositiveFilter: false,
        patterns: ["EMAIL"],
      }),
    );

    const res = await app.handle(
      new Request("http://localhost/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "hello a@b.co" }),
      }),
    );

    expect(res.status).toBe(200);

    const j = (await res.json()) as {
      detected: boolean;
      detections: unknown[];
    };

    expect(j.detected).toBe(true);
    expect(Array.isArray(j.detections)).toBe(true);
  });

  it("autoRedact stores redacted body in context", async () => {
    const app = new Elysia()
      .use(
        openredactionPlugin({
          autoRedact: true,
          enableFalsePositiveFilter: false,
          fields: ["message"],
        }),
      )
      .post("/api", ({ redactedBody }) => {
        return { redacted: redactedBody };
      });

    const res = await app.handle(
      new Request("http://localhost/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Email: lead@company.test" }),
      }),
    );

    expect(res.status).toBe(200);

    const j = (await res.json()) as {
      redacted: { message: string } | null;
    };

    expect(j.redacted).toBeDefined();
    expect(j.redacted).not.toBeNull();
    expect(j.redacted?.message).not.toContain("lead@company.test");
  });

  it("generateReportPlugin returns HTML report", async () => {
    const app = new Elysia().use(
      generateReportPlugin({
        enableFalsePositiveFilter: false,
        patterns: ["EMAIL"],
      }),
    );

    const res = await app.handle(
      new Request("http://localhost/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "hello a@b.co",
          format: "html",
          title: "Test Report",
        }),
      }),
    );

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("<!DOCTYPE html>");
    expect(text).toContain("Test Report");
  });

  it("skipRoutes bypasses plugin for matching paths", async () => {
    const app = new Elysia()
      .use(
        openredactionPlugin({
          enableFalsePositiveFilter: false,
          fields: ["message"],
          skipRoutes: [/^\/skip/],
        }),
      )
      .post("/skip", ({ pii }) => {
        return { hasPii: pii !== null };
      });

    const res = await app.handle(
      new Request("http://localhost/skip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Email: lead@company.test" }),
      }),
    );

    expect(res.status).toBe(200);

    const j = (await res.json()) as { hasPii: boolean };

    expect(j.hasPii).toBe(false);
  });
});
