/**
 * Node.js HTTP adapters: REST API server and Prometheus scrape endpoint.
 *
 * Import from `openredaction/server` instead of the main package entry so the
 * default bundle does not reference `node:http` (clearer security posture for
 * static analysis and supply-chain scanners).
 */

export type { APIRequest, APIResponse, APIServerConfig } from "./api";
export { APIServer, createAPIServer } from "./api";
export type { PrometheusServerOptions } from "./metrics/PrometheusServer";
export {
  createPrometheusServer,
  PrometheusServer,
} from "./metrics/PrometheusServer";
