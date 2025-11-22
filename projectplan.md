# OpenRedact Project Plan

## Vision
Build the most thorough, accurate, and developer-friendly PII redaction library - the go-to solution for privacy-conscious developers across all industries.

## Current Status
- **Version:** 0.1.0
- **Patterns:** 20+ (UK/US focused)
- **Test Coverage:** 98%
- **Architecture:** npm-only, local-first, zero dependencies
- **Learning System:** ✅ Implemented
- **First Customer:** Disclosurely (integration pending)

---

## Execution Plan: Phases 1-5

### Phase 1: Accuracy & Coverage (Weeks 1-4) 🔥 CURRENT

#### 1.1 Enhanced Name Detection
- [x] Basic name patterns (First Last, First Middle Last)
- [ ] Salutation handling (Mr., Mrs., Dr., Prof., Rev., Hon.)
- [ ] Suffix handling (Jr., Sr., III, PhD, MD, Esq., QC)
- [ ] Hyphenated names (Mary-Jane, Jean-Claude)
- [ ] Multi-cultural names (Asian, Arabic, Hispanic, African patterns)
- [ ] Common first/last name datasets (Top 10K from census)
- [ ] Probability scoring (not rigid matching)
- [ ] Contextual validation (check surrounding words)

#### 1.2 International Expansion

**Europe (Priority 1):**
- [ ] German Tax ID (Steueridentifikationsnummer) - 11 digits
- [ ] French Social Security (Numéro de Sécurité Sociale) - 15 digits
- [ ] Spanish DNI/NIE - 8 digits + letter
- [ ] Italian Fiscal Code (Codice Fiscale) - 16 chars
- [ ] Dutch BSN - 9 digits with checksum
- [ ] Polish PESEL - 11 digits
- [ ] IBAN validation (all 76 countries)

**Asia-Pacific (Priority 2):**
- [ ] Indian Aadhaar - 12 digits
- [ ] Australian Medicare - 10 digits
- [ ] Australian TFN (Tax File Number) - 9 digits
- [ ] Singapore NRIC/FIN - 9 chars (letter + 7 digits + checksum)
- [ ] Japanese My Number - 12 digits
- [ ] South Korean RRN - 13 digits

**Americas (Priority 2):**
- [ ] Canadian SIN - 9 digits with checksum
- [ ] Brazilian CPF - 11 digits with validation
- [ ] Brazilian CNPJ - 14 digits
- [ ] Mexican CURP - 18 chars
- [ ] Mexican RFC - 13 chars

**Addresses:**
- [ ] Canadian postal codes
- [ ] Australian postcodes
- [ ] EU address formats (Germany, France, Spain, Italy)
- [ ] Apartment/unit number detection
- [ ] International PO Box patterns

#### 1.3 Medical & Healthcare Data (HIPAA-Specific)

**Core Identifiers:**
- [ ] Medical Record Numbers (MRN) - various formats
- [ ] Health Plan Beneficiary Numbers
- [ ] Healthcare Provider License Numbers
- [ ] Device identifiers and serial numbers
- [ ] Biometric identifier references
- [ ] Patient ID formats (common hospital patterns)

**Medical Terminology:**
- [ ] ICD-10 diagnosis codes
- [ ] CPT procedure codes
- [ ] Drug names with dosages
- [ ] Lab result patterns
- [ ] Prescription numbers
- [ ] Insurance group/member numbers

**Clinical Data:**
- [ ] Appointment references
- [ ] Treatment notes patterns
- [ ] Allergies mentions
- [ ] Medical conditions (when with names)
- [ ] Genomic markers (rs numbers)
- [ ] Trial participant IDs

#### 1.4 Financial Data Enhancement

**Banking:**
- [ ] BIN (Bank Identification Number) validation for credit cards
- [ ] SWIFT/BIC codes - 8 or 11 chars
- [ ] Bank wire transfer details
- [ ] Direct Debit references
- [ ] Account numbers (international formats)
- [ ] Cheque numbers

**Investment & Trading:**
- [ ] Stock ticker symbols (when with trade details)
- [ ] Investment account numbers
- [ ] ISA/pension account references
- [ ] Portfolio IDs
- [ ] Trading platform user IDs

**Cryptocurrency:**
- [ ] Bitcoin addresses (P2PKH, P2SH, Bech32)
- [ ] Ethereum addresses (0x...)
- [ ] Other crypto wallet formats
- [ ] Transaction hashes

**Payment Data:**
- [ ] Payment card track data
- [ ] CVV in payment context (not standalone 3-4 digits)
- [ ] Expiration dates in payment context
- [ ] Payment reference numbers
- [ ] Transaction IDs (various formats)

#### 1.5 Technology & Network

**API & Authentication:**
- [ ] AWS API keys (AKIA...)
- [ ] Google API keys (AIza...)
- [ ] Stripe API keys (sk_live_, pk_live_)
- [ ] GitHub tokens (ghp_, gho_)
- [ ] OAuth tokens (Bearer patterns)
- [ ] JWT tokens (eyJ... pattern)
- [ ] Session IDs (various formats)

**Infrastructure:**
- [ ] Private keys (RSA, SSH key patterns)
- [ ] Database connection strings
- [ ] AWS ARNs
- [ ] Azure Resource IDs
- [ ] Kubernetes secrets
- [ ] Docker credentials
- [ ] CI/CD tokens

**Network:**
- [ ] IMEI numbers (15 digits)
- [ ] Device serial numbers
- [ ] Server hostnames
- [ ] VPN credentials
- [ ] Admin credentials patterns

#### 1.6 Industry-Specific Patterns

**Legal:**
- [ ] Case numbers (court format patterns)
- [ ] Case references (LAW-YYYY-NNNN)
- [ ] Evidence exhibit IDs
- [ ] Legal entity numbers
- [ ] Witness reference codes

**HR & Recruitment:**
- [ ] Employee IDs (enhanced - more formats)
- [ ] Applicant reference numbers
- [ ] Salary figures (when in context)
- [ ] Right-to-work share codes (UK)
- [ ] Recruitment agency references

**Education:**
- [ ] Student IDs
- [ ] SEN/SEND references
- [ ] Assessment scores (when identifiable)
- [ ] School registration numbers
- [ ] Education provider codes

**Insurance:**
- [ ] Policy numbers (various insurer formats)
- [ ] Claim reference numbers
- [ ] NCD (No Claims Discount) certificates
- [ ] Vehicle registration (UK, US, EU)
- [ ] VIN numbers

**Real Estate:**
- [ ] Property reference numbers
- [ ] Title deed numbers
- [ ] Tenant application IDs
- [ ] Guarantor details patterns
- [ ] EPC certificate numbers

**Government:**
- [ ] Case reference numbers
- [ ] Council tax account numbers
- [ ] Benefits claim numbers
- [ ] Voter registration numbers
- [ ] Government service IDs

**Energy & Utilities:**
- [ ] Meter serial numbers (gas, electric, water)
- [ ] Supply numbers (MPAN, MPRN)
- [ ] Customer account numbers
- [ ] Tariff codes

**Travel & Transport:**
- [ ] Passport MRZ codes
- [ ] Booking references (PNR)
- [ ] Frequent flyer numbers
- [ ] Ticket reference numbers
- [ ] Travel document numbers
- [ ] Vehicle registration plates

**Telecoms:**
- [ ] IMSI numbers
- [ ] Phone account numbers
- [ ] SIM card numbers
- [ ] Network PIN codes

**E-commerce:**
- [ ] Order IDs
- [ ] Customer account numbers
- [ ] Tracking numbers (Royal Mail, DPD, etc.)
- [ ] Return authorization numbers

**Media & Entertainment:**
- [ ] Talent contract IDs
- [ ] Royalty tracking IDs
- [ ] Agent reference numbers
- [ ] Production codes

**Childcare & Social Care:**
- [ ] Case reference numbers
- [ ] Safeguarding IDs
- [ ] Child protection codes
- [ ] Family support references

**Fitness & Wellness:**
- [ ] Member IDs
- [ ] Access card numbers
- [ ] Class booking references
- [ ] Trainer session codes

---

### Phase 2: Accuracy Improvements (Weeks 5-8)

#### 2.1 Context-Aware Detection

**NLP-Lite Features:**
- [ ] Document type inference (email, code, document, chat)
- [ ] Email header/signature detection
- [ ] Code context detection (variables, comments, strings)
- [ ] Document structure analysis (headings, lists, tables)
- [ ] Temporal context (dates near names = likely person)
- [ ] Professional title detection (CEO, Director, Manager)

**Contextual Rules:**
- [ ] "Dear [NAME]" = high confidence
- [ ] "The [WORD]" = low confidence for names
- [ ] "API", "IT", "CEO" in tech context = not a name
- [ ] Phone numbers in version strings = not phone
- [ ] Emails in code templates = not real email

#### 2.2 False Positive Reduction

**Domain-Specific Blacklists:**
- [ ] Technology terms (API, SDK, CLI, GUI, JSON, XML, etc.)
- [ ] Business terms (CEO, CTO, CFO, HR, PR, etc.)
- [ ] Common words as names (Dear, The, Welcome, etc.)
- [ ] Dictionary words (Apple, Amazon, Orange, etc.)
- [ ] Test/example domains (example.com, test.com, localhost)

**Pattern Refinement:**
- [ ] Version numbers vs phone numbers
- [ ] Part numbers vs identification numbers
- [ ] Template placeholders ({email}, [name], etc.)
- [ ] Numeric IDs vs sensitive numbers

**Validation Enhancement:**
- [ ] Stronger Luhn validation (BIN checks)
- [ ] IBAN country-specific validation (all countries)
- [ ] Checksum validation where applicable
- [ ] Format validation (spacing, separators)

#### 2.3 Dynamic Priority System

**Implement:**
- [ ] Pattern specificity scoring
- [ ] Validation strength weighting
- [ ] Historical accuracy from learning data
- [ ] False positive rate adjustment
- [ ] Auto-priority tuning based on feedback

#### 2.4 Multi-Pass Detection

**Three-Pass System:**
- [ ] Pass 1: High-confidence (95%+) with strong validators
- [ ] Pass 2: Medium-confidence (80-95%) with context checks
- [ ] Pass 3: Low-confidence (<80%) - optional, requires review
- [ ] Confidence scoring for all detections
- [ ] Review suggestions for low-confidence

---

### Phase 3: Performance & Scale (Weeks 9-12)

#### 3.1 Performance Optimization

**Targets:**
- [ ] 2KB text: <10ms (currently ~15ms)
- [ ] 10KB text: <50ms
- [ ] 100KB text: <500ms
- [ ] 1MB text: <5s

**Optimizations:**
- [ ] Lazy pattern compilation
- [ ] Regex optimization (atomic groups, possessive quantifiers)
- [ ] Early termination for whitelisted content
- [ ] Pattern result caching
- [ ] Memory usage optimization

#### 3.2 Streaming API

**For Large Documents:**
- [ ] OpenRedactStream class
- [ ] Chunk-based processing
- [ ] Node.js stream interface
- [ ] AsyncIterator support
- [ ] Progress reporting

#### 3.3 Batch Processing

**For Multiple Documents:**
- [ ] Batch detection API
- [ ] Parallel processing support
- [ ] Configurable concurrency
- [ ] Result aggregation
- [ ] Progress callbacks

#### 3.4 Worker Thread Support

**For Heavy Workloads:**
- [ ] Worker thread pool
- [ ] Load balancing
- [ ] Result streaming
- [ ] Error handling

---

### Phase 4: Developer Experience (Weeks 13-16)

#### 4.1 Error Messages & Debugging

**Helpful Errors:**
- [ ] Descriptive error messages
- [ ] Actionable suggestions
- [ ] Documentation links
- [ ] Code examples in errors

**Debug Mode:**
- [ ] Detailed logging
- [ ] Pattern match explanations
- [ ] Confidence breakdown
- [ ] Performance metrics

#### 4.2 Explanation API

**Implement:**
- [ ] `explain()` method for detections
- [ ] Match reasoning breakdown
- [ ] Context analysis display
- [ ] Confidence factors
- [ ] Validation details

#### 4.3 Visualization & Reporting

**Report Generation:**
- [ ] HTML reports with syntax highlighting
- [ ] Markdown reports for GitHub
- [ ] JSON reports for automation
- [ ] PDF export (via HTML)
- [ ] Severity color coding

**Interactive Features:**
- [ ] Click-to-explain detections
- [ ] Pattern filtering
- [ ] Severity filtering
- [ ] Export options

#### 4.4 Framework Integrations

**Express.js:**
- [ ] Middleware for body scanning
- [ ] Auto-redaction option
- [ ] Logging integration
- [ ] Error handling

**React:**
- [ ] `useOpenRedact` hook
- [ ] Real-time validation
- [ ] Input masking
- [ ] Form integration

**Next.js:**
- [ ] API route helpers
- [ ] Server-side detection
- [ ] Client-side validation

**Other Frameworks:**
- [ ] Fastify plugin
- [ ] Koa middleware
- [ ] Vue composable
- [ ] Svelte action

---

### Phase 5: Documentation & Community (Weeks 17-20)

#### 5.1 Interactive Documentation

**Build:**
- [ ] Documentation website (Docusaurus/VitePress)
- [ ] Interactive pattern tester (web app)
- [ ] Pattern playground (try live)
- [ ] API reference (auto-generated from TSDoc)
- [ ] Video tutorials (YouTube channel)

**Content:**
- [ ] Getting started guide
- [ ] Industry-specific guides (healthcare, finance, etc.)
- [ ] Integration tutorials
- [ ] Best practices guide
- [ ] Performance optimization guide
- [ ] Migration guides from competitors

#### 5.2 Community Pattern Library

**Create:**
- [ ] Pattern repository (separate repo)
- [ ] Community contribution guidelines
- [ ] Pattern voting/rating system
- [ ] Verified patterns (tested + validated)
- [ ] Industry-specific packs (as npm packages)

**Industry Packs:**
- [ ] `@openredact/healthcare` - Medical patterns
- [ ] `@openredact/finance` - Banking/fintech patterns
- [ ] `@openredact/legal` - Legal industry patterns
- [ ] `@openredact/education` - Education patterns
- [ ] `@openredact/government` - Public sector patterns

#### 5.3 Benchmarks & Comparisons

**Publish:**
- [ ] Accuracy benchmarks vs Presidio
- [ ] Accuracy benchmarks vs AWS Comprehend
- [ ] Accuracy benchmarks vs Google DLP
- [ ] Performance benchmarks (speed)
- [ ] Feature comparison matrix
- [ ] Real-world case studies

**Test Datasets:**
- [ ] Create industry-specific test sets
- [ ] Publicly available datasets
- [ ] Synthetic data generation
- [ ] Anonymized real-world samples

#### 5.4 Marketing & Growth

**Content Marketing:**
- [ ] Blog posts (technical deep-dives)
- [ ] Twitter/X presence
- [ ] Dev.to articles
- [ ] HackerNews launches
- [ ] Conference talks (submit CFPs)

**Community Building:**
- [ ] Discord server
- [ ] GitHub Discussions
- [ ] Monthly office hours
- [ ] Contributor recognition

---

## Industry-Specific Pattern Catalog

### Healthcare
**Patterns to Implement:**
- Patient names (enhanced name detection)
- NHS numbers (✅ already implemented)
- Medical Record Numbers (MRN) - formats: `MR-######`, `MRN######`, `#######`
- Appointment references - `APT-######`, `APPT######`
- Diagnosis codes (ICD-10) - `[A-Z]##.##`
- Prescription numbers - `RX-######`, `PRESC######`
- Allergy mentions (when with patient names)
- DOB in medical context (✅ basic DOB exists)

### Pharmaceutical & Clinical Trials
- Trial participant IDs - `P-#####`, `TRIAL-####-###`
- Protocol numbers - `PROTO-####`
- Genetic markers - `rs######` (dbSNP)
- Consent form IDs
- Drug trial codes
- Investigator IDs

### Financial Services
- Account numbers (✅ UK exists, expand to international)
- Sort codes (✅ implemented)
- Transaction IDs - `TXN-############`, `TX######`
- Investment accounts - `ISA-######`, `INV-######`
- KYC document references
- Wire transfer references

### Banking & Fintech
- IBAN (✅ implemented, enhance validation)
- SWIFT/BIC codes - `[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?`
- Payment references
- DD mandate numbers
- Open Banking consent IDs
- Card tokens

### Legal Services
- Case numbers - `YYYY-[A-Z]{3}-####`, `[A-Z]{2}##/####`
- Client reference - `CLI-######`
- Matter numbers - `MAT-######`
- Witness IDs - `WIT-###`
- Evidence exhibit - `EX-[A-Z]-###`
- Counsel reference

### HR & Recruitment
- Employee IDs (✅ basic, enhance)
- Applicant IDs - `APP-######`, `CAND-######`
- Right-to-work codes (UK) - `[A-Z]{2}######`
- Salary figures (in context)
- Reference IDs
- Interview codes

### Education
- Student IDs - `STU-######`, `######`
- SEN referral IDs - `SEN-####`, `SEND-####`
- Assessment IDs
- Pupil premium numbers
- DfE numbers
- ULN (Unique Learner Number - UK)

### Insurance
- Policy numbers - `POL-######`, `######-##`
- Claim references - `CLM-######`, `CLAIM######`
- Quote references
- NCD certificate numbers
- Loss adjuster IDs
- Underwriter codes

### E-commerce & Retail
- Order IDs - `ORD-######`, `#########`
- Customer account numbers
- Tracking numbers (Royal Mail, DPD, etc.)
- Return authorization - `RMA-######`
- Gift card codes
- Promo codes (when unique)

### Telecoms
- IMEI (✅ if not exists) - 15 digits with checksum
- IMSI - 15 digits
- Phone account numbers
- SIM serial numbers (ICCID) - 19-20 digits
- Network PINs
- Porting authorization codes

### Real Estate & Property
- Property reference - `PROP-######`
- Tenancy agreement IDs
- Title deed numbers
- EPC certificate - `####-####-####-####-####`
- RICS survey IDs
- Mortgage reference

### Government & Public Sector
- Case reference - `[A-Z]{3}-######`
- NI numbers (✅ implemented)
- Council tax accounts
- Benefits claim numbers
- Voter registration
- FOI request IDs

### Energy & Utilities
- MPAN (electricity) - 13 or 21 digits
- MPRN (gas) - 6-10 digits
- Meter serial numbers
- Supply numbers
- Account reference
- Tariff codes

### Travel, Transport & Aviation
- Passport numbers (✅ UK/US, expand)
- PNR (booking reference) - 6 alphanumeric
- Frequent flyer numbers
- Ticket numbers - 13 digits (airline)
- e-Ticket references
- Visa numbers

### Hospitality
- Booking reference - `[A-Z]{2,3}####`
- Guest folio numbers
- Loyalty program IDs
- Conference booking IDs
- Room reservation codes

### Technology & SaaS
- API keys (✅ expand to more providers)
- User IDs
- Session tokens
- OAuth tokens
- Customer IDs - `cus_########`
- Subscription IDs - `sub_########`

### Cybersecurity & IT
- SSH keys (header detection)
- Certificates (PEM format detection)
- Password hashes (bcrypt, argon2 patterns)
- Security question answers
- 2FA backup codes
- Recovery keys

### Manufacturing
- Part numbers
- Serial numbers
- Batch codes
- Quality control IDs
- Supplier codes
- RMA numbers

### Construction
- CSCS card numbers (UK) - 9 digits
- Contractor license
- Site access codes
- H&S certificate numbers
- Planning application numbers
- Building regulation refs

### Media & Entertainment
- Talent contract IDs
- Royalty tracking codes
- ISRC codes (recordings)
- ISBN (books)
- Production codes
- Agent references

### Marketing & Advertising
- Campaign IDs
- Lead tracking codes
- UTM parameters (when containing PII)
- Customer journey IDs
- A/B test group IDs

### Charities & Nonprofits
- Donor IDs
- Gift Aid references - `GA-######`
- Volunteer IDs
- Grant reference numbers
- Beneficiary codes

### Professional Services
- Client codes
- Matter references
- Engagement IDs
- VAT registration numbers
- Companies House numbers
- Professional body membership

### Fitness & Wellness
- Member IDs
- Class booking codes
- Personal trainer session IDs
- Locker numbers (when linked to identity)
- Access card numbers

### Childcare & Social Care
- Child ID - `SC-######`, `CP-######`
- Case worker IDs
- Safeguarding refs
- Family support codes
- Assessment reference numbers
- Early years funding codes

### Recruitment Agencies
- Candidate IDs
- Job reference codes
- Timesheet numbers
- Placement IDs
- Right-to-work verification codes

---

## Success Metrics

### Technical Metrics
- **Pattern Count:** 20 → 200+ (target)
- **Country Coverage:** 2 → 50+ countries
- **Industry Coverage:** General → 25+ industries
- **Accuracy:** 96% → 99.5%
- **False Positive Rate:** ~2% → <0.1%
- **Performance:** 15ms → <10ms (2KB)
- **Test Coverage:** 98% → 99%+

### Adoption Metrics
- **npm Downloads:** Track weekly growth (target: 10K/week by Q4)
- **GitHub Stars:** 0 → 1,000 in 6 months
- **Contributors:** 0 → 10+ in 6 months
- **Production Users:** 1 (Disclosurely) → 100+ companies

### Community Metrics
- **Documentation Quality:** Time-to-first-success <5min
- **Issue Response Time:** <48 hours
- **Community Patterns:** 0 → 50+ contributed patterns
- **Blog Posts:** Monthly technical articles

---

## Timeline

**Week 1-2:** Enhanced name detection + medical patterns
**Week 3-4:** Financial + international patterns (EU)
**Week 5-6:** Context analysis framework
**Week 7-8:** False positive reduction + multi-pass
**Week 9-10:** Performance optimization
**Week 11-12:** Streaming API + batch processing
**Week 13-14:** Debug tools + error messages
**Week 15-16:** Framework integrations
**Week 17-18:** Documentation site + playground
**Week 19-20:** Benchmarks + community launch

---

## Integration with Disclosurely

**Timeline:**
- **Week 1-4:** Core pattern expansion
- **Week 5:** Disclosurely integration begins
- **Week 6-8:** Real-world testing + feedback collection
- **Week 9-12:** Optimization based on Disclosurely data
- **Week 13+:** Continuous improvement loop

**Feedback Loop:**
1. Disclosurely uses OpenRedact in production
2. Collects feedback via local learning system
3. Exports generic learnings (anonymized)
4. Contributes back to OpenRedact
5. OpenRedact publishes improved patterns
6. Cycle repeats

---

## Risk Management

**Technical Risks:**
- Pattern explosion (100+ patterns) = performance impact
  - Mitigation: Lazy loading, pattern categories, multi-pass
- False positive increase with more patterns
  - Mitigation: Strong validators, context awareness, confidence scoring
- Maintenance burden
  - Mitigation: Community patterns, automated testing, pattern versioning

**Adoption Risks:**
- Competing with well-funded solutions (AWS, Google)
  - Mitigation: Privacy-first positioning, local execution, zero cost
- Pattern quality concerns
  - Mitigation: Verification process, test suites, real-world validation

---

## Next Actions (This Week)

1. ✅ Plan documented
2. [ ] Create industry pattern structure
3. [ ] Implement top 20 medical patterns
4. [ ] Implement top 20 financial patterns
5. [ ] Add 5 European country patterns
6. [ ] Build comprehensive test suite for new patterns
7. [ ] Document all new patterns with examples

**Daily Focus:**
- Day 1-2: Medical & healthcare patterns
- Day 3-4: Financial & banking patterns
- Day 5-6: International patterns (EU)
- Day 7: Testing & documentation

---

**Last Updated:** 2024-11-22
**Status:** Phase 1 Starting
**Next Review:** End of Week 2
