---
"@openredaction/core": patch
---

Fix IBAN detection.

- IBANs followed by other text (e.g. `DE89370400440532013000 by Friday`, `GB82 WEST 1234 5698 7654 32 and thanks`) were not detected: the regex greedily consumed following words and validation then rejected the whole match. The IBAN regex is now generated from per-country lengths, so each country matches exactly its registered length.
- Valid IBANs are no longer suppressed when phrases like "test iban" or "example iban" appear nearby.
- Added the missing IBAN registry countries (e.g. BY, EG, IQ, LC, LY, RU, SC, SV, YE and French overseas territories) and corrected the Costa Rica length (22).
