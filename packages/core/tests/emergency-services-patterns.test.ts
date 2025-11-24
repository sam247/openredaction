/**
 * Tests for Emergency Services patterns
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Emergency Services Pattern Detection', () => {
  describe('Emergency Call Reference', () => {
    it('should detect emergency call reference', () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_CALL_REF'] });
      const result = detector.detect('911 Call Reference: EMERGENCY-2024-123456');
      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(true);
    });

    it('should detect CAD incident number', () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_CALL_REF'] });
      const result = detector.detect('CAD incident: CAD-20241124-0001');
      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(true);
    });

    it('should require emergency context', () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_CALL_REF'] });
      const result = detector.detect('Event: EVENT-123456');
      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(false);
    });
  });

  describe('Police Report Number', () => {
    it('should detect police report number', () => {
      const detector = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });
      const result = detector.detect('Police Report: PR-2024-0012345');
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
    });

    it('should detect case number', () => {
      const detector = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });
      const result = detector.detect('Case number: CASE-20241124');
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
    });

    it('should require police context', () => {
      const detector = new OpenRedaction({ patterns: ['POLICE_REPORT_NUMBER'] });
      const result = detector.detect('Report number: 2024-123456');
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(false);
    });
  });

  describe('Fire Incident Number', () => {
    it('should detect fire incident number', () => {
      const detector = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });
      const result = detector.detect('Fire Department incident: FI-2024-00123');
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
    });

    it('should detect FD incident with various formats', () => {
      const detector = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });
      const result = detector.detect('Fire alarm: FIRE-12345678');
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
    });

    it('should require fire context', () => {
      const detector = new OpenRedaction({ patterns: ['FIRE_INCIDENT_NUMBER'] });
      const result = detector.detect('Incident: FI-123456');
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(false);
    });
  });

  describe('Ambulance Call ID', () => {
    it('should detect ambulance call ID', () => {
      const detector = new OpenRedaction({ patterns: ['AMBULANCE_CALL_ID'] });
      const result = detector.detect('Ambulance call: AMB-2024-12345');
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(true);
    });

    it('should detect EMS call reference', () => {
      const detector = new OpenRedaction({ patterns: ['AMBULANCE_CALL_ID'] });
      const result = detector.detect('EMS transport: EMS123456789');
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(true);
    });

    it('should require ambulance/EMS context', () => {
      const detector = new OpenRedaction({ patterns: ['AMBULANCE_CALL_ID'] });
      const result = detector.detect('Call: AMB-123456');
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(false);
    });
  });

  describe('Paramedic Certification', () => {
    it('should detect NREMT certification', () => {
      const detector = new OpenRedaction({ patterns: ['PARAMEDIC_CERTIFICATION'] });
      const result = detector.detect('NREMT-P certification: NREMT-P-123456');
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(true);
    });

    it('should detect EMT license', () => {
      const detector = new OpenRedaction({ patterns: ['PARAMEDIC_CERTIFICATION'] });
      const result = detector.detect('EMT license: EMT-B-CA-123456');
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(true);
    });

    it('should require certification context', () => {
      const detector = new OpenRedaction({ patterns: ['PARAMEDIC_CERTIFICATION'] });
      const result = detector.detect('ID number: 123456');
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(false);
    });
  });

  describe('Emergency Shelter ID', () => {
    it('should detect emergency shelter registration', () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_SHELTER_ID'] });
      const result = detector.detect('Emergency shelter registration: SHELTER-A-12345');
      expect(result.detections.some(d => d.type === 'EMERGENCY_SHELTER_ID')).toBe(true);
    });

    it('should detect evacuation ID', () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_SHELTER_ID'] });
      const result = detector.detect('Evacuation center: EVACUATION-2024-001');
      expect(result.detections.some(d => d.type === 'EMERGENCY_SHELTER_ID')).toBe(true);
    });

    it('should require shelter/evacuation context', () => {
      const detector = new OpenRedaction({ patterns: ['EMERGENCY_SHELTER_ID'] });
      const result = detector.detect('ID number: REG-12345');
      expect(result.detections.some(d => d.type === 'EMERGENCY_SHELTER_ID')).toBe(false);
    });
  });

  describe('Disaster Victim ID', () => {
    it('should detect disaster victim identification', () => {
      const detector = new OpenRedaction({ patterns: ['DISASTER_VICTIM_ID'] });
      const result = detector.detect('DVI number: DVI-2024-00123');
      expect(result.detections.some(d => d.type === 'DISASTER_VICTIM_ID')).toBe(true);
    });

    it('should detect victim ID', () => {
      const detector = new OpenRedaction({ patterns: ['DISASTER_VICTIM_ID'] });
      const result = detector.detect('Disaster victim: VICTIM-20240001');
      expect(result.detections.some(d => d.type === 'DISASTER_VICTIM_ID')).toBe(true);
    });

    it('should require disaster/victim context', () => {
      const detector = new OpenRedaction({ patterns: ['DISASTER_VICTIM_ID'] });
      const result = detector.detect('ID: DVI-123456');
      expect(result.detections.some(d => d.type === 'DISASTER_VICTIM_ID')).toBe(false);
    });
  });

  describe('Search and Rescue Mission ID', () => {
    it('should detect SAR mission ID', () => {
      const detector = new OpenRedaction({ patterns: ['SEARCH_RESCUE_MISSION_ID'] });
      const result = detector.detect('SAR mission: SAR-2024-001');
      expect(result.detections.some(d => d.type === 'SEARCH_RESCUE_MISSION_ID')).toBe(true);
    });

    it('should detect rescue operation', () => {
      const detector = new OpenRedaction({ patterns: ['SEARCH_RESCUE_MISSION_ID'] });
      const result = detector.detect('Search and rescue: RESCUE-123456789');
      expect(result.detections.some(d => d.type === 'SEARCH_RESCUE_MISSION_ID')).toBe(true);
    });

    it('should require SAR context', () => {
      const detector = new OpenRedaction({ patterns: ['SEARCH_RESCUE_MISSION_ID'] });
      const result = detector.detect('Mission: SAR-123');
      expect(result.detections.some(d => d.type === 'SEARCH_RESCUE_MISSION_ID')).toBe(false);
    });
  });

  describe('Missing Person Case', () => {
    it('should detect missing person case number', () => {
      const detector = new OpenRedaction({ patterns: ['MISSING_PERSON_CASE'] });
      const result = detector.detect('Missing person case: MP-2024-00123');
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(true);
    });

    it('should detect AMBER alert', () => {
      const detector = new OpenRedaction({ patterns: ['MISSING_PERSON_CASE'] });
      const result = detector.detect('AMBER Alert: AMBER-20240123');
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(true);
    });

    it('should require missing/alert context', () => {
      const detector = new OpenRedaction({ patterns: ['MISSING_PERSON_CASE'] });
      const result = detector.detect('Case: MP-123456');
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(false);
    });
  });

  describe('Hazmat Incident', () => {
    it('should detect hazmat incident number', () => {
      const detector = new OpenRedaction({ patterns: ['HAZMAT_INCIDENT'] });
      const result = detector.detect('Hazmat incident: HAZMAT-2024-001');
      expect(result.detections.some(d => d.type === 'HAZMAT_INCIDENT')).toBe(true);
    });

    it('should detect HM incident', () => {
      const detector = new OpenRedaction({ patterns: ['HAZMAT_INCIDENT'] });
      const result = detector.detect('Chemical spill: HM-123456789');
      expect(result.detections.some(d => d.type === 'HAZMAT_INCIDENT')).toBe(true);
    });

    it('should require hazmat context', () => {
      const detector = new OpenRedaction({ patterns: ['HAZMAT_INCIDENT'] });
      const result = detector.detect('Incident: HM-123456');
      expect(result.detections.some(d => d.type === 'HAZMAT_INCIDENT')).toBe(false);
    });
  });

  describe('Integration: Multiple Emergency Services', () => {
    it('should detect multiple emergency service identifiers', () => {
      const detector = new OpenRedaction();
      const text = `
        Emergency 911 call: EMERGENCY-2024-123456
        Police report number: PR-2024-0012345
        Fire incident: FI-2024-00123
        Ambulance transport: AMB-2024-12345
        Paramedic cert: NREMT-P-123456
        Missing person: MP-2024-00123
      `;

      const result = detector.detect(text);

      expect(result.detections.some(d => d.type === 'EMERGENCY_CALL_REF')).toBe(true);
      expect(result.detections.some(d => d.type === 'POLICE_REPORT_NUMBER')).toBe(true);
      expect(result.detections.some(d => d.type === 'FIRE_INCIDENT_NUMBER')).toBe(true);
      expect(result.detections.some(d => d.type === 'AMBULANCE_CALL_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'PARAMEDIC_CERTIFICATION')).toBe(true);
      expect(result.detections.some(d => d.type === 'MISSING_PERSON_CASE')).toBe(true);
    });
  });
});
