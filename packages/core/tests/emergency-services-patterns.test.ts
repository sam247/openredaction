/**
 * Tests for Emergency Services patterns
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Emergency Services Pattern Detection', () => {
  describe('Emergency Call Reference', () => {
    it('should detect emergency call reference', async () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_CALL_REF'] });
      const result = await detector.detect('911 Call Reference: EMERGENCY-2024-123456');
      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(true);
    });

    it('should detect CAD incident number', async () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_CALL_REF'] });
      const result = await detector.detect('CAD incident: CAD-20241124-0001');
      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(true);
    });

    it('should require emergency context', async () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_CALL_REF'] });
      const result = await detector.detect('Event: EVENT-123456');
      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(false);
    });
  });

  describe('Police Report Number', () => {
    it('should detect police report number', async () => {
      const detector = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });
      const result = await detector.detect('Police Report: PR-2024-0012345');
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
    });

    it('should detect case number', async () => {
      const detector = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });
      const result = await detector.detect('Case number: CASE-20241124');
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
    });

    it('should require police context', async () => {
      const detector = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });
      const result = await detector.detect('Report number: 2024-123456');
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(false);
    });
  });

  describe('Fire Incident Number', () => {
    it('should detect fire incident number', async () => {
      const detector = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });
      const result = await detector.detect('Fire Department incident: FI-2024-00123');
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
    });

    it('should detect FD incident with various formats', async () => {
      const detector = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });
      const result = await detector.detect('Fire alarm: FIRE-12345678');
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
    });

    it('should require fire context', async () => {
      const detector = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });
      const result = await detector.detect('Incident: FI-123456');
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(false);
    });
  });

  describe('Ambulance Call ID', () => {
    it('should detect ambulance call ID', async () => {
      const detector = new OpenRedaction({ patterns: ['AMBULANCE_CALL_ID'] });
      const result = await detector.detect('Ambulance call: AMB-2024-12345');
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(true);
    });

    it('should detect EMS call reference', async () => {
      const detector = new OpenRedaction({ patterns: ['AMBULANCE_CALL_ID'] });
      const result = await detector.detect('EMS transport: EMS123456789');
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(true);
    });

    it('should require ambulance/EMS context', async () => {
      const detector = new OpenRedaction({ patterns: ['AMBULANCE_CALL_ID'] });
      const result = await detector.detect('Call: AMB-123456');
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(false);
    });
  });

  describe('Paramedic Certification', () => {
    it('should detect NREMT certification', async () => {
      const detector = new OpenRedaction({ patterns: ['PARAMEDIC_CERTIFICATION'] });
      const result = await detector.detect('NREMT-P certification: NREMT-P-123456');
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(true);
    });

    it('should detect EMT license', async () => {
      const detector = new OpenRedaction({ patterns: ['PARAMEDIC_CERTIFICATION'] });
      const result = await detector.detect('EMT license: EMT-B-CA-123456');
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(true);
    });

    it('should require certification context', async () => {
      const detector = new OpenRedaction({ patterns: ['PARAMEDIC_CERTIFICATION'] });
      const result = await detector.detect('ID number: 123456');
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(false);
    });
  });

  describe('Emergency Shelter ID', () => {
    it('should detect emergency shelter registration', async () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_SHELTER_ID'] });
      const result = await detector.detect('Emergency shelter registration: SHELTER-A-12345');
      expect(result.detections.some(d => d.type === 'EMERGENCY_SHELTER_ID')).toBe(true);
    });

    it('should detect evacuation ID', async () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_SHELTER_ID'] });
      const result = await detector.detect('Evacuation center: EVACUATION-2024-001');
      expect(result.detections.some(d => d.type === 'EMERGENCY_SHELTER_ID')).toBe(true);
    });

    it('should require shelter/evacuation context', async () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_SHELTER_ID'] });
      const result = await detector.detect('ID number: REG-12345');
      expect(result.detections.some(d => d.type === 'EMERGENCY_SHELTER_ID')).toBe(false);
    });
  });

  describe('Disaster Victim ID', () => {
    it('should detect disaster victim identification', async () => {
      const detector = new OpenRedaction({ patterns: ['DISASTER_VICTIM_ID'] });
      const result = await detector.detect('DVI number: DVI-2024-00123');
      expect(result.detections.some(d => d.type === 'DISASTER_VICTIM_ID')).toBe(true);
    });

    it('should detect victim ID', async () => {
      const detector = new OpenRedaction({ patterns: ['DISASTER_VICTIM_ID'] });
      const result = await detector.detect('Disaster victim: VICTIM-20240001');
      expect(result.detections.some(d => d.type === 'DISASTER_VICTIM_ID')).toBe(true);
    });

    it('should require disaster/victim context', async () => {
      const detector = new OpenRedaction({ patterns: ['DISASTER_VICTIM_ID'] });
      const result = await detector.detect('ID: DVI-123456');
      expect(result.detections.some(d => d.type === 'DISASTER_VICTIM_ID')).toBe(false);
    });
  });

  describe('Search and Rescue Mission ID', () => {
    it('should detect SAR mission ID', async () => {
      const detector = new OpenRedaction({ patterns: ['SEARCH_RESCUE_MISSION_ID'] });
      const result = await detector.detect('SAR mission: SAR-2024-001');
      expect(result.detections.some(d => d.type === 'SEARCH_RESCUE_MISSION_ID')).toBe(true);
    });

    it('should detect rescue operation', async () => {
      const detector = new OpenRedaction({ patterns: ['SEARCH_RESCUE_MISSION_ID'] });
      const result = await detector.detect('Search and rescue: RESCUE-123456789');
      expect(result.detections.some(d => d.type === 'SEARCH_RESCUE_MISSION_ID')).toBe(true);
    });

    it('should require SAR context', async () => {
      const detector = new OpenRedaction({ patterns: ['SEARCH_RESCUE_MISSION_ID'] });
      const result = await detector.detect('Mission: SAR-123');
      expect(result.detections.some(d => d.type === 'SEARCH_RESCUE_MISSION_ID')).toBe(false);
    });
  });

  describe('Missing Person Case', () => {
    it('should detect missing person case number', async () => {
      const detector = new OpenRedaction({ patterns: ['MISSING_PERSON_CASE'] });
      const result = await detector.detect('Missing person case: MP-2024-00123');
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(true);
    });

    it('should detect AMBER alert', async () => {
      const detector = new OpenRedaction({ patterns: ['MISSING_PERSON_CASE'] });
      const result = await detector.detect('AMBER Alert: AMBER-20240123');
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(true);
    });

    it('should require missing/alert context', async () => {
      const detector = new OpenRedaction({ patterns: ['MISSING_PERSON_CASE'] });
      const result = await detector.detect('Case: MP-123456');
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(false);
    });
  });

  describe('Hazmat Incident', () => {
    it('should detect hazmat incident number', async () => {
      const detector = new OpenRedaction({ patterns: ['HAZMAT_INCIDENT'] });
      const result = await detector.detect('Hazmat incident: HAZMAT-2024-001');
      expect(result.detections.some(d => d.type === 'HAZMAT_INCIDENT')).toBe(true);
    });

    it('should detect HM incident', async () => {
      const detector = new OpenRedaction({ patterns: ['HAZMAT_INCIDENT'] });
      const result = await detector.detect('Chemical spill: HM-123456789');
      expect(result.detections.some(d => d.type === 'HAZMAT_INCIDENT')).toBe(true);
    });

    it('should require hazmat context', async () => {
      const detector = new OpenRedaction({ patterns: ['HAZMAT_INCIDENT'] });
      const result = await detector.detect('Incident: HM-123456');
      expect(result.detections.some(d => d.type === 'HAZMAT_INCIDENT')).toBe(false);
    });
  });

  describe('Integration: Multiple Emergency Services', () => {
    it('should detect multiple emergency service identifiers', async () => {
      const detector = new OpenRedaction();
      const text = `
        Emergency 911 call: EMERGENCY-2024-123456
        Police report number: PR-2024-0012345
        Fire incident: FI-2024-00123
        Ambulance transport: AMB-2024-12345
        Paramedic cert: NREMT-P-123456
        Missing person: MP-2024-00123
      `;

      const result = await detector.detect(text);

      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(true);
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(true);
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(true);
    });
  });
});
