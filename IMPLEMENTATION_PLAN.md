# OpenRedaction Implementation Plan
## Goal: Become the Best PII Redaction Source in the World

**Date:** 2025-11-25
**Current State:** 558+ patterns, 50+ countries, regex-based detection, basic RBAC/audit

---

## Executive Summary

After analyzing the codebase and independent assessment, OpenRedaction has **exceptional pattern coverage** but critical gaps in:
1. **Structured data formats** (JSON, CSV, XLSX) - High impact, moderate effort
2. **Enterprise features** (persistent audit, metrics export, multi-tenancy) - Critical for SaaS adoption
3. **Semantic detection** (context-aware, ML-based) - Differentiator vs regex-only competitors
4. **Production deployment** (containerization, cloud integrations, monitoring)

This plan prioritizes features that maximize impact on the goal while leveraging existing strengths.

---

## Phase 1: Critical Format Support (Weeks 1-3)
**Goal:** Cover the 80% use case - structured data redaction

### ✅ I STRONGLY AGREE - Highest ROI
These are absolutely critical for real-world SaaS usage. Most PII leaks happen in logs, exports, and API responses.

### 1.1 JSON Processor (Week 1)
**Priority:** 🔴 CRITICAL
**Effort:** Medium (3-4 days)
**Impact:** High - logs, API responses, exports

**Implementation:**
- [ ] Create `packages/core/src/document/processors/JsonProcessor.ts`
- [ ] Support nested object traversal
- [ ] Detect PII in both keys and values
- [ ] Handle arrays of objects
- [ ] Preserve JSON structure in redaction output
- [ ] Add path tracking (e.g., `user.profile.email`)
- [ ] Support JSON Lines (.jsonl) format

**Example Output:**
```json
{
  "user": {
    "email": "[EMAIL_REDACTED]",
    "ssn": "[SSN_REDACTED]",
    "address": "[ADDRESS_REDACTED]"
  },
  "_redaction_metadata": {
    "paths_redacted": ["user.email", "user.ssn", "user.address"],
    "pii_count": 3
  }
}
```

### 1.2 CSV Processor (Week 1)
**Priority:** 🔴 CRITICAL
**Effort:** Medium (2-3 days)
**Impact:** High - data exports, spreadsheets

**Implementation:**
- [ ] Create `packages/core/src/document/processors/CsvProcessor.ts`
- [ ] Support header detection
- [ ] Column-level PII detection
- [ ] Bulk row processing
- [ ] Handle quoted fields, escaped characters
- [ ] Preserve CSV structure
- [ ] Support delimiter detection (comma, tab, semicolon)

**Features:**
- Column-level statistics (% PII per column)
- Smart column detection ("email" column = EMAIL pattern)
- Configurable header row

### 1.3 XLSX Processor (Week 2-3)
**Priority:** 🟡 HIGH
**Effort:** High (5-6 days)
**Impact:** High - business reports, exports

**Implementation:**
- [ ] Create `packages/core/src/document/processors/XlsxProcessor.ts`
- [ ] Use `xlsx` or `exceljs` library (peer dependency)
- [ ] Multi-sheet support
- [ ] Cell-level redaction with coordinate tracking
- [ ] Formula preservation (don't break calculations)
- [ ] Style preservation (colors, formatting)
- [ ] Named range support

### 1.4 Unified Structured Data API (Week 3)
**Priority:** 🟡 HIGH
**Effort:** Low (1-2 days)

**Implementation:**
- [ ] Create `packages/core/src/structured/StructuredDataDetector.ts`
- [ ] Unified interface for JSON/CSV/XLSX
- [ ] Path-based redaction (e.g., redact `users.*.email`)
- [ ] Column/field-level allow/denylists
- [ ] Batch processing for large datasets

**Example:**
```typescript
const detector = new StructuredDataDetector({
  format: 'json',
  fieldRules: {
    allow: ['id', 'created_at'],
    deny: ['password_hash'] // Always redact
  }
});
```

---

## Phase 2: Semantic & Contextual Detection (Weeks 4-8)
**Goal:** Beat regex-only competitors with context-aware detection

### ✅ I STRONGLY AGREE - Key Differentiator
This is what will separate OpenRedaction from basic regex libraries. The analysis correctly identifies this gap.

### 2.1 Lightweight NER Integration (Weeks 4-5)
**Priority:** 🟡 HIGH
**Effort:** High (8-10 days)
**Impact:** High - reduces false positives, catches contextual PII

**Implementation:**
- [ ] Create `packages/core/src/ml/NERDetector.ts`
- [ ] Integrate `compromise` (7KB) for English NER
- [ ] Detect PERSON, ORG, PLACE entities
- [ ] Combine with regex patterns (hybrid approach)
- [ ] Add confidence boosting (regex + NER = higher confidence)
- [ ] Make it optional (zero-dependency mode still available)

**Strategy:**
```typescript
// Hybrid detection: Regex + NER
if (regexMatch && nerMatch && overlaps) {
  confidence = Math.min(1.0, regexConfidence * 1.3); // Boost confidence
}
```

### 2.2 Contextual Rules Engine (Week 6)
**Priority:** 🟡 HIGH
**Effort:** Medium (4-5 days)
**Impact:** Medium-High

**Implementation:**
- [ ] Create `packages/core/src/context/ContextRules.ts`
- [ ] Define contextual patterns:
  - "account number is X" → boost ACCOUNT_NUMBER confidence
  - "email me at X" → boost EMAIL confidence
  - "SSN: X" → boost SSN confidence
- [ ] Proximity detection (keyword within N words)
- [ ] Sentence-level context analysis
- [ ] Domain-specific vocabularies (medical, legal, financial)

**Example Rules:**
```typescript
{
  pattern: 'ACCOUNT_NUMBER',
  boostKeywords: ['account', 'acct', 'number', 'ref'],
  proximityWindow: 10, // words
  confidenceBoost: 0.2
}
```

### 2.3 False Positive Reduction (Week 7)
**Priority:** 🟢 MEDIUM
**Effort:** Medium (4-5 days)

**Implementation:**
- [ ] Enhance `packages/core/src/validation/FalsePositiveFilter.ts`
- [ ] Common false positive patterns:
  - Test data markers ("example", "test", "sample")
  - Sequential patterns (123-45-6789 vs random SSN)
  - Dictionary words that match patterns
- [ ] Configurable sensitivity (strict, balanced, permissive)
- [ ] Learning mode (track user corrections)

### 2.4 Severity & Confidence Scoring (Week 8)
**Priority:** 🟢 MEDIUM
**Effort:** Low (2-3 days)

**Implementation:**
- [ ] Add `severity` field to all patterns (LOW, MEDIUM, HIGH, CRITICAL)
- [ ] Severity levels:
  - **CRITICAL:** SSN, Credit Card, Passport, Medical Records
  - **HIGH:** Email, Phone, Address, Bank Account
  - **MEDIUM:** Name, Date of Birth, Employee ID
  - **LOW:** Postal Code, Generic IDs
- [ ] Risk score calculation: `risk = piiCount × avgSeverity × avgConfidence`
- [ ] Threshold-based alerts (e.g., risk > 0.8 = escalate)

---

## Phase 3: Enterprise-Grade Features (Weeks 9-14)
**Goal:** Production-ready for SaaS deployments (Disclosurely, etc.)

### ✅ I STRONGLY AGREE - Essential for Your Use Cases
For whistleblowing apps and multi-tenant SaaS, these are non-negotiable.

### 3.1 Persistent Audit Logging (Week 9)
**Priority:** 🔴 CRITICAL
**Effort:** Medium (4-5 days)
**Impact:** High - compliance requirement

**Current State:** In-memory only (max 10,000 entries)
**Gap:** No database persistence, no tamper-proofing

**Implementation:**
- [ ] Create `packages/core/src/audit/PersistentAuditLogger.ts`
- [ ] Support multiple backends:
  - SQLite (local dev)
  - PostgreSQL (production)
  - MongoDB (document store)
  - S3 (append-only logs)
- [ ] Cryptographic hashing (SHA-256) for tamper detection
- [ ] Immutable append-only logs
- [ ] Retention policies (auto-delete after N days)
- [ ] Query API (date range, user, operation type)

**Schema:**
```typescript
interface AuditLog {
  id: string; // UUID
  timestamp: Date;
  operation: 'detect' | 'redact' | 'batch' | 'stream';
  user: string;
  tenantId?: string; // For multi-tenancy
  piiCount: number;
  piiTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  textLength: number;
  processingTime: number;
  sessionId?: string;
  metadata?: Record<string, any>;
  hash: string; // SHA-256 of record + previous hash (blockchain-like)
}
```

### 3.2 Multi-Tenancy Support (Weeks 10-11)
**Priority:** 🔴 CRITICAL
**Effort:** High (8-10 days)
**Impact:** High - required for SaaS

**Implementation:**
- [ ] Create `packages/core/src/tenant/TenantManager.ts`
- [ ] Tenant-isolated configurations:
  - Custom patterns
  - Whitelists
  - Detection settings
  - Audit logs
  - Metrics
- [ ] Tenant quotas (max operations/day, max file size)
- [ ] Tenant-level RBAC
- [ ] Tenant API keys
- [ ] Usage tracking per tenant

**API:**
```typescript
const redactor = new OpenRedaction({
  tenantId: 'whistleblower-corp',
  tenantConfig: {
    customPatterns: [...],
    whitelist: [...],
    maxDailyOperations: 10000
  }
});
```

### 3.3 Metrics Export (Week 11)
**Priority:** 🟡 HIGH
**Effort:** Low (2-3 days)

**Implementation:**
- [ ] Create `packages/core/src/metrics/PrometheusExporter.ts`
- [ ] Prometheus-compatible metrics endpoint
- [ ] Key metrics:
  - `openredaction_detections_total` (counter)
  - `openredaction_processing_duration_seconds` (histogram)
  - `openredaction_pii_types_detected` (counter by type)
  - `openredaction_false_positives_total` (counter)
  - `openredaction_api_requests_total` (counter)
- [ ] Grafana dashboard template

### 3.4 Webhook & Alert System (Week 12)
**Priority:** 🟢 MEDIUM
**Effort:** Medium (4-5 days)

**Implementation:**
- [ ] Create `packages/core/src/webhooks/WebhookManager.ts`
- [ ] Event types:
  - `pii.detected.high_risk` (risk score > threshold)
  - `pii.detected.bulk` (>N PII items in one doc)
  - `pii.processing.failed`
  - `tenant.quota.exceeded`
- [ ] Retry logic with exponential backoff
- [ ] Webhook signature verification (HMAC-SHA256)
- [ ] Circuit breaker (disable after N failures)

### 3.5 REST API Service (Weeks 13-14)
**Priority:** 🟡 HIGH
**Effort:** High (10-12 days)

**Implementation:**
- [ ] Create `packages/api/` (new package)
- [ ] Express.js or Fastify server
- [ ] OpenAPI/Swagger documentation
- [ ] Endpoints:
  - `POST /api/v1/detect` - Detect PII
  - `POST /api/v1/redact` - Redact PII
  - `POST /api/v1/documents` - Upload document
  - `GET /api/v1/audit` - Query audit logs
  - `GET /api/v1/metrics` - Get metrics
  - `POST /api/v1/patterns` - Manage custom patterns
- [ ] Authentication (API key, JWT)
- [ ] Rate limiting (per tenant)
- [ ] Request validation (Zod or Joi)
- [ ] CORS support
- [ ] Docker image + docker-compose

---

## Phase 4: Document & Layout Enhancements (Weeks 15-18)
**Goal:** Professional-grade document redaction

### ✅ I PARTIALLY AGREE - Important but Lower Priority
These are nice-to-have for document-heavy use cases, but less critical than structured data.

### 4.1 PDF Layout-Preserving Redaction (Weeks 15-16)
**Priority:** 🟢 MEDIUM
**Effort:** High (10-12 days)
**Impact:** Medium

**Current State:** Text extraction only
**Gap:** No coordinate-based redaction

**Implementation:**
- [ ] Use `pdf-lib` for PDF manipulation
- [ ] Extract text with coordinates (x, y, width, height)
- [ ] Draw black rectangles over PII regions
- [ ] Preserve fonts, images, layout
- [ ] Multi-column support
- [ ] Form field redaction

### 4.2 Additional Document Formats (Week 17)
**Priority:** 🟢 MEDIUM
**Effort:** Medium (5-6 days)

**Implementation:**
- [ ] PowerPoint (PPTX) - via `pptxgenjs` or `officegen`
- [ ] Email (EML/MSG) - via `mailparser`
- [ ] Markdown (MD) - native support
- [ ] HTML - via `cheerio`
- [ ] RTF - via `rtf-parser`

### 4.3 Archive Support (Week 18)
**Priority:** 🟢 MEDIUM
**Effort:** Medium (4-5 days)

**Implementation:**
- [ ] ZIP file processing - via `adm-zip`
- [ ] TAR/GZ - via `tar-stream`
- [ ] Recursive scanning
- [ ] Aggregate reporting across files

---

## Phase 5: Advanced Features (Weeks 19-24)
**Goal:** Industry-leading capabilities

### 🤔 I PARTIALLY AGREE - Future Enhancements
These are valuable but can be deferred until core features are solid.

### 5.1 Pattern Pack System (Weeks 19-20)
**Priority:** 🟢 MEDIUM
**Effort:** Medium (6-8 days)

**Implementation:**
- [ ] Modular pattern packs (finance, healthcare, legal, etc.)
- [ ] Pattern versioning (semver)
- [ ] Pattern marketplace (community contributions)
- [ ] Pattern conflict resolution
- [ ] Pattern update mechanism

**From Analysis - Pattern Packs to Add:**
- ✅ Financial: IBAN, SWIFT, credit cards (mostly covered)
- ✅ Healthcare: NHS, Medicare, NPI (mostly covered)
- ⚠️ **Missing:** Legal case IDs, docket numbers, tribunal refs
- ⚠️ **Missing:** E-commerce order IDs (Shopify, WooCommerce)
- ⚠️ **Missing:** Tracking numbers (Royal Mail, DHL, UPS)
- ⚠️ **Missing:** More API key formats (Stripe, OpenAI, Firebase)

### 5.2 Streaming & Real-Time (Week 21)
**Priority:** 🟢 MEDIUM
**Effort:** High (7-8 days)

**Implementation:**
- [ ] WebSocket support for live redaction
- [ ] Kafka/Redis Streams integration
- [ ] Server-Sent Events (SSE) for progress
- [ ] Real-time collaboration hooks

### 5.3 Cloud Integrations (Weeks 22-23)
**Priority:** 🟢 MEDIUM
**Effort:** High (10-12 days)

**Implementation:**
- [ ] AWS Lambda function template
- [ ] AWS S3 event triggers
- [ ] Azure Functions template
- [ ] Azure Blob Storage triggers
- [ ] GCP Cloud Functions template
- [ ] GCP Cloud Storage triggers
- [ ] Terraform/CloudFormation templates

### 5.4 ML/AI Enhancement (Week 24+)
**Priority:** 🟡 FUTURE
**Effort:** Very High (20+ days)

**Implementation:**
- [ ] Transformer-based detection (BERT/DistilBERT)
- [ ] Active learning system
- [ ] Custom model fine-tuning API
- [ ] Ensemble methods (regex + NER + ML)
- [ ] Transfer learning from corrections

**Note:** This requires significant ML expertise and compute. Consider as long-term goal.

---

## Prioritization Matrix

| Feature | Impact | Effort | Priority | Phase |
|---------|--------|--------|----------|-------|
| JSON/CSV Support | 🔴 Critical | Medium | P0 | 1 |
| Semantic Detection | 🔴 Critical | High | P0 | 2 |
| Persistent Audit | 🔴 Critical | Medium | P0 | 3 |
| Multi-Tenancy | 🔴 Critical | High | P0 | 3 |
| XLSX Support | 🟡 High | High | P1 | 1 |
| REST API | 🟡 High | High | P1 | 3 |
| Metrics Export | 🟡 High | Low | P1 | 3 |
| Contextual Rules | 🟡 High | Medium | P1 | 2 |
| PDF Layout Redaction | 🟢 Medium | High | P2 | 4 |
| Webhook System | 🟢 Medium | Medium | P2 | 3 |
| Pattern Packs | 🟢 Medium | Medium | P2 | 5 |
| Cloud Integrations | 🟢 Medium | High | P2 | 5 |
| Archive Support | 🟢 Low | Medium | P3 | 4 |
| Additional Formats | 🟢 Low | Medium | P3 | 4 |
| ML/AI Features | 🟡 Future | Very High | P4 | 5+ |

---

## What I Disagree With / Lower Priority

### ❌ Not Recommended (from analysis)

1. **Over-engineering pattern coverage**
   The current 558+ patterns across 50+ countries is already exceptional. Adding more patterns has diminishing returns. Focus on detection quality, not quantity.

2. **Building a UI/Dashboard**
   This should be left to users or built as separate product. The library should remain headless.

3. **Blockchain-based audit logs**
   Cryptographic hashing is sufficient. Full blockchain is overkill and adds complexity.

4. **Support for every obscure format**
   Focus on JSON, CSV, XLSX, PDF. Don't add PPTX, EML, RTF until proven demand.

5. **Immediate ML/AI layer**
   Hybrid NER is good, but training custom models is premature. Current regex + context is 90%+ accurate.

---

## Success Metrics

### How we'll measure "Best PII Redaction Source in the World"

#### Detection Quality
- **Precision:** >95% (minimize false positives)
- **Recall:** >95% (minimize false negatives)
- **F1 Score:** >0.95
- Benchmark against: Microsoft Presidio, AWS Macie, Google DLP

#### Performance
- **Throughput:** >1000 docs/second (small docs)
- **Latency:** <20ms median, <100ms p99
- **Memory:** <100MB for typical workload

#### Coverage
- **Format Support:** JSON, CSV, XLSX, PDF, DOCX, TXT, Images
- **Pattern Coverage:** 600+ patterns (add missing legal, e-commerce)
- **International:** 60+ countries

#### Enterprise Readiness
- **Audit:** Persistent, queryable, tamper-proof
- **Multi-Tenancy:** Complete isolation, quota enforcement
- **Monitoring:** Prometheus metrics, Grafana dashboards
- **Deployment:** Docker image, cloud templates, <5 min setup

#### Adoption
- **GitHub Stars:** 1000+ (current: ~50)
- **NPM Downloads:** 10,000+/month
- **Documentation:** 100% API coverage, 10+ examples
- **Community:** Active issues/PRs, <48hr response time

---

## Immediate Next Steps (Week 1)

1. **JSON Processor** (Day 1-3)
   - Start with simple key-value detection
   - Add nested object support
   - Add array handling
   - Write tests

2. **CSV Processor** (Day 4-5)
   - Header detection
   - Column-level scanning
   - Write tests

3. **Documentation** (Throughout)
   - Update README with new formats
   - Add usage examples
   - Create migration guide

---

## Architecture Decisions

### Why Hybrid (Regex + NER) vs Pure ML?

**Pros of Hybrid:**
- ✅ Fast (no GPU required)
- ✅ Deterministic (same input = same output)
- ✅ Offline (no API calls)
- ✅ Explainable (can show why PII was detected)
- ✅ Low false positives (regex + NER confirmation)

**Cons of Pure ML:**
- ❌ Requires training data
- ❌ Slower (especially transformers)
- ❌ Non-deterministic (model updates change behavior)
- ❌ Harder to debug
- ❌ May require cloud/GPU

**Decision:** Start with hybrid, add ML as optional plugin later.

---

## Dependencies to Add

### Phase 1
- `csv-parse` - CSV parsing
- `xlsx` or `exceljs` - Excel support
- `compromise` - Lightweight NER (7KB)

### Phase 3
- `knex` or `prisma` - Database ORM
- `express` or `fastify` - API server
- `zod` - Request validation
- `prom-client` - Prometheus metrics

### Phase 4
- `pdf-lib` - PDF manipulation
- `mailparser` - Email parsing
- `cheerio` - HTML parsing

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| NER adds too much latency | High | Medium | Make it optional, use lightweight models |
| Multi-tenancy complexity | High | High | Use proven patterns, extensive testing |
| False positive spike | High | Medium | Gradual rollout, A/B test confidence thresholds |
| Dependency bloat | Medium | High | Use peer dependencies, keep core zero-dep |
| Breaking changes | Medium | Low | Semantic versioning, migration guides |

---

## Team Requirements

**For Phase 1-3 (Core Features):**
- 1 Senior Full-Stack Engineer (leads implementation)
- 1 ML/NLP Engineer (part-time, for NER integration)
- 1 DevOps Engineer (part-time, for API/Docker)

**For Phase 4-5 (Advanced Features):**
- Add 1 Frontend Engineer (if building UI)
- Add 1 Security Engineer (for audit/compliance)

---

## Estimated Timeline

- **Phase 1:** 3 weeks (Structured data)
- **Phase 2:** 5 weeks (Semantic detection)
- **Phase 3:** 6 weeks (Enterprise features)
- **Phase 4:** 4 weeks (Document enhancements)
- **Phase 5:** 6+ weeks (Advanced features)

**Total:** 24 weeks (~6 months) for world-class PII redaction library

---

## Conclusion

**OpenRedaction is already 70% of the way to "best in the world"** due to exceptional pattern coverage. The gaps are in:
1. Structured data formats (JSON/CSV) - **CRITICAL**
2. Enterprise features (audit, multi-tenancy) - **CRITICAL for your SaaS**
3. Semantic detection (NER) - **DIFFERENTIATOR**

By focusing on these three areas first, OpenRedaction will surpass commercial alternatives like:
- Microsoft Presidio (weaker pattern coverage)
- AWS Macie (cloud-only, expensive)
- Google DLP (cloud-only, expensive)
- Redact.ai (SaaS-only, no self-host)

**The path to #1 is clear: Execute Phases 1-3, then iterate based on user feedback.**
