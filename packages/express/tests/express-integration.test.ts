import { afterEach, describe, expect, it } from "bun:test";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import express from "express";
import { detectPII, openredactionMiddleware } from "../src/index";

function listen(
  app: express.Express,
): Promise<{ server: Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const addr = server.address() as AddressInfo;
      resolve({ server, port: addr.port });
    });
    server.on("error", reject);
  });
}

describe("Express integration", () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise<void>((res, rej) => {
        server!.close((err) => (err ? rej(err) : res()));
      });
      server = undefined;
    }
  });

  it("openredactionMiddleware attaches PII info for configured string fields", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      openredactionMiddleware({
        enableFalsePositiveFilter: false,
        fields: ["message"],
      }),
    );
    app.post("/api", (req, res) => {
      res.json({ detected: req.pii?.detected, count: req.pii?.count });
    });
    const { server: s, port } = await listen(app);
    server = s;
    const r = await fetch(`http://127.0.0.1:${port}/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email: lead@company.test" }),
    });
    const j = await r.json();
    expect(j.detected).toBe(true);
    expect(j.count).toBeGreaterThan(0);
  });

  it("openredactionMiddleware with failOnPII returns 400 when PII present", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      openredactionMiddleware({
        failOnPII: true,
        enableFalsePositiveFilter: false,
        fields: ["body"],
      }),
    );
    app.post("/strict", (_req, res) => res.json({ ok: true }));
    const { server: s, port } = await listen(app);
    server = s;
    const r = await fetch(`http://127.0.0.1:${port}/strict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "SSN 123-45-6789" }),
    });
    expect(r.status).toBe(400);
    const j = await r.json();
    expect(j.error).toMatch(/PII/i);
  });

  it("detectPII route handler returns detection payload", async () => {
    const app = express();
    app.use(express.json());
    app.post(
      "/d",
      detectPII({ enableFalsePositiveFilter: false, patterns: ["EMAIL"] }),
    );
    const { server: s, port } = await listen(app);
    server = s;
    const r = await fetch(`http://127.0.0.1:${port}/d`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello a@b.co" }),
    });
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.detected).toBe(true);
    expect(Array.isArray(j.detections)).toBe(true);
  });
});
