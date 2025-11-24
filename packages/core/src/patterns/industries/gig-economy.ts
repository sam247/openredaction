/**
 * Gig Economy Platform PII Patterns
 * For rideshare, delivery, freelance, and on-demand service platforms
 */

import { PIIPattern } from '../../types';

/**
 * Uber Trip/Ride ID
 * Format: Alphanumeric (typically UUID or custom format)
 * Used to track individual rides
 */
export const UBER_TRIP_ID: PIIPattern = {
  type: 'UBER_TRIP_ID',
  regex: /\bUBER[-\s]?(?:TRIP|RIDE)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,24})\b/gi,
  placeholder: '[UBER_TRIP_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Uber trip/ride identifier',
  validator: (_value: string, context: string) => {
    return /uber|rideshare|ride|trip|driver|passenger/i.test(context);
  }
};

/**
 * Lyft Ride ID
 * Format: Alphanumeric
 * Used to track individual rides
 */
export const LYFT_RIDE_ID: PIIPattern = {
  type: 'LYFT_RIDE_ID',
  regex: /\bLYFT[-\s]?(?:RIDE|TRIP)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,24})\b/gi,
  placeholder: '[LYFT_RIDE_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Lyft ride identifier',
  validator: (_value: string, context: string) => {
    return /lyft|rideshare|ride|trip|driver|passenger/i.test(context);
  }
};

/**
 * DoorDash Order ID
 * Format: Alphanumeric
 * Used to track food delivery orders
 */
export const DOORDASH_ORDER_ID: PIIPattern = {
  type: 'DOORDASH_ORDER_ID',
  regex: /\b(?:DOORDASH|DD)[-\s]?(?:ORDER|DELIVERY)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,20})\b/gi,
  placeholder: '[DD_ORDER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'DoorDash order identifier',
  validator: (_value: string, context: string) => {
    return /doordash|dasher|delivery|order|food[- ]?delivery/i.test(context);
  }
};

/**
 * Uber Eats Order ID
 * Format: Alphanumeric
 * Used to track food delivery orders
 */
export const UBEREATS_ORDER_ID: PIIPattern = {
  type: 'UBEREATS_ORDER_ID',
  regex: /\bUBER[-\s]?EATS[-\s]?(?:ORDER|DELIVERY)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,20})\b/gi,
  placeholder: '[UE_ORDER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Uber Eats order identifier',
  validator: (_value: string, context: string) => {
    return /uber[- ]?eats|delivery|order|food[- ]?delivery/i.test(context);
  }
};

/**
 * Grubhub Order ID
 * Format: Numeric or alphanumeric
 * Used to track food delivery orders
 */
export const GRUBHUB_ORDER_ID: PIIPattern = {
  type: 'GRUBHUB_ORDER_ID',
  regex: /\bGRUBHUB[-\s]?(?:ORDER)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,20})\b/gi,
  placeholder: '[GH_ORDER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Grubhub order identifier',
  validator: (_value: string, context: string) => {
    return /grubhub|delivery|order|food[- ]?delivery|restaurant/i.test(context);
  }
};

/**
 * Airbnb Reservation ID
 * Format: Alphanumeric (typically 9+ characters)
 * Used to track bookings
 */
export const AIRBNB_RESERVATION_ID: PIIPattern = {
  type: 'AIRBNB_RESERVATION_ID',
  regex: /\bAIRBNB[-\s]?(?:RESERVATION|BOOKING|CONF(?:IRMATION)?)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{9,16})\b/gi,
  placeholder: '[AIRBNB_RES_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Airbnb reservation/booking identifier',
  validator: (_value: string, context: string) => {
    return /airbnb|reservation|booking|host|guest|stay|accommodation/i.test(context);
  }
};

/**
 * Instacart Order ID
 * Format: Numeric or alphanumeric
 * Used to track grocery delivery orders
 */
export const INSTACART_ORDER_ID: PIIPattern = {
  type: 'INSTACART_ORDER_ID',
  regex: /\bINSTACART[-\s]?(?:ORDER|DELIVERY)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,20})\b/gi,
  placeholder: '[IC_ORDER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Instacart order identifier',
  validator: (_value: string, context: string) => {
    return /instacart|shopper|grocery|delivery|order/i.test(context);
  }
};

/**
 * TaskRabbit Task ID
 * Format: Numeric or alphanumeric
 * Used to track service tasks
 */
export const TASKRABBIT_TASK_ID: PIIPattern = {
  type: 'TASKRABBIT_TASK_ID',
  regex: /\b(?:TASKRABBIT|TR)[-\s]?(?:TASK|JOB)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[TR_TASK_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'TaskRabbit task identifier',
  validator: (_value: string, context: string) => {
    return /taskrabbit|tasker|task|job|service|handyman/i.test(context);
  }
};

/**
 * Upwork Job/Contract ID
 * Format: Alphanumeric
 * Used to track freelance projects
 */
export const UPWORK_JOB_ID: PIIPattern = {
  type: 'UPWORK_JOB_ID',
  regex: /\bUPWORK[-\s]?(?:JOB|CONTRACT|PROJECT)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[UW_JOB_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Upwork job/contract identifier',
  validator: (_value: string, context: string) => {
    return /upwork|freelance|contract|job|project|client|proposal/i.test(context);
  }
};

/**
 * Fiverr Order/Gig ID
 * Format: Alphanumeric
 * Used to track freelance orders
 */
export const FIVERR_ORDER_ID: PIIPattern = {
  type: 'FIVERR_ORDER_ID',
  regex: /\bFIVERR[-\s]?(?:ORDER|GIG)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[FV_ORDER_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Fiverr order/gig identifier',
  validator: (_value: string, context: string) => {
    return /fiverr|seller|buyer|gig|order|freelance/i.test(context);
  }
};

/**
 * Postmates Delivery ID
 * Format: Alphanumeric
 * Used to track deliveries
 */
export const POSTMATES_DELIVERY_ID: PIIPattern = {
  type: 'POSTMATES_DELIVERY_ID',
  regex: /\bPOSTMATES[-\s]?(?:DELIVERY|ORDER)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,20})\b/gi,
  placeholder: '[PM_DEL_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Postmates delivery identifier',
  validator: (_value: string, context: string) => {
    return /postmates|delivery|order|courier|food/i.test(context);
  }
};

/**
 * Generic Gig Platform User ID
 * Format: Alphanumeric
 * Catches common gig platform user identifiers
 */
export const GIG_PLATFORM_USER_ID: PIIPattern = {
  type: 'GIG_PLATFORM_USER_ID',
  regex: /\b(?:DRIVER|DASHER|SHOPPER|TASKER|COURIER|RIDER)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[GIG_USER_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Gig economy platform user identifier',
  validator: (_value: string, context: string) => {
    return /driver|dasher|shopper|tasker|courier|rider|delivery|gig[- ]?economy|platform/i.test(context);
  }
};

/**
 * Generic Gig Platform Order/Trip ID
 * Format: Alphanumeric
 * Catches generic order/trip patterns
 */
export const GIG_PLATFORM_ORDER_ID: PIIPattern = {
  type: 'GIG_PLATFORM_ORDER_ID',
  regex: /\b(?:ORDER|TRIP|DELIVERY|BOOKING)[-\s]?[:#]\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[GIG_ORDER_{n}]',
  priority: 65,
  severity: 'medium',
  description: 'Generic gig platform order/trip identifier',
  validator: (value: string, context: string) => {
    // Must have gig platform context
    const hasGigContext = /uber|lyft|doordash|airbnb|instacart|taskrabbit|postmates|grubhub|delivery|rideshare/i.test(context);

    // Should have order/trip related context
    const hasOrderContext = /order|trip|delivery|booking|ride|reservation/i.test(context);

    return hasGigContext && hasOrderContext && value.length >= 8;
  }
};

// Export all gig economy patterns
export const gigEconomyPatterns: PIIPattern[] = [
  UBER_TRIP_ID,
  LYFT_RIDE_ID,
  DOORDASH_ORDER_ID,
  UBEREATS_ORDER_ID,
  GRUBHUB_ORDER_ID,
  AIRBNB_RESERVATION_ID,
  INSTACART_ORDER_ID,
  TASKRABBIT_TASK_ID,
  UPWORK_JOB_ID,
  FIVERR_ORDER_ID,
  POSTMATES_DELIVERY_ID,
  GIG_PLATFORM_USER_ID,
  GIG_PLATFORM_ORDER_ID
];
