/**
 * Aviation Industry Identifiers
 * IATA codes, flight numbers, aircraft identifiers
 */

import type { PIIPattern } from '../../types';

/**
 * IATA Airport Code
 * Format: 3 letters (e.g., JFK, LAX, LHR)
 */
export const IATA_AIRPORT_CODE: PIIPattern = {
  type: 'IATA_AIRPORT_CODE',
  regex: /\b(?:AIRPORT|FROM|TO|VIA|IATA)[-\s]?(?:CODE)?[-\s]?[:#]?\s*([A-Z]{3})\b/gi,
  placeholder: '[AIRPORT_{n}]',
  priority: 75,
  severity: 'low',
  description: 'IATA Airport Code',
  validator: (_value: string, context: string) => {
    return /airport|iata|flight|departure|arrival|terminal/i.test(context);
  }
};

/**
 * Flight Number
 * Format: 2-3 letter airline code + 1-4 digits (e.g., AA123, BA4567)
 */
export const FLIGHT_NUMBER: PIIPattern = {
  type: 'FLIGHT_NUMBER',
  regex: /\b(?:FLIGHT|FLT)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2,3}\s?\d{1,4})\b/gi,
  placeholder: '[FLIGHT_{n}]',
  priority: 80,
  severity: 'low',
  description: 'Flight Number',
  validator: (value: string, context: string) => {
    const clean = value.replace(/\s/g, '');
    // Airline code (2-3 letters) + flight number (1-4 digits)
    if (!/^[A-Z]{2,3}\d{1,4}$/.test(clean)) return false;

    return /flight|airline|departure|arrival|boarding|gate/i.test(context);
  }
};

/**
 * Aircraft Tail Number (N-Number for US)
 * Format: N followed by 1-5 alphanumeric characters
 */
export const AIRCRAFT_TAIL_NUMBER: PIIPattern = {
  type: 'AIRCRAFT_TAIL_NUMBER',
  regex: /\b(N[1-9][0-9]{0,4}[A-Z]{0,2})\b/g,
  placeholder: '[TAIL_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Aircraft Tail Number (US N-Number)',
  validator: (value: string, _context: string) => {
    // US tail numbers start with N
    if (!value.startsWith('N')) return false;
    // Length between 2-6 characters
    if (value.length < 2 || value.length > 6) return false;
    // Cannot start with N0
    if (value[1] === '0') return false;

    return true;
  }
};

/**
 * International Aircraft Registration
 * Format: Country prefix (1-2 letters) + alphanumeric
 */
export const AIRCRAFT_REGISTRATION: PIIPattern = {
  type: 'AIRCRAFT_REGISTRATION',
  regex: /\b(?:REGISTRATION|REG|TAIL)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{1,2}-[A-Z0-9]{3,5})\b/gi,
  placeholder: '[AIRCRAFT_REG_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'International Aircraft Registration',
  validator: (_value: string, context: string) => {
    return /aircraft|plane|aviation|registration|tail\s?number/i.test(context);
  }
};

/**
 * FAA Airman Certificate Number
 * Format: 7-8 digits
 */
export const FAA_AIRMAN_CERTIFICATE: PIIPattern = {
  type: 'FAA_AIRMAN_CERTIFICATE',
  regex: /\b(?:FAA|AIRMAN|PILOT)[-\s]?(?:CERT(?:IFICATE)?|LICENSE)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{7,8})\b/gi,
  placeholder: '[FAA_CERT_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'FAA Airman Certificate Number',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 7 && len !== 8) return false;

    return /faa|airman|pilot|certificate|license|aviation/i.test(context);
  }
};

/**
 * ICAO Aircraft Type Designator
 * Format: 2-4 characters (e.g., B738, A320, B77W)
 */
export const ICAO_AIRCRAFT_TYPE: PIIPattern = {
  type: 'ICAO_AIRCRAFT_TYPE',
  regex: /\b(?:AIRCRAFT|TYPE|ICAO)[-\s]?(?:CODE|DESIGNATOR)?[-\s]?[:#]?\s*([A-Z][0-9][A-Z0-9]{1,2})\b/gi,
  placeholder: '[AIRCRAFT_TYPE_{n}]',
  priority: 70,
  severity: 'low',
  description: 'ICAO Aircraft Type Designator',
  validator: (_value: string, context: string) => {
    return /aircraft|type|icao|model|boeing|airbus/i.test(context);
  }
};

/**
 * Aircraft Mode S Code (24-bit ICAO address)
 * Format: 6 hexadecimal characters
 */
export const AIRCRAFT_MODE_S: PIIPattern = {
  type: 'AIRCRAFT_MODE_S',
  regex: /\b(?:MODE\s?S|ICAO\s?ADDRESS)[-\s]?[:#]?\s*([A-F0-9]{6})\b/gi,
  placeholder: '[MODE_S_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Aircraft Mode S Code (ICAO 24-bit address)',
  validator: (value: string, context: string) => {
    if (value.length !== 6) return false;
    if (!/^[A-F0-9]{6}$/i.test(value)) return false;

    return /mode\s?s|icao|aircraft|transponder|adsb/i.test(context);
  }
};

/**
 * Airline Booking Reference (PNR/Locator)
 * Format: 6 alphanumeric characters
 */
export const AIRLINE_BOOKING_REFERENCE: PIIPattern = {
  type: 'AIRLINE_BOOKING_REFERENCE',
  regex: /\b(?:BOOKING|RESERVATION|LOCATOR|REFERENCE)[-\s]?(?:CODE|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6})\b/gi,
  placeholder: '[BOOKING_REF_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Airline Booking Reference/Locator',
  validator: (_value: string, context: string) => {
    return /booking|reservation|locator|reference|pnr|airline|flight/i.test(context);
  }
};

/**
 * IATA Airline Code
 * Format: 2 letters (e.g., AA, BA, DL)
 */
export const IATA_AIRLINE_CODE: PIIPattern = {
  type: 'IATA_AIRLINE_CODE',
  regex: /\b(?:AIRLINE|CARRIER)[-\s]?(?:CODE|IATA)?[-\s]?[:#]?\s*([A-Z]{2})\b/gi,
  placeholder: '[AIRLINE_{n}]',
  priority: 70,
  severity: 'low',
  description: 'IATA Airline Code',
  validator: (_value: string, context: string) => {
    return /airline|carrier|iata|flight|aviation/i.test(context);
  }
};

export const aviationPatterns: PIIPattern[] = [
  IATA_AIRPORT_CODE,
  FLIGHT_NUMBER,
  AIRCRAFT_TAIL_NUMBER,
  AIRCRAFT_REGISTRATION,
  FAA_AIRMAN_CERTIFICATE,
  ICAO_AIRCRAFT_TYPE,
  AIRCRAFT_MODE_S,
  AIRLINE_BOOKING_REFERENCE,
  IATA_AIRLINE_CODE
];
