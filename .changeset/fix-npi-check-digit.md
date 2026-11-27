---
"@openredaction/core": patch
---

NPI detection now applies the CMS check digit (Luhn with the `80840` prefix), so valid NPIs such as the CMS example `1234567893` are detected and redacted.
