/**
 * openredaction — backward-compatibility shim
 *
 * Re-exports everything from @openredaction/core and @openredaction/express
 * so existing `import { OpenRedaction, openredactionMiddleware } from "openredaction"`
 * continues to work.
 */

export * from "@openredaction/core";
export * from "@openredaction/express";
