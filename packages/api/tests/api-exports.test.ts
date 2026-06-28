import { describe, it, expect } from "vitest";
import {
  APIServer,
  createAPIServer,
  PrometheusServer,
  createPrometheusServer,
} from "../src/index";

describe("@openredaction/api entry", () => {
  it("exports HTTP server constructors", () => {
    expect(typeof APIServer).toBe("function");
    expect(typeof createAPIServer).toBe("function");
    expect(typeof PrometheusServer).toBe("function");
    expect(typeof createPrometheusServer).toBe("function");
  });

  it("createAPIServer returns APIServer instance", () => {
    const s = createAPIServer({ port: 0 });
    expect(s).toBeInstanceOf(APIServer);
  });
});
