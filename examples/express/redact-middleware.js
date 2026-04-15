// Example: Redact data before sending externally
// This is a usage pattern, not an official SDK
import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction();

async function redactText(input) {
  return (await redactor.detect(input)).redacted;
}

export function redactMiddleware() {
  return async (req, res, next) => {
    if (req.body) {
      try {
        req.body = JSON.parse(await redactText(JSON.stringify(req.body)));
      } catch {}
    }

    next();
  };
}
