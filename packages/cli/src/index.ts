/**
 * @openredaction/cli — CLI entry points for OpenRedaction
 *
 * Programmatic usage:
 * ```ts
 * import { runCLI } from "@openredaction/cli";
 * ```
 *
 * Binary usage:
 * ```bash
 * openredaction detect "Email john@example.com"
 * openredaction-test-pattern validate "\\b\\d{3}-\\d{2}-\\d{4}\\b"
 * ```
 */

export {
  ConfigLoader,
  isUnsafePattern,
  OpenRedaction,
  validatePattern,
} from "@openredaction/core";
