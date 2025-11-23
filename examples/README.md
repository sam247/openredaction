# OpenRedact Examples

Practical examples demonstrating how to integrate OpenRedact into your applications.

## 📁 Examples

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
npm install express openredact
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
npm install react react-dom openredact
npm run dev
```

**Demonstrates:**
- Basic detection with manual control
- Real-time detection with debouncing
- Form field validation with PII blocking
- Batch processing with progress
- Auto-redaction with live preview

**Five React Hooks:**
- `useOpenRedact()` - Manual detection
- `usePIIDetector()` - Real-time detection
- `useFormFieldValidator()` - Form validation
- `useBatchDetector()` - Batch processing
- `useAutoRedact()` - Auto-redaction

## 🚀 Quick Start

Install OpenRedact:
```bash
npm install openredact
```

Basic usage:
```javascript
const { OpenRedact } = require('openredact');

const detector = new OpenRedact();
const result = detector.detect('Contact john@example.com');

console.log(result.redacted); // "Contact [EMAIL_1]"
console.log(result.detections); // [{ type: 'EMAIL', value: 'john@example.com', ... }]
```

## 📖 Documentation

- [Main README](../README.md)
- [API Documentation](../docs/API.md)
- [Integration Guide](../docs/INTEGRATION.md)

## 💡 Use Cases

These examples cover common use cases:

1. **Content Moderation**: Detect PII in user-generated content
2. **Compliance**: GDPR/HIPAA compliant data handling
3. **Form Validation**: Prevent PII in public comments
4. **Data Pipeline**: Batch processing for document scanning
5. **Debug/Audit**: Generate reports for compliance audits

## 🔒 Privacy First

All examples run **100% locally**:
- No external API calls
- No data leaves your application
- Zero network dependencies
- Works completely offline

## 📝 License

MIT - See [LICENSE](../LICENSE)
