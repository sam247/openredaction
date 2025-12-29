/**
 * Extended Cryptocurrency Address Patterns
 * Additional Layer-1 blockchain addresses beyond BTC, ETH, LTC
 */

import { PIIPattern } from '../../types';

/**
 * Solana (SOL) Address
 * Format: Base58, 32-44 characters
 * Starts with 1-9 or A-H
 */
export const SOLANA_ADDRESS: PIIPattern = {
  type: 'SOLANA_ADDRESS',
  regex: /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g,
  placeholder: '[SOL_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Solana (SOL) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace that might have been introduced)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '');
    
    // Length validation
    if (cleaned.length < 32 || cleaned.length > 44) return false;

    // Must have crypto/Solana context (enhanced keywords)
    const cryptoKeywords = /solana|sol\b|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }

    // Exclude other crypto formats
    if (/^(bc1|1|3|0x|L|M|D|X|r|cosmos|tz|addr)/.test(cleaned)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    // Base58 validation (Solana uses Base58 encoding)
    // Valid Base58 characters: 1-9, A-H, J-N, P-Z, a-k, m-z (excludes 0, O, I, l)
    if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(cleaned)) {
      return false;
    }

    return true;
  }
};

/**
 * Polkadot (DOT) Address
 * Format: SS58 format, starts with 1
 * 47-48 characters
 */
export const POLKADOT_ADDRESS: PIIPattern = {
  type: 'POLKADOT_ADDRESS',
  regex: /\b(1[1-9A-HJ-NP-Za-km-z]{46,47})\b/g,
  placeholder: '[DOT_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Polkadot (DOT) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '');
    
    // Length validation
    if (cleaned.length < 47 || cleaned.length > 48) return false;

    // Must start with 1
    if (!cleaned.startsWith('1')) return false;

    // Must have crypto/Polkadot context (enhanced)
    const cryptoKeywords = /polkadot|dot\b|crypto|wallet|blockchain|substrate|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    // SS58 format validation (Base58 with specific prefix)
    if (!/^1[1-9A-HJ-NP-Za-km-z]+$/.test(cleaned)) {
      return false;
    }

    return true;
  }
};

/**
 * Avalanche (AVAX) Address
 * Format: 43 characters, prefixed with X-, P-, or C-
 * Example: X-avax1... or P-avax1... or C-0x...
 */
export const AVALANCHE_ADDRESS: PIIPattern = {
  type: 'AVALANCHE_ADDRESS',
  regex: /\b([XPC][-\s\u00A0]?(?:avax)?[a-z0-9]{38,43})\b/gi,
  placeholder: '[AVAX_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Avalanche (AVAX) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize separators (handle X-, P-, C- with optional separator)
    const cleaned = value.replace(/[\s\u00A0]/g, '').toUpperCase();
    
    // Must start with X-, P-, or C- (with or without dash)
    if (!/^[XPC][-]?/.test(cleaned)) return false;

    // Length validation (with prefix, after normalization)
    if (cleaned.length < 40 || cleaned.length > 46) return false;

    // Must have crypto/Avalanche context (enhanced)
    const cryptoKeywords = /avalanche|avax\b|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    return true;
  }
};

/**
 * Cosmos (ATOM) Address
 * Format: Bech32 format, starts with "cosmos1"
 * 39-45 characters total
 */
export const COSMOS_ADDRESS: PIIPattern = {
  type: 'COSMOS_ADDRESS',
  regex: /\b(cosmos1[a-z0-9]{38,44})\b/g,
  placeholder: '[ATOM_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Cosmos (ATOM) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '').toLowerCase();
    
    // Must start with cosmos1
    if (!cleaned.startsWith('cosmos1')) return false;

    // Length validation
    if (cleaned.length < 39 || cleaned.length > 45) return false;

    // Must have crypto/Cosmos context (enhanced)
    const cryptoKeywords = /cosmos|atom\b|crypto|wallet|blockchain|ibc|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    // Bech32 format validation (cosmos1 prefix + bech32 encoded data)
    if (!/^cosmos1[a-z0-9]+$/.test(cleaned)) {
      return false;
    }

    return true;
  }
};

/**
 * Algorand (ALGO) Address
 * Format: Base32, 58 characters
 * Uppercase letters and numbers
 */
export const ALGORAND_ADDRESS: PIIPattern = {
  type: 'ALGORAND_ADDRESS',
  regex: /\b([A-Z2-7]{58})\b/g,
  placeholder: '[ALGO_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Algorand (ALGO) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace, convert to uppercase)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();
    
    // Must be exactly 58 characters after normalization
    if (cleaned.length !== 58) return false;

    // Must be all uppercase Base32 (A-Z, 2-7)
    if (!/^[A-Z2-7]+$/.test(cleaned)) return false;

    // Must have crypto/Algorand context (enhanced)
    const cryptoKeywords = /algorand|algo\b|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    return true;
  }
};

/**
 * Tezos (XTZ) Address
 * Format: Base58check, starts with "tz"
 * 36 characters total (tz1/tz2/tz3 + 33 chars)
 */
export const TEZOS_ADDRESS: PIIPattern = {
  type: 'TEZOS_ADDRESS',
  regex: /\b(tz[123][1-9A-HJ-NP-Za-km-z]{33})\b/g,
  placeholder: '[XTZ_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Tezos (XTZ) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '');
    
    // Must start with tz1, tz2, or tz3
    if (!/^tz[123]/.test(cleaned)) return false;

    // Must be exactly 36 characters after normalization
    if (cleaned.length !== 36) return false;

    // Must have crypto/Tezos context (enhanced)
    const cryptoKeywords = /tezos|xtz\b|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    // Base58check format validation
    if (!/^tz[123][1-9A-HJ-NP-Za-km-z]+$/.test(cleaned)) {
      return false;
    }

    return true;
  }
};

/**
 * Polygon (MATIC) Address
 * Format: Ethereum-compatible (0x + 40 hex chars)
 * Note: Same format as Ethereum, requires Polygon context
 */
export const POLYGON_ADDRESS: PIIPattern = {
  type: 'POLYGON_ADDRESS',
  regex: /\b(0x[a-fA-F0-9]{40})\b/g,
  placeholder: '[MATIC_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Polygon (MATIC) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '');
    
    // Must start with 0x and be 42 chars total after normalization
    if (!cleaned.startsWith('0x') || cleaned.length !== 42) return false;

    // MUST have Polygon/MATIC context to differentiate from ETH (enhanced)
    const polygonKeywords = /polygon|matic\b|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!polygonKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests Ethereum instead
    if (/ethereum|eth\b|ether/i.test(context) && !/polygon|matic/i.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    // Hex format validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleaned)) {
      return false;
    }

    return true;
  }
};

/**
 * Binance Smart Chain (BNB) Address
 * Format: Ethereum-compatible (0x + 40 hex chars)
 * Note: Same format as Ethereum, requires BSC context
 */
export const BINANCE_CHAIN_ADDRESS: PIIPattern = {
  type: 'BINANCE_CHAIN_ADDRESS',
  regex: /\b(0x[a-fA-F0-9]{40})\b/g,
  placeholder: '[BNB_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Binance Smart Chain (BNB) address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace)
    const cleaned = value.replace(/[\s\u00A0.-]/g, '');
    
    // Must start with 0x and be 42 chars total after normalization
    if (!cleaned.startsWith('0x') || cleaned.length !== 42) return false;

    // MUST have Binance/BNB/BSC context to differentiate from ETH (enhanced)
    const binanceKeywords = /binance|bnb\b|bsc|smart[- ]?chain|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!binanceKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests Ethereum instead
    if (/ethereum|eth\b|ether/i.test(context) && !/binance|bnb|bsc/i.test(context)) {
      return false;
    }
    
    // Reject if context suggests Polygon instead
    if (/polygon|matic/i.test(context) && !/binance|bnb|bsc/i.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    // Hex format validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleaned)) {
      return false;
    }

    return true;
  }
};

/**
 * Near Protocol (NEAR) Address
 * Format: account.near (human-readable) or hex (64 chars)
 * Example: user.near or abc123...
 */
export const NEAR_ADDRESS: PIIPattern = {
  type: 'NEAR_ADDRESS',
  regex: /\b([a-z0-9_-]{2,64}\.near)\b/gi,
  placeholder: '[NEAR_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Near Protocol (NEAR) address',
  validator: (value: string, context: string) => {
    // Normalize (remove any whitespace, convert to lowercase)
    const cleaned = value.replace(/[\s\u00A0]/g, '').toLowerCase();
    
    // Must end with .near
    if (!cleaned.endsWith('.near')) return false;
    
    // Extract the account name part
    const accountName = cleaned.slice(0, -5); // Remove '.near'
    
    // Account name must be 2-64 characters
    if (accountName.length < 2 || accountName.length > 64) return false;
    
    // Account name must match pattern (lowercase alphanumeric, hyphens, underscores)
    if (!/^[a-z0-9_-]+$/.test(accountName)) return false;

    // Must have crypto/Near context (enhanced)
    const cryptoKeywords = /near|protocol|crypto|wallet|blockchain|address|send|receive|transaction|transfer/i;
    if (!cryptoKeywords.test(context)) {
      return false;
    }
    
    // Reject if context suggests it's not crypto-related
    const rejectKeywords = /example|test|sample|demo|fake|dummy|placeholder|version|release/i;
    if (rejectKeywords.test(context)) {
      return false;
    }

    return true;
  }
};

// Export all extended crypto patterns
export const cryptoExtendedPatterns: PIIPattern[] = [
  SOLANA_ADDRESS,
  POLKADOT_ADDRESS,
  AVALANCHE_ADDRESS,
  COSMOS_ADDRESS,
  ALGORAND_ADDRESS,
  TEZOS_ADDRESS,
  POLYGON_ADDRESS,
  BINANCE_CHAIN_ADDRESS,
  NEAR_ADDRESS
];
