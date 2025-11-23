/**
 * Performance benchmarks for OpenRedact
 * Run with: npm run bench
 */

import { describe, bench } from 'vitest';
import { OpenRedact } from '../src/detector';

// Test data of various sizes
const smallText = 'Contact john.smith@company.com or call +44 7700 900123';

const mediumText = `
Dear Customer,

Your account details:
- Email: john.smith@company.com
- Phone: +44 7700 900123
- Credit Card: 4532 0151 1283 0366
- SSN: 123-45-6789
- Address: 123 Main Street, London, SW1A 1AA

API Keys:
- AWS: AKIA1234567890ABCDEF
- GitHub: ghp_1234567890abcdefghij1234567890abcd

Please keep this information secure.
`.repeat(2);

const largeText = `
Customer Database Export
========================

Record 1:
- Name: John Smith
- Email: john.smith@company.com
- Phone: +44 7700 900123
- DOB: 15/03/1985
- SSN: 123-45-6789
- Credit Card: 4532 0151 1283 0366
- CVV: 123
- Expiry: 12/25
- Address: 123 Main Street, London, SW1A 1AA, United Kingdom
- Postcode: SW1A 1AA
- IBAN: GB82 WEST 1234 5698 7654 32
- Sort Code: 12-34-56
- Account: 12345678
- NHS Number: 943 476 5870
- Passport: 123456789
- Driving License: SMITH753116JD9IJ 35

Record 2:
- Name: Jane Doe
- Email: jane.doe@example.org
- Phone: +1 (555) 123-4567
- DOB: 22/08/1990
- SSN: 987-65-4321
- Credit Card: 5425 2334 3010 9903
- CVV: 456
- Expiry: 06/26
- Address: 456 Oak Avenue, New York, NY 10001, USA
- ZIP: 10001
- IBAN: US64 SVBK US6S 3300 0000 0000 0000 01
- ABA: 026009593
- Account: 87654321
- Passport: X12345678
- API Key: EXAMPLE_sk_live_1234567890abcdefghijklmnopqr

Record 3:
- Name: Alice Johnson
- Email: alice.j@startup.io
- Phone: 07911 123456
- DOB: 10/12/1988
- NI Number: AB123456C
- Credit Card: 3782 822463 10005
- CVV: 789
- Expiry: 09/24
- Address: 789 Tech Park, Manchester, M1 1AD, United Kingdom
- Postcode: M1 1AD
- Sort Code: 20-00-00
- Account: 55779911
- NHS Number: 485 777 3456
- Passport: 987654321
- GitHub Token: ghp_abcdefghijklmnopqrstuvwxyz1234567890
- Stripe Key: EXAMPLE_sk_test_39HqLyjWDarjtT1zdp7dc

Record 4:
- Name: Bob Wilson
- Email: bob.wilson@enterprise.com
- Phone: +44 20 7946 0958
- DOB: 05/07/1982
- SSN: 456-78-9012
- Credit Card: 6011 1111 1111 1117
- CVV: 321
- Expiry: 03/27
- Address: 321 Business Road, Birmingham, B1 1BB, United Kingdom
- Postcode: B1 1BB
- IBAN: GB29 NWBK 6016 1331 9268 19
- Sort Code: 60-16-13
- Account: 31926819
- AWS Access Key: AKIA1234567890EXAMPLE
- AWS Secret: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
`.repeat(2);

// Realistic 2KB text (our target)
const twoKbText = `
Application Security Audit Report
==================================

Executive Summary:
This document contains sensitive information about our application's security review.
All credentials and personal data should be treated as confidential.

1. User Accounts Reviewed
-------------------------
- Admin: admin@company.com (Phone: +44 7700 900123)
- Developer: dev.team@company.com (Phone: +44 7911 123456)
- Support: support@company.com (Phone: +1 555 123 4567)

2. API Credentials Found
------------------------
Production:
- AWS Access Key: AKIA1234567890ABCDEF
- AWS Secret Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
- Stripe Key: EXAMPLE_sk_live_567890abcdefghijklmnopqrstuv
- GitHub Token: ghp_abcdefghijklmnopqrstuvwxyz1234567890

Staging:
- AWS Access Key: AKIASTAGING12345ABCD
- Stripe Key: EXAMPLE_sk_test_9HqLyjWDarjtT1zdp7dc

3. Database Connections
----------------------
PostgreSQL: postgres://username:password@db.company.com:5432/proddb
MySQL: mysql://root:secretpass@localhost:3306/staging

4. Customer Data Sample
-----------------------
Customer #1:
- Name: John Smith
- Email: john.smith@customer.com
- Phone: +44 7700 900123
- Credit Card: 4532 0151 1283 0366
- Address: 123 Main Street, London, SW1A 1AA

Customer #2:
- Name: Jane Doe
- Email: jane.doe@customer.com
- Phone: +1 (555) 987-6543
- SSN: 123-45-6789
- IBAN: GB82 WEST 1234 5698 7654 32

5. Employee Information
-----------------------
John Developer:
- Email: john.d@company.com
- Phone: +44 7911 234567
- NI Number: AB123456C
- NHS Number: 943 476 5870
- Salary: £75,000

Jane Manager:
- Email: jane.m@company.com
- Phone: +44 7911 345678
- NI Number: CD987654E
- NHS Number: 485 777 3456
- Salary: £95,000

6. Security Recommendations
---------------------------
- Rotate all API keys immediately
- Implement secret management solution
- Enable MFA for all admin accounts
- Encrypt sensitive data at rest
- Review access logs for suspicious activity
`;

describe('Performance Benchmarks', () => {
  describe('Small text (< 100 chars)', () => {
    bench('default configuration', () => {
      const redactor = new OpenRedact();
      redactor.detect(smallText);
    });

    bench('with context analysis', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true
      });
      redactor.detect(smallText);
    });

    bench('with multi-pass (3 passes)', () => {
      const redactor = new OpenRedact({
        enableMultiPass: true,
        multiPassCount: 3
      });
      redactor.detect(smallText);
    });

    bench('all features enabled', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true,
        enableMultiPass: true
      });
      redactor.detect(smallText);
    });
  });

  describe('Medium text (~500 chars)', () => {
    bench('default configuration', () => {
      const redactor = new OpenRedact();
      redactor.detect(mediumText);
    });

    bench('with context analysis', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true
      });
      redactor.detect(mediumText);
    });

    bench('with multi-pass (3 passes)', () => {
      const redactor = new OpenRedact({
        enableMultiPass: true,
        multiPassCount: 3
      });
      redactor.detect(mediumText);
    });

    bench('all features enabled', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true,
        enableMultiPass: true
      });
      redactor.detect(mediumText);
    });
  });

  describe('Target: 2KB text (production benchmark)', () => {
    bench('default configuration (target: <10ms)', () => {
      const redactor = new OpenRedact();
      redactor.detect(twoKbText);
    });

    bench('with context analysis', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true
      });
      redactor.detect(twoKbText);
    });

    bench('with multi-pass (3 passes)', () => {
      const redactor = new OpenRedact({
        enableMultiPass: true,
        multiPassCount: 3
      });
      redactor.detect(twoKbText);
    });

    bench('all features enabled', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true,
        enableMultiPass: true
      });
      redactor.detect(twoKbText);
    });
  });

  describe('Large text (>2KB)', () => {
    bench('default configuration', () => {
      const redactor = new OpenRedact();
      redactor.detect(largeText);
    });

    bench('with context analysis', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true
      });
      redactor.detect(largeText);
    });

    bench('with multi-pass (3 passes)', () => {
      const redactor = new OpenRedact({
        enableMultiPass: true,
        multiPassCount: 3
      });
      redactor.detect(largeText);
    });

    bench('all features enabled', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true,
        enableMultiPass: true
      });
      redactor.detect(largeText);
    });
  });

  describe('Batch processing simulation', () => {
    const documents = [smallText, mediumText, twoKbText];

    bench('sequential processing (3 documents)', () => {
      const redactor = new OpenRedact();
      for (const doc of documents) {
        redactor.detect(doc);
      }
    });

    bench('with reused instance', () => {
      const redactor = new OpenRedact({
        enableContextAnalysis: true
      });
      for (const doc of documents) {
        redactor.detect(doc);
      }
    });
  });

  describe('Pattern compilation overhead', () => {
    bench('new instance per detection (worst case)', () => {
      const redactor = new OpenRedact();
      redactor.detect(smallText);
    });

    bench('reused instance (best case)', () => {
      const redactor = new OpenRedact();
      redactor.detect(smallText);
    });
  });
});
