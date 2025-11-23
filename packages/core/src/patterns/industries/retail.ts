/**
 * Retail and E-Commerce Industry PII Patterns
 * For online/offline retail, order management, customer loyalty programs
 */

import { PIIPattern } from '../../types';

/**
 * Order Number
 */
export const ORDER_NUMBER: PIIPattern = {
  type: 'ORDER_NUMBER',
  regex: /\bORD(?:ER)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{8,14})\b/gi,
  placeholder: '[ORDER_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'E-commerce order numbers'
};

/**
 * Loyalty Card Number
 */
export const LOYALTY_CARD_NUMBER: PIIPattern = {
  type: 'LOYALTY_CARD_NUMBER',
  regex: /\bLOYALTY[-\s]?(?:CARD)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{10,16})\b/gi,
  placeholder: '[LOYALTY_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Customer loyalty card numbers',
  validator: (_value: string, context: string) => {
    return /loyalty|rewards|points|membership|customer/i.test(context);
  }
};

/**
 * Customer ID
 */
export const CUSTOMER_ID: PIIPattern = {
  type: 'CUSTOMER_ID',
  regex: /\b(?:CUSTOMER|CUST)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[CUSTOMER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Customer identification numbers',
  validator: (_value: string, context: string) => {
    return /customer|account|profile|user|buyer/i.test(context);
  }
};

/**
 * Device ID/Tag (for inventory or customer devices)
 */
export const DEVICE_ID_TAG: PIIPattern = {
  type: 'DEVICE_ID_TAG',
  regex: /\bDEVID:([A-F0-9]{16})\b/gi,
  placeholder: '[DEVICE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Device identification tags'
};

/**
 * Gift Card Numbers
 */
export const GIFT_CARD_NUMBER: PIIPattern = {
  type: 'GIFT_CARD_NUMBER',
  regex: /\b(?:GIFT[-\s]?CARD|GC)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{12,19})\b/gi,
  placeholder: '[GIFTCARD_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Gift card numbers',
  validator: (_value: string, context: string) => {
    return /gift|card|voucher|coupon|certificate/i.test(context);
  }
};

/**
 * Return/RMA Number
 */
export const RMA_NUMBER: PIIPattern = {
  type: 'RMA_NUMBER',
  regex: /\b(?:RMA|RETURN)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[RMA_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Return merchandise authorization numbers',
  validator: (_value: string, context: string) => {
    return /rma|return|refund|exchange|merchandise/i.test(context);
  }
};

/**
 * Shipping Tracking Number
 */
export const SHIPPING_TRACKING: PIIPattern = {
  type: 'SHIPPING_TRACKING',
  regex: /\b(?:TRACKING|TRACK)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{10,30})\b/gi,
  placeholder: '[TRACKING_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Shipping and delivery tracking numbers',
  validator: (_value: string, context: string) => {
    return /tracking|shipment|delivery|package|parcel|courier/i.test(context);
  }
};

/**
 * Invoice Number
 */
export const INVOICE_NUMBER: PIIPattern = {
  type: 'INVOICE_NUMBER',
  regex: /\b(?:INVOICE|INV)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[INVOICE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Invoice numbers',
  validator: (_value: string, context: string) => {
    return /invoice|bill|payment|receipt|purchase/i.test(context);
  }
};

/**
 * Shopping Cart Session ID
 */
export const CART_SESSION_ID: PIIPattern = {
  type: 'CART_SESSION_ID',
  regex: /\b(?:CART|SESSION)[-\s]?(?:ID)?[-\s]?[:#]?\s*([a-f0-9]{32,64})\b/gi,
  placeholder: '[CART_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Shopping cart session identifiers',
  validator: (_value: string, context: string) => {
    return /cart|session|basket|checkout/i.test(context);
  }
};

/**
 * Coupon/Promo Code
 */
export const PROMO_CODE: PIIPattern = {
  type: 'PROMO_CODE',
  regex: /\b(?:PROMO|COUPON|DISCOUNT)[-\s]?(?:CODE)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[PROMO_{n}]',
  priority: 65,
  severity: 'low',
  description: 'Promotional and coupon codes',
  validator: (_value: string, context: string) => {
    return /promo|coupon|discount|code|voucher|offer/i.test(context);
  }
};

/**
 * Wishlist ID
 */
export const WISHLIST_ID: PIIPattern = {
  type: 'WISHLIST_ID',
  regex: /\b(?:WISHLIST|WISH[-\s]?LIST)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[WISHLIST_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Customer wishlist identifiers',
  validator: (_value: string, context: string) => {
    return /wishlist|wish|list|saved|favorite/i.test(context);
  }
};

/**
 * Product SKU (when combined with customer data)
 */
export const PRODUCT_SKU: PIIPattern = {
  type: 'PRODUCT_SKU',
  regex: /\bSKU[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[SKU_{n}]',
  priority: 60,
  severity: 'low',
  description: 'Product stock keeping units'
};

// Export all retail patterns
export const retailPatterns: PIIPattern[] = [
  ORDER_NUMBER,
  LOYALTY_CARD_NUMBER,
  CUSTOMER_ID,
  DEVICE_ID_TAG,
  GIFT_CARD_NUMBER,
  RMA_NUMBER,
  SHIPPING_TRACKING,
  INVOICE_NUMBER,
  CART_SESSION_ID,
  PROMO_CODE,
  WISHLIST_ID,
  PRODUCT_SKU
];
