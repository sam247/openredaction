# @openredaction/react

React hooks for client-side PII detection. Runs entirely in the browser — no
server round-trip. React is a peer dependency (`>=18 || >=19`).

## Installation

```bash
npm install @openredaction/react @openredaction/core react
```

## Quick Start

```tsx
import { usePIIDetector } from "@openredaction/react";

function EmailInput() {
  const [text, setText] = useState("");
  const { hasPII, detections } = usePIIDetector(text, { debounce: 300 });

  return (
    <>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      {hasPII && <p>⚠️ {detections.length} PII items detected</p>}
    </>
  );
}
```

## Hooks

| Hook                    | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `useOpenRedaction`      | Manual detect — call `detect(text)` on demand               |
| `usePIIDetector`        | Debounced real-time detection on input text                 |
| `useFormFieldValidator` | Form field validation with PII checks and `getFieldProps()` |
| `useBatchDetector`      | Batch processing with progress tracking                     |
| `useAutoRedact`         | Auto-redact text with debounce, returns `redactedText`      |

## License

MIT
