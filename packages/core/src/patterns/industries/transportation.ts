/**
 * Transportation and Automotive Industry PII Patterns
 * For automotive, logistics, transportation services
 */

import { PIIPattern } from '../../types';

/**
 * Vehicle Identification Number (VIN)
 * 17-character alphanumeric code (excludes I, O, Q)
 */
export const VIN: PIIPattern = {
  type: 'VIN',
  regex: /\bVIN[-\s]?[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/gi,
  placeholder: '[VIN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Vehicle Identification Number',
  validator: (value: string) => {
    // VIN is exactly 17 characters, excludes I, O, Q
    return value.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
  }
};

/**
 * License Plate Number
 */
export const LICENSE_PLATE: PIIPattern = {
  type: 'LICENSE_PLATE',
  regex: /\b(?:LICENSE|PLATE|REG(?:ISTRATION)?)[-\s]?(?:NO|NUM(?:BER)?|PLATE)?[-\s]?[:#]?\s*([A-Z0-9]{2,8})\b/gi,
  placeholder: '[PLATE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Vehicle license plate numbers',
  validator: (_value: string, context: string) => {
    return /license|plate|registration|vehicle|car|auto/i.test(context);
  }
};

/**
 * Fleet Vehicle ID
 */
export const FLEET_VEHICLE_ID: PIIPattern = {
  type: 'FLEET_VEHICLE_ID',
  regex: /\b(?:FLEET|VEHICLE)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[FLEET_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Fleet vehicle identification numbers',
  validator: (_value: string, context: string) => {
    return /fleet|vehicle|car|truck|van|unit/i.test(context);
  }
};

/**
 * Telematics Device ID
 */
export const TELEMATICS_DEVICE_ID: PIIPattern = {
  type: 'TELEMATICS_DEVICE_ID',
  regex: /\b(?:TELEMATICS|GPS[-\s]?DEVICE)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{10,16})\b/gi,
  placeholder: '[TELEMATICS_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Telematics and GPS device identifiers',
  validator: (_value: string, context: string) => {
    return /telematics|gps|tracking|device|monitor/i.test(context);
  }
};

/**
 * Booking/Reservation Number
 */
export const BOOKING_NUMBER: PIIPattern = {
  type: 'BOOKING_NUMBER',
  regex: /\b(?:BOOKING|RESERVATION|RES)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[BOOKING_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Transportation booking and reservation numbers',
  validator: (_value: string, context: string) => {
    return /booking|reservation|ticket|travel|flight|train|bus/i.test(context);
  }
};

/**
 * Driver ID
 */
export const DRIVER_ID: PIIPattern = {
  type: 'DRIVER_ID',
  regex: /\bDRIVER[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[DRIVER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Driver identification numbers',
  validator: (_value: string, context: string) => {
    return /driver|operator|chauffeur/i.test(context);
  }
};

/**
 * Shipment Tracking Number
 */
export const SHIPMENT_TRACKING: PIIPattern = {
  type: 'SHIPMENT_TRACKING',
  regex: /\b(?:SHIPMENT|TRACKING)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{10,30})\b/gi,
  placeholder: '[SHIPMENT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Shipment tracking numbers',
  validator: (_value: string, context: string) => {
    return /shipment|tracking|delivery|freight|cargo/i.test(context);
  }
};

/**
 * Toll Tag/Transponder ID
 */
export const TOLL_TAG_ID: PIIPattern = {
  type: 'TOLL_TAG_ID',
  regex: /\b(?:TOLL[-\s]?TAG|E[-]?ZPASS|TRANSPONDER)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[TOLL_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Toll tag and transponder identifiers',
  validator: (_value: string, context: string) => {
    return /toll|tag|ezpass|transponder|fastrak/i.test(context);
  }
};

/**
 * Inspection Certificate Number
 */
export const INSPECTION_CERTIFICATE: PIIPattern = {
  type: 'INSPECTION_CERTIFICATE',
  regex: /\b(?:INSPECTION|INSP)[-\s]?(?:CERT(?:IFICATE)?)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[INSPECTION_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Vehicle inspection certificate numbers',
  validator: (_value: string, context: string) => {
    return /inspection|certificate|safety|emissions|test/i.test(context);
  }
};

/**
 * Odometer Reading Reference
 */
export const ODOMETER_READING_REF: PIIPattern = {
  type: 'ODOMETER_READING_REF',
  regex: /\b(?:ODOMETER|MILEAGE)[-\s]?[:#]?\s*(\d{1,7})\s*(?:KM|MILES|MI)\b/gi,
  placeholder: '[ODO_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Odometer readings',
  validator: (_value: string, context: string) => {
    return /odometer|mileage|miles|km|reading/i.test(context);
  }
};

/**
 * Insurance Policy Number (vehicle-specific)
 */
export const VEHICLE_INSURANCE_POLICY: PIIPattern = {
  type: 'VEHICLE_INSURANCE_POLICY',
  regex: /\b(?:AUTO|VEHICLE|CAR)[-\s]?(?:INSURANCE)?[-\s]?(?:POLICY)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{2,4}\d{6,10})\b/gi,
  placeholder: '[AUTO_POLICY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Vehicle insurance policy numbers',
  validator: (_value: string, context: string) => {
    return /auto|vehicle|car|insurance|policy|coverage/i.test(context);
  }
};

/**
 * Taxi/Rideshare Trip ID
 */
export const TRIP_ID: PIIPattern = {
  type: 'TRIP_ID',
  regex: /\b(?:TRIP|RIDE)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[TRIP_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Trip and ride identification numbers',
  validator: (_value: string, context: string) => {
    return /trip|ride|journey|fare|taxi|uber|lyft/i.test(context);
  }
};

// Export all transportation patterns
export const transportationPatterns: PIIPattern[] = [
  VIN,
  LICENSE_PLATE,
  FLEET_VEHICLE_ID,
  TELEMATICS_DEVICE_ID,
  BOOKING_NUMBER,
  DRIVER_ID,
  SHIPMENT_TRACKING,
  TOLL_TAG_ID,
  INSPECTION_CERTIFICATE,
  ODOMETER_READING_REF,
  VEHICLE_INSURANCE_POLICY,
  TRIP_ID
];
