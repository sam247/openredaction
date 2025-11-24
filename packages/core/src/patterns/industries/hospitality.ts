/**
 * Hospitality & Tourism Industry PII Patterns
 * For hotels, airlines, travel agencies, and tourism services
 */

import { PIIPattern } from '../../types';

/**
 * Airline Passenger Name Record (PNR)
 * Format: 6 alphanumeric characters
 * Used by airlines for booking references
 */
export const AIRLINE_PNR: PIIPattern = {
  type: 'AIRLINE_PNR',
  regex: /\b(?:PNR|BOOKING|CONFIRMATION)[-\s]?(?:NO|NUM|NUMBER|CODE)?[-\s]?[:#]?\s*([A-Z0-9]{6})\b/gi,
  placeholder: '[PNR_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Airline Passenger Name Record (PNR)',
  validator: (value: string, context: string) => {
    // Must be exactly 6 alphanumeric characters
    if (value.length !== 6) return false;

    // Must have airline/flight context
    return /airline|flight|booking|reservation|pnr|travel|passenger|ticket/i.test(context);
  }
};

/**
 * Hotel Reservation Number
 * Format: Varies by hotel chain (typically alphanumeric)
 * Used for hotel booking confirmations
 */
export const HOTEL_RESERVATION: PIIPattern = {
  type: 'HOTEL_RESERVATION',
  regex: /\b(?:HOTEL|RESERVATION|CONF(?:IRMATION)?|BOOKING)[-\s]?(?:NO|NUM|NUMBER|CODE)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[HOTEL_RES_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Hotel reservation/confirmation number',
  validator: (_value: string, context: string) => {
    return /hotel|reservation|booking|room|accommodation|stay|check[-\s]?in|lodging/i.test(context);
  }
};

/**
 * Frequent Flyer Number
 * Format: Varies by airline (typically numeric or alphanumeric)
 * Used for airline loyalty programs
 */
export const FREQUENT_FLYER_NUMBER: PIIPattern = {
  type: 'FREQUENT_FLYER_NUMBER',
  regex: /\b(?:FREQUENT[- ]?FLYER|FF|MILEAGE|LOYALTY)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[FF_NUM_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Frequent flyer/loyalty program number',
  validator: (_value: string, context: string) => {
    return /frequent[- ]?flyer|miles|mileage|loyalty|rewards|member|airline/i.test(context);
  }
};

/**
 * Hotel Loyalty Number
 * Format: Varies by hotel chain
 * Used for hotel rewards programs (Marriott, Hilton, etc.)
 */
export const HOTEL_LOYALTY_NUMBER: PIIPattern = {
  type: 'HOTEL_LOYALTY_NUMBER',
  regex: /\b(?:MEMBER|LOYALTY|REWARDS)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[HOTEL_LOYALTY_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Hotel loyalty/rewards program number',
  validator: (_value: string, context: string) => {
    return /hotel|marriott|hilton|hyatt|ihg|loyalty|rewards|points|member/i.test(context);
  }
};

/**
 * Cruise Booking Number
 * Format: Alphanumeric
 * Used by cruise lines for reservations
 */
export const CRUISE_BOOKING_NUMBER: PIIPattern = {
  type: 'CRUISE_BOOKING_NUMBER',
  regex: /\b(?:CRUISE|BOOKING|RESERVATION)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[CRUISE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Cruise line booking number',
  validator: (_value: string, context: string) => {
    return /cruise|ship|sailing|voyage|cabin|carnival|royal[- ]?caribbean|norwegian/i.test(context);
  }
};

/**
 * Travel Agency Booking Reference
 * Format: Alphanumeric
 * Used by travel agencies for client bookings
 */
export const TRAVEL_AGENCY_BOOKING: PIIPattern = {
  type: 'TRAVEL_AGENCY_BOOKING',
  regex: /\b(?:TRAVEL|AGENCY|BOOKING|TRIP)[-\s]?(?:REF|REFERENCE|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[TRAVEL_REF_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Travel agency booking reference',
  validator: (_value: string, context: string) => {
    return /travel[- ]?agency|tour|package|itinerary|booking|vacation/i.test(context);
  }
};

/**
 * Rental Car Confirmation
 * Format: Alphanumeric
 * Used by car rental companies (Hertz, Enterprise, etc.)
 */
export const RENTAL_CAR_CONFIRMATION: PIIPattern = {
  type: 'RENTAL_CAR_CONFIRMATION',
  regex: /\b(?:RENTAL|CAR|VEHICLE)[-\s]?(?:CONF(?:IRMATION)?|RESERVATION|BOOKING)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[CAR_RENTAL_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Rental car confirmation number',
  validator: (_value: string, context: string) => {
    return /rental|car|vehicle|hertz|enterprise|avis|budget|rent/i.test(context);
  }
};

/**
 * Theme Park Ticket Number
 * Format: Alphanumeric or numeric
 * Used by theme parks and attractions
 */
export const THEME_PARK_TICKET: PIIPattern = {
  type: 'THEME_PARK_TICKET',
  regex: /\b(?:TICKET|PASS|ADMISSION)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[TICKET_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Theme park or attraction ticket number',
  validator: (value: string, context: string) => {
    // Should be 8+ characters to avoid false positives
    if (value.length < 8) return false;

    return /theme[- ]?park|disney|universal|attraction|admission|ticket|pass|entry/i.test(context);
  }
};

/**
 * TSA PreCheck Number (Known Traveler Number)
 * Format: 9-10 alphanumeric characters
 * Used by US TSA for expedited screening
 */
export const TSA_PRECHECK_NUMBER: PIIPattern = {
  type: 'TSA_PRECHECK_NUMBER',
  regex: /\b(?:TSA|PRECHECK|KTN|KNOWN[- ]?TRAVELER)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{9,10})\b/gi,
  placeholder: '[TSA_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'TSA PreCheck / Known Traveler Number',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 9 || length > 10) return false;

    return /tsa|precheck|pre[- ]?check|ktn|known[- ]?traveler|security|screening/i.test(context);
  }
};

/**
 * Global Entry Number
 * Format: 9 digits (PASS ID)
 * Used for expedited customs/immigration
 */
export const GLOBAL_ENTRY_NUMBER: PIIPattern = {
  type: 'GLOBAL_ENTRY_NUMBER',
  regex: /\b(?:GLOBAL[- ]?ENTRY|PASS[- ]?ID)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{9})\b/gi,
  placeholder: '[GLOBAL_ENTRY_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Global Entry / PASS ID number',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    return /global[- ]?entry|pass[- ]?id|customs|immigration|cbp|trusted[- ]?traveler/i.test(context);
  }
};

// Export all hospitality patterns
export const hospitalityPatterns: PIIPattern[] = [
  AIRLINE_PNR,
  HOTEL_RESERVATION,
  FREQUENT_FLYER_NUMBER,
  HOTEL_LOYALTY_NUMBER,
  CRUISE_BOOKING_NUMBER,
  TRAVEL_AGENCY_BOOKING,
  RENTAL_CAR_CONFIRMATION,
  THEME_PARK_TICKET,
  TSA_PRECHECK_NUMBER,
  GLOBAL_ENTRY_NUMBER
];
