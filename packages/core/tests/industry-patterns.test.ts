import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Industry-Specific Pattern Detection', () => {
  describe('Education patterns', () => {
    it('should detect student IDs', () => {
      const shield = new OpenRedaction({ patterns: ['STUDENT_ID'] });
      const result = shield.detect('Student ID: S1234567');
      expect(result.detections.some(d => d.type === 'STUDENT_ID')).toBe(true);
    });

    it('should detect exam registration numbers', () => {
      const shield = new OpenRedaction({ patterns: ['EXAM_REGISTRATION_NUMBER'] });
      const result = shield.detect('Exam registration: EXAM-2024-5678');
      expect(result.detections.some(d => d.type === 'EXAM_REGISTRATION_NUMBER')).toBe(true);
    });
  });

  describe('Insurance patterns', () => {
    it('should detect claim IDs', () => {
      const shield = new OpenRedaction({ patterns: ['CLAIM_ID'] });
      const result = shield.detect('Claim ID: CLAIM-12345678');
      expect(result.detections.some(d => d.type === 'CLAIM_ID')).toBe(true);
    });

    it('should detect policy numbers', () => {
      const shield = new OpenRedaction({ patterns: ['POLICY_NUMBER'] });
      const result = shield.detect('Policy number: POLICY-ABC123456');
      expect(result.detections.some(d => d.type === 'POLICY_NUMBER')).toBe(true);
    });

    it('should detect policy holder IDs', () => {
      const shield = new OpenRedaction({ patterns: ['POLICY_HOLDER_ID'] });
      const result = shield.detect('Policy holder: PH-A12345678');
      expect(result.detections.some(d => d.type === 'POLICY_HOLDER_ID')).toBe(true);
    });
  });

  describe('Retail patterns', () => {
    it('should detect order numbers', () => {
      const shield = new OpenRedaction({ patterns: ['ORDER_NUMBER'] });
      const result = shield.detect('Order number: ORD-1234567890');
      expect(result.detections.some(d => d.type === 'ORDER_NUMBER')).toBe(true);
    });

    it('should detect loyalty card numbers', () => {
      const shield = new OpenRedaction({ patterns: ['LOYALTY_CARD_NUMBER'] });
      const result = shield.detect('Loyalty card: LOYALTY-1234567890123');
      expect(result.detections.some(d => d.type === 'LOYALTY_CARD_NUMBER')).toBe(true);
    });

    it('should detect device ID tags', () => {
      const shield = new OpenRedaction({ patterns: ['DEVICE_ID_TAG'] });
      const result = shield.detect('Device ID: DEVID:1234567890ABCDEF');
      expect(result.detections.some(d => d.type === 'DEVICE_ID_TAG')).toBe(true);
    });

    it('should detect gift card numbers', () => {
      const shield = new OpenRedaction({ patterns: ['GIFT_CARD_NUMBER'] });
      const result = shield.detect('Gift card: GC-1234567890123');
      expect(result.detections.some(d => d.type === 'GIFT_CARD_NUMBER')).toBe(true);
    });
  });

  describe('Telecoms patterns', () => {
    it('should detect customer account numbers', () => {
      const shield = new OpenRedaction({ patterns: ['TELECOMS_ACCOUNT_NUMBER'] });
      const result = shield.detect('Account number: ACC-123456789');
      expect(result.detections.some(d => d.type === 'TELECOMS_ACCOUNT_NUMBER')).toBe(true);
    });

    it('should detect meter serial numbers', () => {
      const shield = new OpenRedaction({ patterns: ['METER_SERIAL_NUMBER'] });
      const result = shield.detect('Meter serial: MTR-1234567890');
      expect(result.detections.some(d => d.type === 'METER_SERIAL_NUMBER')).toBe(true);
    });

    it('should detect IMSI numbers', () => {
      const shield = new OpenRedaction({ patterns: ['IMSI_NUMBER'] });
      const result = shield.detect('IMSI number: IMSI-123456789012345');
      expect(result.detections.some(d => d.type === 'IMSI_NUMBER')).toBe(true);
    });

    it('should detect IMEI numbers', () => {
      const shield = new OpenRedaction({ patterns: ['IMEI_NUMBER'] });
      const result = shield.detect('IMEI number: IMEI-123456789012345');
      expect(result.detections.some(d => d.type === 'IMEI_NUMBER')).toBe(true);
    });

    it('should detect SIM card numbers', () => {
      const shield = new OpenRedaction({ patterns: ['SIM_CARD_NUMBER'] });
      const result = shield.detect('SIM card: SIM-12345678901234567890');
      expect(result.detections.some(d => d.type === 'SIM_CARD_NUMBER')).toBe(true);
    });
  });

  describe('Legal patterns', () => {
    it('should detect case numbers', () => {
      const shield = new OpenRedaction({ patterns: ['CASE_NUMBER'] });
      const result = shield.detect('Case number: CASE-AB-2024-123456');
      expect(result.detections.some(d => d.type === 'CASE_NUMBER')).toBe(true);
    });

    it('should detect contract references', () => {
      const shield = new OpenRedaction({ patterns: ['CONTRACT_REFERENCE'] });
      const result = shield.detect('Contract reference: CNTR-12345678');
      expect(result.detections.some(d => d.type === 'CONTRACT_REFERENCE')).toBe(true);
    });
  });

  describe('Manufacturing patterns', () => {
    it('should detect supplier IDs', () => {
      const shield = new OpenRedaction({ patterns: ['SUPPLIER_ID'] });
      const result = shield.detect('Supplier ID: SUPP-AB12345');
      expect(result.detections.some(d => d.type === 'SUPPLIER_ID')).toBe(true);
    });

    it('should detect part numbers', () => {
      const shield = new OpenRedaction({ patterns: ['PART_NUMBER'] });
      const result = shield.detect('Part number: PN-ABC12345');
      expect(result.detections.some(d => d.type === 'PART_NUMBER')).toBe(true);
    });

    it('should detect purchase order numbers', () => {
      const shield = new OpenRedaction({ patterns: ['PURCHASE_ORDER_NUMBER'] });
      const result = shield.detect('Purchase order: PO-ABC123456');
      expect(result.detections.some(d => d.type === 'PURCHASE_ORDER_NUMBER')).toBe(true);
    });

    it('should detect batch/lot numbers', () => {
      const shield = new OpenRedaction({ patterns: ['BATCH_LOT_NUMBER'] });
      const result = shield.detect('Batch number: BATCH-2024001');
      expect(result.detections.some(d => d.type === 'BATCH_LOT_NUMBER')).toBe(true);
    });
  });

  describe('Transportation patterns', () => {
    it('should detect VINs', () => {
      const shield = new OpenRedaction({ patterns: ['VIN'] });
      const result = shield.detect('VIN: VIN-1HGBH41JXMN109186');
      expect(result.detections.some(d => d.type === 'VIN')).toBe(true);
    });

    it('should detect license plates', () => {
      const shield = new OpenRedaction({ patterns: ['LICENSE_PLATE'] });
      const result = shield.detect('License plate: LICENSE-ABC123');
      expect(result.detections.some(d => d.type === 'LICENSE_PLATE')).toBe(true);
    });

    it('should detect fleet vehicle IDs', () => {
      const shield = new OpenRedaction({ patterns: ['FLEET_VEHICLE_ID'] });
      const result = shield.detect('Fleet vehicle: FLEET-V12345');
      expect(result.detections.some(d => d.type === 'FLEET_VEHICLE_ID')).toBe(true);
    });

    it('should detect driver IDs', () => {
      const shield = new OpenRedaction({ patterns: ['DRIVER_ID'] });
      const result = shield.detect('Driver ID: DRIVER-D12345');
      expect(result.detections.some(d => d.type === 'DRIVER_ID')).toBe(true);
    });
  });

  describe('Media patterns', () => {
    it('should detect interviewee IDs', () => {
      const shield = new OpenRedaction({ patterns: ['INTERVIEWEE_ID'] });
      const result = shield.detect('Interviewee ID: INTV-A12345');
      expect(result.detections.some(d => d.type === 'INTERVIEWEE_ID')).toBe(true);
    });

    it('should detect source IDs', () => {
      const shield = new OpenRedaction({ patterns: ['SOURCE_ID'] });
      const result = shield.detect('Source ID: SOURCE-ABC123');
      expect(result.detections.some(d => d.type === 'SOURCE_ID')).toBe(true);
    });

    it('should detect manuscript IDs', () => {
      const shield = new OpenRedaction({ patterns: ['MANUSCRIPT_ID'] });
      const result = shield.detect('Manuscript ID: MS-2024001');
      expect(result.detections.some(d => d.type === 'MANUSCRIPT_ID')).toBe(true);
    });
  });

  describe('Financial patterns (new)', () => {
    it('should detect UK bank account IBAN', () => {
      const shield = new OpenRedaction({ patterns: ['UK_BANK_ACCOUNT_IBAN'] });
      const result = shield.detect('Account: GB82WEST12345698765432');
      expect(result.detections.some(d => d.type === 'UK_BANK_ACCOUNT_IBAN')).toBe(true);
    });

    it('should detect UK sort code and account number', () => {
      const shield = new OpenRedaction({ patterns: ['UK_SORT_CODE_ACCOUNT'] });
      const result = shield.detect('Account: 12-34-56 12345678');
      expect(result.detections.some(d => d.type === 'UK_SORT_CODE_ACCOUNT')).toBe(true);
    });
  });

  describe('Network/IoT patterns (new)', () => {
    it('should detect IoT serial numbers', () => {
      const shield = new OpenRedaction({ patterns: ['IOT_SERIAL_NUMBER'] });
      const result = shield.detect('Device serial: SN:ABC123456789');
      expect(result.detections.some(d => d.type === 'IOT_SERIAL_NUMBER')).toBe(true);
    });

    it('should detect device UUIDs', () => {
      const shield = new OpenRedaction({ patterns: ['DEVICE_UUID'] });
      const result = shield.detect('Device UUID: 550e8400-e29b-41d4-a716-446655440000');
      expect(result.detections.some(d => d.type === 'DEVICE_UUID')).toBe(true);
    });
  });

  describe('Integration: Multiple industry patterns', () => {
    it('should detect patterns from multiple industries in one text', () => {
      const shield = new OpenRedaction();
      const text = `
        Student S1234567 ordered item ORD-1234567890.
        Claim ID: CLAIM-12345678 for vehicle VIN: VIN-1HGBH41JXMN109186.
        Contact via account ACC-123456789.
      `;

      const result = shield.detect(text);

      expect(result.detections.some(d => d.type === 'STUDENT_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'ORDER_NUMBER')).toBe(true);
      expect(result.detections.some(d => d.type === 'CLAIM_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'VIN')).toBe(true);
      expect(result.detections.some(d => d.type === 'TELECOMS_ACCOUNT_NUMBER')).toBe(true);
    });
  });
});
