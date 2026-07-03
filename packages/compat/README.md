# openredaction

Backward-compatibility package that re-exports `@openredaction/core`,
`@openredaction/express`, `@openredaction/react`, and `@openredaction/server`
under the original `openredaction` import path. Use this if you're migrating
from the monolithic package — new projects should install scoped packages
directly.

## Installation

```bash
npm install openredaction
```

## Usage

Everything works as before:

```ts
import { OpenRedaction, openredactionMiddleware } from "openredaction";
import { usePIIDetector } from "openredaction/react";
import { createAPIServer } from "openredaction/server";
```

## Migration to Scoped Packages

| Old import             | New package                                      |
| ---------------------- | ------------------------------------------------ |
| `openredaction`        | `@openredaction/core` + `@openredaction/express` |
| `openredaction/react`  | `@openredaction/react`                           |
| `openredaction/server` | `@openredaction/server`                          |

Optional peer deps (`react`, `pdf-parse`, `mammoth`, `tesseract.js`) only apply
when you use those integrations.

## License

MIT
