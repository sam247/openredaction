/**
 * Financial Services and Banking PII Patterns
 * For financial data protection and compliance
 */

import { PIIPattern } from '../../types';
import { validateIBAN, validateSortCode } from '../../validators';

/**
 * SWIFT/BIC Codes
 * Format: 4 letters (bank) + 2 letters (country) + 2 chars (location) + optional 3 chars (branch)
 */
export const SWIFT_BIC: PIIPattern = {
  type: 'SWIFT_BIC',
  regex: /\b([A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)\b/g,
  placeholder: '[SWIFT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'SWIFT/BIC codes for international transfers',
  validator: (value: string, context: string) => {
    // Normalize separators (though SWIFT codes typically don't have them)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();
    
    // Must be in financial context
    const financialContext = /swift|bic|bank|transfer|wire|international|payment/i.test(context);
    
    // Validate format: 8 or 11 characters after normalization
    const validLength = cleaned.length === 8 || cleaned.length === 11;
    
    // Format: 4 letters (bank) + 2 letters (country) + 2 chars (location) + optional 3 chars (branch)
    const validFormat = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleaned);
    
    return financialContext && validLength && validFormat;
  }
};

/**
 * Transaction IDs - Various formats
 */
export const TRANSACTION_ID: PIIPattern = {
  type: 'TRANSACTION_ID',
  regex: /\b(?:TXN|TX|TRANS(?:ACTION)?)[-\s]?(?:ID|NO|NUM(?:BER)?|REF)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[TXN_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Financial transaction identifiers'
};

/**
 * Investment Account Numbers
 */
export const INVESTMENT_ACCOUNT: PIIPattern = {
  type: 'INVESTMENT_ACCOUNT',
  regex: /\b(?:ISA|SIPP|INV(?:ESTMENT)?|PENSION|401K|IRA)[-\s\u00A0]*(?:ACCOUNT|ACCT|A\/C)?[-\s\u00A0]*(?:NO|NUM(?:BER)?)?[-\s\u00A0.:#]*([A-Z0-9](?:[A-Z0-9][\s\u00A0./-]?){5,18}[A-Z0-9])\b/gi,
  placeholder: '[INV_ACCT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Investment and pension account numbers',
  validator: (value: string, context: string) => {
    const normalized = value.replace(/[\s\u00A0./-]/g, '');
    const hasDigits = /\d{4,}/.test(normalized);
    const validLength = normalized.length >= 6 && normalized.length <= 15;
    const inContext = /isa|sipp|invest|pension|401k|ira|account|fund/i.test(context);
    return hasDigits && validLength && inContext;
  }
};

/**
 * Wire Transfer References
 */
export const WIRE_TRANSFER_REF: PIIPattern = {
  type: 'WIRE_TRANSFER_REF',
  regex: /\b(?:WIRE|TRANSFER|REMITTANCE)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[WIRE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Wire transfer reference numbers'
};

/**
 * Direct Debit Mandate Numbers (UK)
 */
export const DD_MANDATE: PIIPattern = {
  type: 'DD_MANDATE',
  regex: /\b(?:DD|DIRECT[-\s]?DEBIT)[-\s]?(?:MANDATE|REF(?:ERENCE)?|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,18})\b/gi,
  placeholder: '[DD_MANDATE_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Direct Debit mandate reference numbers'
};

/**
 * Cheque Numbers
 */
export const CHEQUE_NUMBER: PIIPattern = {
  type: 'CHEQUE_NUMBER',
  regex: /\b(?:CHE(?:QUE|CK))[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{6,10})\b/gi,
  placeholder: '[CHEQUE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Cheque/check numbers',
  validator: (_value: string, context: string) => {
    return /cheque|check|payment/i.test(context);
  }
};

/**
 * Stock/Share Trading Account Numbers
 */
export const TRADING_ACCOUNT: PIIPattern = {
  type: 'TRADING_ACCOUNT',
  regex: /\b(?:TRADING|BROKERAGE|STOCK)[-\s]?(?:ACCOUNT|ACCT|A\/C)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[TRADE_ACCT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Stock trading and brokerage account numbers'
};

/**
 * Loan Account Numbers
 */
export const LOAN_ACCOUNT: PIIPattern = {
  type: 'LOAN_ACCOUNT',
  regex: /\b(?:LOAN|MORTGAGE|CREDIT)[-\s]?(?:ACCOUNT|ACCT|A\/C)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[LOAN_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Loan and mortgage account numbers'
};

/**
 * Bitcoin Addresses
 * Legacy (P2PKH): 1 + 26-35 base58 chars
 * Script (P2SH): 3 + 26-35 base58 chars
 * SegWit (Bech32): bc1 + 39-59 chars
 */
export const BITCOIN_ADDRESS: PIIPattern = {
  type: 'BITCOIN_ADDRESS',
  regex: /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/g,
  placeholder: '[BTC_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Bitcoin cryptocurrency addresses',
  validator: (value: string, _context: string) => {
    // Basic format validation
    if (value.startsWith('bc1')) {
      // Bech32 format
      return value.length >= 42 && value.length <= 62;
    } else {
      // Base58 format - exclude common false positives
      const hasLowercase = /[a-km-z]/.test(value);
      const hasUppercase = /[A-HJ-NP-Z]/.test(value);
      // More likely to be real if mixed case
      return hasLowercase || hasUppercase;
    }
  }
};

/**
 * Ethereum Addresses
 * Format: 0x + 40 hex characters
 */
export const ETHEREUM_ADDRESS: PIIPattern = {
  type: 'ETHEREUM_ADDRESS',
  regex: /\b(0x[a-fA-F0-9]{40})\b/g,
  placeholder: '[ETH_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ethereum cryptocurrency addresses'
};

/**
 * Litecoin Addresses
 * Format: L or M + 26-34 base58 chars (legacy), ltc1 + 39-59 chars (bech32)
 */
export const LITECOIN_ADDRESS: PIIPattern = {
  type: 'LITECOIN_ADDRESS',
  regex: /\b([LM][a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-z0-9]{39,59})\b/g,
  placeholder: '[LTC_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Litecoin cryptocurrency addresses',
  validator: (value: string, context: string) => {
    const cryptoContext = /crypto|litecoin|ltc|wallet|address/i.test(context);
    return cryptoContext || value.startsWith('ltc1');
  }
};

/**
 * Monero Addresses
 * Format: 4 or 8 + 94 base58 chars
 */
export const MONERO_ADDRESS: PIIPattern = {
  type: 'MONERO_ADDRESS',
  regex: /\b([48][a-km-zA-HJ-NP-Z1-9]{94})\b/g,
  placeholder: '[XMR_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Monero cryptocurrency addresses',
  validator: (value: string, context: string) => {
    const cryptoContext = /crypto|monero|xmr|wallet|address/i.test(context);
    return cryptoContext && value.length === 95;
  }
};

/**
 * Ripple (XRP) Addresses
 * Format: r + 24-34 base58 chars
 */
export const RIPPLE_ADDRESS: PIIPattern = {
  type: 'RIPPLE_ADDRESS',
  regex: /\b(r[a-km-zA-HJ-NP-Z1-9]{24,34})\b/g,
  placeholder: '[XRP_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ripple (XRP) cryptocurrency addresses',
  validator: (value: string, context: string) => {
    const cryptoContext = /crypto|ripple|xrp|wallet|address/i.test(context);
    return cryptoContext && value.length >= 25 && value.length <= 35;
  }
};

/**
 * Cardano Addresses
 * Format: addr1 + 58-104 bech32 chars
 */
export const CARDANO_ADDRESS: PIIPattern = {
  type: 'CARDANO_ADDRESS',
  regex: /\b(addr1[a-z0-9]{58,104})\b/g,
  placeholder: '[ADA_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Cardano (ADA) cryptocurrency addresses'
};

/**
 * Crypto Transaction Hashes
 * Bitcoin/Ethereum: 64 hex characters
 */
export const CRYPTO_TX_HASH: PIIPattern = {
  type: 'CRYPTO_TX_HASH',
  regex: /\b(?:TX|TXID|TRANSACTION[-\s]?HASH)[:\s]+([a-fA-F0-9]{64})\b/gi,
  placeholder: '[CRYPTO_TX_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Cryptocurrency transaction hashes',
  validator: (_value: string, context: string) => {
    return /crypto|bitcoin|ethereum|blockchain|transaction|tx|txid/i.test(context);
  }
};

/**
 * Payment Card Track 1 Data
 * Format: %B + PAN + ^ + Name + ^ + Expiry + Service Code + Discretionary Data + ?
 */
export const CARD_TRACK1_DATA: PIIPattern = {
  type: 'CARD_TRACK1_DATA',
  regex: /%B\d{13,19}\^[^^]+\^\d{4}\d{3}[^?]+\?/g,
  placeholder: '[TRACK1_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Payment card Track 1 magnetic stripe data'
};

/**
 * Payment Card Track 2 Data
 * Format: ;PAN=Expiry+Service Code+Discretionary Data+?
 */
export const CARD_TRACK2_DATA: PIIPattern = {
  type: 'CARD_TRACK2_DATA',
  regex: /;\d{13,19}=\d{4}\d{3}[^?]+\?/g,
  placeholder: '[TRACK2_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Payment card Track 2 magnetic stripe data'
};

/**
 * CVV/CVC in Payment Context
 * 3-4 digits when mentioned with card/payment keywords
 */
export const CVV_IN_CONTEXT: PIIPattern = {
  type: 'CVV_CODE',
  regex: /\b(?:CVV|CVC|CVV2|CID|CSC)[:\s]+(\d{3,4})\b/gi,
  placeholder: '[CVV_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Card verification value (CVV/CVC) codes',
  validator: (value: string, _context: string) => {
    return value.length >= 3 && value.length <= 4;
  }
};

/**
 * Card Expiration Dates in Payment Context
 * Formats: MM/YY, MM/YYYY, MM-YY, MMYY
 */
export const CARD_EXPIRY_IN_CONTEXT: PIIPattern = {
  type: 'CARD_EXPIRY',
  regex: /\b(?:EXP(?:IRY|IRATION)?|VALID\s+THRU)[:\s]+(\d{2}[\/\-]\d{2,4}|\d{4})\b/gi,
  placeholder: '[EXPIRY_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Card expiration dates',
  validator: (value: string, context: string) => {
    const cardContext = /card|payment|credit|debit|visa|mastercard|amex/i.test(context);
    // Validate month if in MM/YY format
    if (value.includes('/') || value.includes('-')) {
      const parts = value.split(/[\/\-]/);
      const month = parseInt(parts[0]);
      return cardContext && month >= 1 && month <= 12;
    }
    return cardContext;
  }
};

/**
 * Stock/Security Ticker Symbols with Trade Details
 * Format: Ticker symbol followed by trade info
 */
export const STOCK_TRADE: PIIPattern = {
  type: 'STOCK_TRADE',
  regex: /\b([A-Z]{1,5})\s+(?:BUY|SELL|SOLD|BOUGHT)\s+(\d+(?:,\d{3})*(?:\.\d{2})?)\s+(?:@|at)\s+\$?(\d+(?:\.\d{2,4})?)\b/gi,
  placeholder: '[TRADE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Stock trade details with ticker, quantity, and price',
  validator: (_value: string, context: string) => {
    return /stock|trade|buy|sell|shares|equity|portfolio/i.test(context);
  }
};

/**
 * Bank Wire Transfer Details
 * Captures wire transfer instructions with account details
 */
export const WIRE_TRANSFER_DETAILS: PIIPattern = {
  type: 'WIRE_TRANSFER_DETAILS',
  regex: /\b(?:WIRE\s+TO|TRANSFER\s+TO|BENEFICIARY)[:\s]+([A-Z0-9\s,.-]{20,100})/gi,
  placeholder: '[WIRE_DETAILS_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Bank wire transfer beneficiary details',
  validator: (_value: string, context: string) => {
    return /wire|transfer|beneficiary|recipient|iban|swift|aba|routing/i.test(context);
  }
};

/**
 * Payment Card Token (from payment gateways)
 */
export const PAYMENT_TOKEN: PIIPattern = {
  type: 'PAYMENT_TOKEN',
  regex: /\b(?:tok|card|pm|src)_[a-zA-Z0-9]{24,}/g,
  placeholder: '[PAY_TOKEN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Payment gateway tokens (Stripe, etc.)'
};

/**
 * Customer ID (from payment gateways)
 */
export const PAYMENT_CUSTOMER_ID: PIIPattern = {
  type: 'PAYMENT_CUSTOMER_ID',
  regex: /\b(cus_[a-zA-Z0-9]{14,})/g,
  placeholder: '[CUST_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Payment gateway customer IDs'
};

/**
 * Subscription ID (from payment gateways)
 */
export const SUBSCRIPTION_ID: PIIPattern = {
  type: 'SUBSCRIPTION_ID',
  regex: /\b(sub_[a-zA-Z0-9]{14,})/g,
  placeholder: '[SUB_ID_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Payment subscription IDs'
};

/**
 * Account Statement References
 */
export const STATEMENT_REF: PIIPattern = {
  type: 'STATEMENT_REF',
  regex: /\b(?:STATEMENT|STMT)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[STMT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Account statement reference numbers'
};

/**
 * Standing Order References
 */
export const STANDING_ORDER_REF: PIIPattern = {
  type: 'STANDING_ORDER_REF',
  regex: /\b(?:STANDING[-\s]?ORDER|SO)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[SO_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Standing order reference numbers'
};

/**
 * Payment Reference Numbers (generic)
 */
export const PAYMENT_REFERENCE: PIIPattern = {
  type: 'PAYMENT_REFERENCE',
  regex: /\b(?:PAYMENT|PAY)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[PAY_REF_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Generic payment reference numbers'
};

/**
 * Card Authorization Codes
 */
export const CARD_AUTH_CODE: PIIPattern = {
  type: 'CARD_AUTH_CODE',
  regex: /\b(?:AUTH(?:ORIZATION)?|APPROVAL)[-\s]?(?:CODE|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[AUTH_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Card authorization codes',
  validator: (_value: string, context: string) => {
    return /payment|card|transaction|auth|approval/i.test(context);
  }
};

/**
 * Merchant ID
 */
export const MERCHANT_ID: PIIPattern = {
  type: 'MERCHANT_ID',
  regex: /\b(?:MERCHANT|MID)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[MERCHANT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Merchant identification numbers',
  validator: (_value: string, context: string) => {
    return /merchant|terminal|pos|payment|processor/i.test(context);
  }
};

/**
 * Terminal ID (POS)
 */
export const TERMINAL_ID: PIIPattern = {
  type: 'TERMINAL_ID',
  regex: /\b(?:TERMINAL|TID|POS)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[TERMINAL_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Point of sale terminal IDs',
  validator: (_value: string, context: string) => {
    return /terminal|pos|point.of.sale|card.reader/i.test(context);
  }
};

/**
 * UK Bank Account Number (IBAN format)
 * Format: GB followed by 2 check digits, 4-letter bank code, and 14-digit account number
 */
export const UK_BANK_ACCOUNT_IBAN: PIIPattern = {
  type: 'UK_BANK_ACCOUNT_IBAN',
  regex: /\b(GB\d{2}[\s\u00A0.-]?[A-Z]{4}[\s\u00A0.-]?\d{14})\b/gi,
  placeholder: '[UK_IBAN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'UK bank account numbers in IBAN format',
  validator: (value: string, context: string) => {
    // Normalize separators
    const cleaned = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();
    
    // Must start with GB and be exactly 22 characters
    if (!cleaned.startsWith('GB') || cleaned.length !== 22) {
      return false;
    }
    
    // Validate with IBAN checksum (MOD-97)
    if (!validateIBAN(cleaned)) {
      return false;
    }
    
    // Must have banking context
    const bankingKeywords = /iban|account|bank|uk|gb|financial|payment|transfer/i;
    if (!bankingKeywords.test(context)) {
      return false;
    }
    
    // Reject test/example keywords
    const rejectKeywords = /example\s+iban|test\s+iban|sample\s+iban|demo\s+iban|fake\s+iban/i;
    if (rejectKeywords.test(context)) {
      return false;
    }
    
    return true;
  }
};

/**
 * UK Sort Code and Account Number Combined
 * Format: XX-XX-XX followed by 8-digit account number
 */
export const UK_SORT_CODE_ACCOUNT: PIIPattern = {
  type: 'UK_SORT_CODE_ACCOUNT',
  regex: /\b(\d{2}[\s\u00A0-]?\d{2}[\s\u00A0-]?\d{2}[\s\u00A0]?\d{8})\b/g,
  placeholder: '[UK_ACCOUNT_{n}]',
  priority: 95,
  severity: 'high',
  description: 'UK sort code and account number combination',
  validator: (value: string, context: string) => {
    // Normalize separators
    const cleaned = value.replace(/[\s\u00A0.-]/g, '');
    
    // Must be exactly 14 digits (6 for sort code + 8 for account)
    if (!/^\d{14}$/.test(cleaned)) {
      return false;
    }
    
    // Extract sort code (first 6 digits) and account number (last 8 digits)
    const sortCode = cleaned.substring(0, 6);
    const accountNumber = cleaned.substring(6);

    // Validate account number length (8 digits)
    if (accountNumber.length !== 8) {
      return false;
    }
    
    // Validate sort code format
    if (!validateSortCode(sortCode)) {
      return false;
    }
    
    // Must have banking context
    const bankingKeywords = /sort\s+code|account|bank|uk|gb|financial|payment|transfer/i;
    if (!bankingKeywords.test(context)) {
      return false;
    }
    
    // Reject test/example keywords
    const rejectKeywords = /example\s+account|test\s+account|sample\s+account|demo\s+account|fake\s+account/i;
    if (rejectKeywords.test(context)) {
      return false;
    }
    
    return true;
  }
};

// Export all financial patterns
export const financialPatterns: PIIPattern[] = [
  SWIFT_BIC,
  TRANSACTION_ID,
  INVESTMENT_ACCOUNT,
  WIRE_TRANSFER_REF,
  WIRE_TRANSFER_DETAILS,
  DD_MANDATE,
  CHEQUE_NUMBER,
  TRADING_ACCOUNT,
  LOAN_ACCOUNT,
  BITCOIN_ADDRESS,
  ETHEREUM_ADDRESS,
  LITECOIN_ADDRESS,
  MONERO_ADDRESS,
  RIPPLE_ADDRESS,
  CARDANO_ADDRESS,
  CRYPTO_TX_HASH,
  CARD_TRACK1_DATA,
  CARD_TRACK2_DATA,
  CVV_IN_CONTEXT,
  CARD_EXPIRY_IN_CONTEXT,
  STOCK_TRADE,
  PAYMENT_TOKEN,
  PAYMENT_CUSTOMER_ID,
  SUBSCRIPTION_ID,
  STATEMENT_REF,
  STANDING_ORDER_REF,
  PAYMENT_REFERENCE,
  CARD_AUTH_CODE,
  MERCHANT_ID,
  TERMINAL_ID,
  UK_BANK_ACCOUNT_IBAN,
  UK_SORT_CODE_ACCOUNT
];
