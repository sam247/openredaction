---
"@openredaction/core": patch
---

Employee ID pattern no longer matches the rest of a word that starts with "emp" (`employer`, `employees`, `empiezo`), and now finds the ID in `Employee ID: AB1234` and `Employee12345` instead of `loyee` and `loyee12345`.
