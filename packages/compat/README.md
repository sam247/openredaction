# openredaction

Production-ready PII detection and redaction for JavaScript/TypeScript.
Detects emails, phones, names, and 570+ other patterns locally — regex-first,
privacy-first, MIT licensed.

```bash
npm install openredaction
```

```ts
import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction({ redactionMode: "placeholder" });
const { redacted } = await redactor.detect(
  "Contact Jane at jane@example.com",
);
// "Contact [NAME_XXXX] at [EMAIL_XXXX]"
```

This unscoped package re-exports `@openredaction/core` plus Express/React/server
integrations under the original `openredaction` import path. New projects that
only need detection can install `@openredaction/core` instead.

## Subpath imports

```ts
import { OpenRedaction, openredactionMiddleware } from "openredaction";
import { usePIIDetector } from "openredaction/react";
import { createAPIServer } from "openredaction/server";
```

## Migration to scoped packages

| Old import             | New package                                      |
| ---------------------- | ------------------------------------------------ |
| `openredaction`        | `@openredaction/core` (+ `@openredaction/express` if needed) |
| `openredaction/react`  | `@openredaction/react`                           |
| `openredaction/server` | `@openredaction/server`                          |

Optional peer deps (`react`, `pdf-parse`, `mammoth`, `tesseract.js`) only apply
when you use those integrations.

Docs: [openredaction.com](https://openredaction.com) ·
[Playground](https://openredaction.com/playground)

## License

MIT
