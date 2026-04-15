# OpenRedaction Examples

Practical examples showing how to use OpenRedaction in real applications.

These are usage patterns, not official SDKs or packages.
These examples show where OpenRedaction fits: before data leaves your application.

Use these patterns:
- before OpenAI calls
- before logging
- before sending data externally

## 📁 Examples

### Wrapper examples

#### OpenAI (`openai/`)
Redact message text before sending prompts to OpenAI.

#### Express (`express/`)
Redact request bodies before handlers log or forward them.

### 1. Basic Node.js (`nodejs-basic/`)
**Pure Node.js implementation** showing core detection features.

```bash
cd nodejs-basic
node example.js
```

**Demonstrates:**
- Simple PII detection
- Batch processing
- Streaming large documents
- HTML report generation
- Debug with explain() API

### 2. Express API (`express-api/`)
**RESTful API** with middleware and route handlers.

```bash
cd express-api
npm install express openredaction
node server.js
```

**Demonstrates:**
- Auto-redaction middleware
- Strict PII rejection
- Detection endpoints
- Report generation API
- Batch processing endpoint
- Custom analysis logic

**API Endpoints:**
- `POST /api/secure/submit` - Auto-redact PII
- `POST /api/strict/comment` - Reject if PII found
- `POST /api/detect` - Detect PII in text
- `POST /api/report` - Generate HTML/Markdown reports
- `POST /api/analyze` - Custom analysis
- `POST /api/batch` - Batch processing

### 3. React Form (`react-form/`)
**React application** with real-time PII detection hooks.

```bash
cd react-form
npm install react react-dom openredaction
npm run dev
```

**Demonstrates:**
- Basic detection with manual control
- Real-time detection with debouncing
- Form field validation with PII blocking
- Batch processing with progress
- Auto-redaction with live preview

**Five React Hooks:**
- `useOpenRedaction()` - Manual detection
- `usePIIDetector()` - Real-time detection
- `useFormFieldValidator()` - Form validation
- `useBatchDetector()` - Batch processing
- `useAutoRedact()` - Auto-redaction

## 🚀 Quick Start

```bash
npm install openredaction
```

```javascript
const { OpenRedaction } = require('openredaction');

async function main() {
  const detector = new OpenRedaction();
  const result = await detector.detect('Contact john@example.com');

  console.log(result.redacted);
  console.log(result.detections);
}

main();
```

## 📖 Documentation

- [Main README](../README.md) - Full documentation and API reference

## 💡 Use Cases

These examples cover common use cases:

1. **Content Moderation**: Detect PII in user-generated content
2. **Compliance**: GDPR/HIPAA compliant data handling
3. **Form Validation**: Prevent PII in public comments
4. **Data Pipeline**: Batch processing for document scanning
5. **Debug/Audit**: Generate reports for compliance audits

## 🔒 Privacy First

Examples run **locally** in your runtime:
- No vendor API is required for core detection
- No data leaves your application unless you add integrations
- Works offline for library-only usage

## 📝 License

MIT - See [LICENSE](../LICENSE)
