import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Pattern Detection', () => {
  describe('Personal patterns', () => {
    it('should detect email addresses', async () => {
      const shield = new OpenRedaction({ patterns: ['EMAIL'] });

      const tests = [
        'john@example.com',
        'user.name@example.co.uk',
        'test+tag@domain.com'
      ];

      for (const email of tests) {
        const result = await shield.detect(`Contact: ${email}`);
        expect(result.detections.some(d => d.value === email)).toBe(true);
      }
    });

    it('should detect names', async () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });

      const result = await shield.detect('Contact John Smith for details');
      expect(result.detections.some(d => d.type === 'NAME')).toBe(true);
    });

    it('should detect names with salutations', async () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });

      const result = await shield.detect('Please ask Mr James Smith to join');
      expect(result.detections.some(d => d.type === 'NAME')).toBe(true);
    });

    it('should detect Unicode and hyphenated names', async () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });

      const samples = [
        'Contact María-José O’Connor for details',
        'Invite JEAN LUC-PICARD to the bridge'
      ];

      for (const text of samples) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NAME')).toBe(true);
      }
    });

    it('redacts the same name across casing variants', async () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });
      const input = 'hi my name is james smith James Smith JAMES SMITH';

      const { redacted } = await shield.detect(input);
      expect(redacted.toLowerCase()).not.toContain('james smith');

      const placeholders = redacted.match(/\[NAME_\d+\]/g) || [];
      expect(placeholders.length).toBe(3);
      expect(new Set(placeholders).size).toBe(1);
    });

    it('should avoid matching non-name phrases', async () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });

      const samples = [
        'the system name is james db',
        'we deploy using smith & co tooling'
      ];

      for (const text of samples) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NAME')).toBe(false);
      }
    });

    it('should avoid matching short generic tokens as names', async () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });

      const samples = ['the ACME system rebooted', 'TOKEN ABC triggered an alert'];
      for (const text of samples) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NAME')).toBe(false);
      }
    });

    it('should detect employee IDs', async () => {
      const shield = new OpenRedaction({ patterns: ['EMPLOYEE_ID'] });

      const tests = [
        'EMP-12345',
        'Employee ID: ABC123',
        'EMPL_NUM: XYZ789'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'EMPLOYEE_ID')).toBe(true);
      }
    });
  });

  describe('Financial patterns', () => {
    it('should detect credit cards with Luhn validation', async () => {
      const shield = new OpenRedaction({ patterns: ['CREDIT_CARD'] });

      // Valid cards
      const validCards = [
        '4532015112830366',
        '5425233430109903',
        '374245455400126',
        '4532-0151-1283-0366',
        '4532.0151.1283.0366'
      ];

      for (const card of validCards) {
        const result = await shield.detect(`Card: ${card}`);
        expect(result.detections.some(d => d.type === 'CREDIT_CARD')).toBe(true);
      }

      // Invalid card (fails Luhn check)
      const invalid = await shield.detect('Card: 1234567890123456');
      expect(invalid.detections.some(d => d.type === 'CREDIT_CARD')).toBe(false);
    });

    it('should detect IBAN with varied separators and casing', async () => {
      const shield = new OpenRedaction({ patterns: ['IBAN'] });

      const positives = [
        'Account: GB82WEST12345698765432',
        'Account: gb82 west 1234 5698 7654 32',
        'IBAN: GB82-WEST-1234-5698-7654-32',
        'IBAN\tGB82 WEST 1234.5698.7654.32'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'IBAN')).toBe(true);
      }

      const negative = await shield.detect('IBAN: GB00 TEST 1234');
      expect(negative.detections.some(d => d.type === 'IBAN')).toBe(false);
    }

    it('should detect UK bank accounts', async () => {
      const shield = new OpenRedaction({ patterns: ['BANK_ACCOUNT_UK'] });

      const positives = [
        'Account: 12345678',
        'acc# 1234 5678',
        'a/c: 12-34 5678'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'BANK_ACCOUNT_UK')).toBe(true);
      }

      const negatives = ['ref 12345678', 'code: 12-34-5678'];
      for (const text of negatives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'BANK_ACCOUNT_UK')).toBe(false);
      }
    }

    it('should detect UK sort codes', async () => {
      const shield = new OpenRedaction({ patterns: ['SORT_CODE_UK'] });

      const tests = [
        'Sort code: 12-34-56',
        'SC: 123456',
        'sort code 12 34 56',
        'SC: 12.34.56'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'SORT_CODE_UK')).toBe(true);
      }
    }

    it('should detect US routing numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['ROUTING_NUMBER_US'] });

      const positives = [
        'Routing number: 021000021',
        'ABA# 0210 00021',
        'RTN 0210.00021'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'ROUTING_NUMBER_US')).toBe(true);
      }

      const negative = await shield.detect('Routing number: 021000022');
      expect(negative.detections.some(d => d.type === 'ROUTING_NUMBER_US')).toBe(false);
    }

    it('should detect IFSC codes with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['IFSC'] });

      const positives = [
        'IFSC: HDFC 0 000123',
        'IFSC HDFC-0-000123'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'IFSC')).toBe(true);
      }

      const negative = await shield.detect('IFSC: HDFC 1 000123');
      expect(negative.detections.some(d => d.type === 'IFSC')).toBe(false);
    }

    it('should detect investment account numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['INVESTMENT_ACCOUNT'] });

      const positives = [
        'ISA account: AB12 34-56 78',
        'Pension acct #INV-1234-5678',
        'IRA A/C: ZX-98.76.5432'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'INVESTMENT_ACCOUNT')).toBe(true);
      }

      const negative = await shield.detect('Investment account: ABC');
      expect(negative.detections.some(d => d.type === 'INVESTMENT_ACCOUNT')).toBe(false);
    }
  }

  describe('Government patterns', () => {
    it('should detect US SSN', async () => {
      const shield = new OpenRedaction({ patterns: ['SSN'] });

      const tests = [
        'SSN: 123-45-6789',
        'Social security: 123 45 6789',
        'ssn#123.45.6789'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'SSN')).toBe(true);
      }
    }

    it('should detect UK National Insurance with flexible separators', async () => {
      const shield = new OpenRedaction({ patterns: ['NATIONAL_INSURANCE_UK'] });

      const positives = [
        'NINO: AB123456C',
        'National insurance: ab 12 34 56 c',
        'NI-AB12-34-56-D',
        'nino# ab12.34.56.d'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NATIONAL_INSURANCE_UK')).toBe(true);
      }

      const negatives = [
        'reference AB123456E',
        'NI: ZZ 12 34 56 Z'
      ];

      for (const text of negatives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NATIONAL_INSURANCE_UK')).toBe(false);
      }
    }

    it('should detect NHS numbers with mixed separators', async () => {
      const shield = new OpenRedaction({ patterns: ['NHS_NUMBER'] });

      const positives = [
        'NHS: 943 476 5919',
        'nhs number: 943.476.5919',
        'NHS#943 476 5919'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NHS_NUMBER')).toBe(true);
      }

      const negative = await shield.detect('NHS: 943 476 5918');
      expect(negative.detections.some(d => d.type === 'NHS_NUMBER')).toBe(false);
    }

    it('should detect UK passports with varied separators', async () => {
      const shield = new OpenRedaction({ patterns: ['PASSPORT_UK'] });

      const tests = [
        'Passport: 123456789',
        'passport #123 456 789',
        'Pass-123.456.789'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'PASSPORT_UK')).toBe(true);
      }
    }

    it('should detect US passports with mixed casing and separators', async () => {
      const shield = new OpenRedaction({ patterns: ['PASSPORT_US'] });

      const tests = [
        'passport: a12 345 678',
        'Pass#A12-345678',
        'passport A12.345.678'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'PASSPORT_US')).toBe(true);
      }
    }

    it('should detect MRZ TD1 blocks with Windows and Unix newlines', async () => {
      const shield = new OpenRedaction({ patterns: ['PASSPORT_MRZ_TD1'] });

      const mrz = [
        'I<UTOD231458907<<<<<<<<<<<<<<<',
        '7408122F1204159UTO<<<<<<<<<<<6',
        'ERIKSSON<<ANNA<MARIA<<<<<<<<<<'
      ].join('\r\n');

      const result = await shield.detect(mrz);
      expect(result.detections.some(d => d.type === 'PASSPORT_MRZ_TD1')).toBe(true);
    }

    it('should detect MRZ TD3 blocks across newline styles', async () => {
      const shield = new OpenRedaction({ patterns: ['PASSPORT_MRZ_TD3'] });

      const mrz = [
        'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<',
        'L898902C36UTO7408122F1204159ZE184226B<<<<<10'
      ].join('\r\n');

      const result = await shield.detect(mrz);
      expect(result.detections.some(d => d.type === 'PASSPORT_MRZ_TD3')).toBe(true);
    }

    it('should detect visa MRZ blocks across newline styles', async () => {
      const shield = new OpenRedaction({ patterns: ['VISA_MRZ'] });

      const mrz = [
        'V<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<',
        'L898902C36UTO7408122F1204159ZE184226B<<<<<10'
      ].join('\r\n');

      const result = await shield.detect(mrz);
      expect(result.detections.some(d => d.type === 'VISA_MRZ')).toBe(true);
    }

    it('should detect UK driving licenses', async () => {
      const shield = new OpenRedaction({ patterns: ['DRIVING_LICENSE_UK'] });

      const tests = [
        'License: SMITH901234AB1CD',
        'Licence SMITH 90 12 34 AB 1 CD',
        'Driving licence: SMITH90.12.34AB1CD'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'DRIVING_LICENSE_UK')).toBe(true);
      }
    }

    it('should reject invalid UK driving license dates', async () => {
      const shield = new OpenRedaction({ patterns: ['DRIVING_LICENSE_UK'] });

      const invalid = await shield.detect('License: SMITH903332AB1CD');
      expect(invalid.detections.some(d => d.type === 'DRIVING_LICENSE_UK')).toBe(false);
    }

    it('should detect US driving licenses with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['DRIVING_LICENSE_US'] });

      const tests = [
        "driver's license: A123-456-7890",
        'DL#B123 456 789'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'DRIVING_LICENSE_US')).toBe(true);
      }
    }

    it('should detect tax IDs with dotted or non-breaking separators', async () => {
      const shield = new OpenRedaction({ patterns: ['TAX_ID'] });

      const tests = [
        'EIN: 12.3456789',
        'Tax ID 12 3456789'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'TAX_ID')).toBe(true);
      }
    }

    it('should detect travel and immigration document numbers with spacing', async () => {
      const shield = new OpenRedaction({ patterns: ['TRAVEL_DOCUMENT_NUMBER', 'IMMIGRATION_NUMBER'] });

      const travel = await shield.detect('Travel doc: TD 12 34 56 78');
      expect(travel.detections.some(d => d.type === 'TRAVEL_DOCUMENT_NUMBER')).toBe(true);

      const immigration = await shield.detect('A-number: A12 345 678');
      expect(immigration.detections.some(d => d.type === 'IMMIGRATION_NUMBER')).toBe(true);
    }

    it('should detect visa numbers and border crossing cards with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['VISA_NUMBER', 'BORDER_CROSSING_CARD'] });

      const visa = await shield.detect('VISA: V12-3456-78');
      expect(visa.detections.some(d => d.type === 'VISA_NUMBER')).toBe(true);

      const bcc = await shield.detect('Border Crossing Card: BCC 12 34 56789');
      expect(bcc.detections.some(d => d.type === 'BORDER_CROSSING_CARD')).toBe(true);
    }

    it('should detect UK UTR numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['UTR_UK'] });

      const positives = [
        'UTR: 12345 67890',
        'Unique taxpayer reference 12-345-678-90'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'UTR_UK')).toBe(true);
      }

      const negative = await shield.detect('UTR: 12345 6789');
      expect(negative.detections.some(d => d.type === 'UTR_UK')).toBe(false);
    }

    it('should detect VAT numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['VAT_NUMBER'] });

      const positives = [
        'VAT: GB 123 4567 89',
        'VAT number DE12.345.678.901'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'VAT_NUMBER')).toBe(true);
      }

      const negative = await shield.detect('VAT: ZZ123456789');
      expect(negative.detections.some(d => d.type === 'VAT_NUMBER')).toBe(false);
    }
  }

  describe('Emergency services patterns', () => {
    it('should detect police report numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });

      const tests = [
        'Police report: PR-2023-000123',
        'Case #PD 23/0004567'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
      }

      const negative = await shield.detect('Report: 2023-12');
      expect(negative.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(false);
    }

    it('should detect fire incident numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });

      const tests = [
        'Fire incident: FD-2024-012345',
        'FI report #FD 24.123456'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
      }
    }
  }

  describe('HR patterns', () => {
    it('should detect benefits plan numbers with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['BENEFITS_PLAN_NUMBER'] });

      const tests = [
        'Benefits plan ID: HL-1234 5678',
        'Insurance plan no. AB/12-3456'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'BENEFITS_PLAN_NUMBER')).toBe(true);
      }

      const negative = await shield.detect('Plan ID: ABC');
      expect(negative.detections.some(d => d.type === 'BENEFITS_PLAN_NUMBER')).toBe(false);
    }

    it('should detect disciplinary action IDs with separators', async () => {
      const shield = new OpenRedaction({ patterns: ['DISCIPLINARY_ACTION_ID'] });

      const tests = [
        'Disciplinary action: DA-2024-0007',
        'Violation ID VI/2023/12345'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'DISCIPLINARY_ACTION_ID')).toBe(true);
      }

      const negative = await shield.detect('Warning ID: ABC');
      expect(negative.detections.some(d => d.type === 'DISCIPLINARY_ACTION_ID')).toBe(false);
    }
  }

  describe('Healthcare patterns', () => {
    it('should detect provider licenses with varied separators', async () => {
      const shield = new OpenRedaction({ patterns: ['PROVIDER_LICENSE'] });

      const positives = [
        'Physician licence no: CA-1234-5678',
        'Medical license: TX/AB.9876.54'
      ];

      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'PROVIDER_LICENSE')).toBe(true);
      }

      const negatives = [
        'provider update code 123456',
        'license for product ABC-123'
      ];

      for (const text of negatives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'PROVIDER_LICENSE')).toBe(false);
      }
    }

    it('should detect NPI numbers with dotted or spaced separators', async () => {
      const shield = new OpenRedaction({ patterns: ['NPI_NUMBER'] });

      const positives = ['NPI: 1000 0000 08', 'npi# 1000.0000.08'];
      for (const text of positives) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'NPI_NUMBER')).toBe(true);
      }

      const invalid = await shield.detect('npi 1000 0000 00');
      expect(invalid.detections.some(d => d.type === 'NPI_NUMBER')).toBe(false);
    }

    it('should detect DEA numbers with spacing and checksum validation', async () => {
      const shield = new OpenRedaction({ patterns: ['DEA_NUMBER'] });

      const positive = await shield.detect('DEA # AB 123 456 3');
      expect(positive.detections.some(d => d.type === 'DEA_NUMBER')).toBe(true);

      const negative = await shield.detect('DEA # AB 123 456 0');
      expect(negative.detections.some(d => d.type === 'DEA_NUMBER')).toBe(false);
    }

    it('should detect medical image references with hyphens and dots', async () => {
      const shield = new OpenRedaction({ patterns: ['MEDICAL_IMAGE_REF'] });

      const result = await shield.detect('MRI image file: image_2024-05-01.dcm');
      expect(result.detections.some(d => d.type === 'MEDICAL_IMAGE_REF')).toBe(true);

      const negative = await shield.detect('MRI results negative for fracture');
      expect(negative.detections.some(d => d.type === 'MEDICAL_IMAGE_REF')).toBe(false);
    }

    it('should detect biometric identifiers with separators and reject short tokens', async () => {
      const shield = new OpenRedaction({ patterns: ['BIOMETRIC_ID'] });

      const result = await shield.detect('Biometric hash: biometric-id# FACE_1234-ABCD');
      expect(result.detections.some(d => d.type === 'BIOMETRIC_ID')).toBe(true);

      const negative = await shield.detect('biometric score 99 recorded');
      expect(negative.detections.some(d => d.type === 'BIOMETRIC_ID')).toBe(false);
    }
  }

  describe('Contact patterns', () => {
    it('should detect UK mobile phones', async () => {
      const shield = new OpenRedaction({ patterns: ['PHONE_UK_MOBILE'] });

      const tests = [
        '07700900123',
        '07700 900 123'
      ];

      for (const phone of tests) {
        const result = await shield.detect(`Call: ${phone}`);
        expect(result.detections.some(d => d.type === 'PHONE_UK_MOBILE')).toBe(true);
      }
    }

    it('should detect US phones', async () => {
      const shield = new OpenRedaction({ patterns: ['PHONE_US'] });

      const tests = [
        '(555) 123-4567',
        '555-123-4567',
        '+1-555-123-4567',
        '555.123.4567 ext 55'
      ];

      for (const phone of tests) {
        const result = await shield.detect(`Call: ${phone}`);
        expect(result.detections.some(d => d.type === 'PHONE_US')).toBe(true);
      }
    }

    it('should detect UK mobile and landline formats', async () => {
      const shield = new OpenRedaction({ patterns: ['PHONE_UK_MOBILE', 'PHONE_UK'] });

      const tests = [
        '+44 7700 900 123',
        '07700-900-123',
        '(020) 7946 0958',
        '+44 (20) 7946 0958 ext 10'
      ];

      for (const phone of tests) {
        const result = await shield.detect(`Call: ${phone}`);
        expect(result.detections.some(d => d.type === 'PHONE_UK_MOBILE' || d.type === 'PHONE_UK')).toBe(true);
      }
    }

    it('should detect international phones with extensions', async () => {
      const shield = new OpenRedaction({ patterns: ['PHONE_INTERNATIONAL'] });

      const tests = ['+33 1 23 45 67 89', '+81-(3)-1234-5678 x321'];

      for (const phone of tests) {
        const result = await shield.detect(`Call: ${phone}`);
        expect(result.detections.some(d => d.type === 'PHONE_INTERNATIONAL')).toBe(true);
      }
    }

    it('should detect UK postcodes', async () => {
      const shield = new OpenRedaction({ patterns: ['POSTCODE_UK'] });

      const tests = [
        'SW1A 1AA',
        'M1 1AE',
        'B33 8TH'
      ];

      for (const postcode of tests) {
        const result = await shield.detect(`Address: ${postcode}`);
        expect(result.detections.some(d => d.type === 'POSTCODE_UK')).toBe(true);
      }
    }

    it('should detect US ZIP codes', async () => {
      const shield = new OpenRedaction({ patterns: ['ZIP_CODE_US'] });

      const tests = [
        '12345',
        '12345-6789'
      ];

      for (const zip of tests) {
        const result = await shield.detect(`ZIP: ${zip}`);
        expect(result.detections.some(d => d.type === 'ZIP_CODE_US')).toBe(true);
      }
    }

    it('should detect street addresses', async () => {
      const shield = new OpenRedaction({ patterns: ['ADDRESS_STREET'] });

      const tests = [
        '123 Main Street',
        '456 Oak Avenue',
        '789 Park Drive',
        '1600 amphitheatre pkwy Apt 2'
      ];

      for (const address of tests) {
        const result = await shield.detect(`Address: ${address}`);
        expect(result.detections.some(d => d.type === 'ADDRESS_STREET')).toBe(true);
      }
    }

    it('should parse multiple date formats for DOB', async () => {
      const shield = new OpenRedaction({ patterns: ['DATE_OF_BIRTH'] });

      const tests = [
        'DOB: 5-03-1980',
        'Date of birth: 12.7.79',
        'birth date 14 March 1990'
      ];

      for (const text of tests) {
        const result = await shield.detect(text);
        expect(result.detections.some(d => d.type === 'DATE_OF_BIRTH')).toBe(true);
      }
    }
  }

  describe('Network patterns', () => {
    it('should detect IPv4 addresses', async () => {
      const shield = new OpenRedaction({ patterns: ['IPV4'] });

      const result = await shield.detect('Server: 203.0.113.42');
      expect(result.detections.some(d => d.type === 'IPV4')).toBe(true);
    }

    it('should not detect private IPv4 addresses', async () => {
      const shield = new OpenRedaction({ patterns: ['IPV4'] });

      const privateIPs = [
        '192.168.1.1',
        '10.0.0.1',
        '127.0.0.1'
      ];

      for (const ip of privateIPs) {
        const result = await shield.detect(`Server: ${ip}`);
        expect(result.detections.some(d => d.type === 'IPV4')).toBe(false);
      }
    }

    it('should detect IPv6 addresses', async () => {
      const shield = new OpenRedaction({ patterns: ['IPV6'] });

      const result = await shield.detect('Server: 2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      expect(result.detections.some(d => d.type === 'IPV6')).toBe(true);
    }

    it('should detect MAC addresses', async () => {
      const shield = new OpenRedaction({ patterns: ['MAC_ADDRESS'] });

      const tests = [
        '00:1B:44:11:3A:B7',
        '00-1B-44-11-3A-B7'
      ];

      for (const mac of tests) {
        const result = await shield.detect(`Device: ${mac}`);
        expect(result.detections.some(d => d.type === 'MAC_ADDRESS')).toBe(true);
      }
    }

    it('should detect URLs with credentials', async () => {
      const shield = new OpenRedaction({ patterns: ['URL_WITH_AUTH'] });

      const result = await shield.detect('Connect: https://user:pass@example.com/path');
      expect(result.detections.some(d => d.type === 'URL_WITH_AUTH')).toBe(true);
    }
  }

  describe('Real-world scenarios', () => {
    it('should handle mixed PII in email text', async () => {
      const shield = new OpenRedaction();
      const text = `
        Hi John Smith,

        Please contact me at john@example.com or call 07700900123.
        My SSN is 123-45-6789 for verification.

        Thanks!
      `;

      const result = await shield.detect(text);
      expect(result.detections.length).toBeGreaterThan(0);
      expect(result.detections.some(d => d.type === 'EMAIL')).toBe(true);
    }

    it('should handle financial document', async () => {
      const shield = new OpenRedaction();
      const text = `
        Card Number: 4532015112830366
        Sort Code: 12-34-56
        Account: 12345678
        IBAN: GB82WEST12345698765432
      `;

      const result = await shield.detect(text);
      expect(result.detections.some(d => d.type === 'CREDIT_CARD')).toBe(true);
      expect(result.detections.some(d => d.type === 'SORT_CODE_UK')).toBe(true);
      expect(result.detections.some(d => d.type === 'IBAN')).toBe(true);
    }

    it('should handle government form', async () => {
      const shield = new OpenRedaction();
      const text = `
        Name: John Smith
        SSN: 123-45-6789
        Driver's License: SMITH901234AB1CD
        Date of Birth: 01/01/1980
      `;

      const result = await shield.detect(text);
      expect(result.detections.length).toBeGreaterThan(0);
    }
  }
}
