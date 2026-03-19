/**
 * Node.js HTTP adapters: REST API server and Prometheus scrape endpoint.
 *
 * Import from `openredaction/server` instead of the main package entry so the
 * default bundle does not reference `node:http` (clearer security posture for
 * static analysis and supply-chain scanners).
 */

export { APIServer, createAPIServer } from './api';
export type { APIServerConfig, APIRequest, APIResponse } from './api';
export {
  PrometheusServer,
  createPrometheusServer
} from './metrics/PrometheusServer';
export type { PrometheusServerOptions } from './metrics/PrometheusServer';
