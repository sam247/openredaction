# Changelog

All notable changes to OpenRedaction will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-25

### Added

#### Core Features
- **571+ PII Patterns** - Comprehensive detection across 25+ industries and 50+ countries
- **Zero Dependencies** - Pure TypeScript implementation, ~100KB bundle
- **Local-First** - All processing happens locally, data never leaves your infrastructure
- **TypeScript Native** - Full type safety with comprehensive type exports

#### Detection & Analysis
- Hybrid regex + NER detection with 40+ contextual rules
- Context-aware confidence scoring (90%+ accuracy)
- Severity classification (4-tier: critical/high/medium/low)
- False positive filtering
- Multi-pass detection support
- Category-based pattern filtering (97.8% performance improvement)

#### Security (Phase 1)
- **ReDoS Protection** - 100ms timeout per pattern (configurable)
- **Input Size Limits** - 10MB default limit to prevent memory exhaustion
- **Pattern Validation** - Custom patterns validated for safety
- **Pre-compiled Patterns** - All patterns compiled once at initialization

#### Processing Modes
- **Batch Processing** - Sequential and parallel batch support
- **Streaming** - Chunked processing for large documents
- **Worker Threads** - Multi-core parallel processing
- **Caching** - LRU cache for improved performance

#### Document Support
- Plain text
- JSON (structured with path tracking)
- CSV (cell-level detection)
- XLSX/Excel (sheet + cell tracking)
- PDF (text extraction, requires peer dep)
- DOCX (text extraction, requires peer dep)
- Images (OCR with Tesseract.js, requires peer dep)

#### Redaction Modes
- `placeholder` - Token-based: `[EMAIL_1234]`
- `mask-middle` - Partial masking: `j***@example.com`
- `mask-all` - Full masking: `***************`
- `format-preserving` - Structure preserved: `XXX-XX-XXXX`
- `token-replace` - Fake data replacement

#### Integrations
- Express.js middleware
- React hooks (5 hooks: `useOpenRedaction`, `usePIIDetector`, etc.)
- Prometheus metrics
- Grafana dashboards

#### Enterprise Features (Phase 3)
- Configuration import/export
- Health check API
- Report generation (HTML, Markdown, JSON)
- Explain API for debugging
- Compliance presets (GDPR, HIPAA, CCPA)

#### Developer Experience
- 444 tests (100% pass rate)
- Performance benchmarks
- CLI tools for pattern testing
- Comprehensive examples (Node.js, Express, React)

### Performance
- <2ms processing for 2KB text
- <20ms processing for 10KB text
- 100x faster than cloud-based APIs
- 97.8% faster with category filtering (70ms → 1.5ms)

### Fixed
- Context analysis interference with @example.com domains in tests
- Safe regex validation for production patterns
- Test suite stability (444/444 passing)

### Documentation
- Comprehensive README with security features
- Installation and quick start guides
- API reference
- Examples for Node.js, Express, and React

---

## [Unreleased]

### Changed
- Updated package.json metadata for better npm discoverability
- Improved library description (removed enterprise/SaaS terminology)
- Fixed repository URLs (openredact → openredaction)
- Added `sideEffects: false` for better tree-shaking
- Added prepublishOnly script for safer releases

---

[1.0.0]: https://github.com/sam247/openredaction/releases/tag/v1.0.0
