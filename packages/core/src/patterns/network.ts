/**
 * Network-related PII patterns (IP addresses, MAC addresses, etc.)
 */

import { PIIPattern } from '../types';

export const networkPatterns: PIIPattern[] = [
  {
    type: 'IPV4',
    regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    priority: 80,
    validator: (match) => {
      // Exclude common non-PII IPs
      const excluded = ['0.0.0.0', '127.0.0.1', '255.255.255.255'];
      return !excluded.includes(match) && !match.startsWith('192.168.') && !match.startsWith('10.');
    },
    placeholder: '[IPV4_{n}]',
    description: 'IPv4 address',
    severity: 'medium'
  },
  {
    type: 'IPV6',
    regex: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    priority: 80,
    validator: (match) => {
      // Exclude localhost
      return match !== '::1' && !match.startsWith('fe80:');
    },
    placeholder: '[IPV6_{n}]',
    description: 'IPv6 address',
    severity: 'medium'
  },
  {
    type: 'MAC_ADDRESS',
    regex: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g,
    priority: 75,
    placeholder: '[MAC_{n}]',
    description: 'MAC address',
    severity: 'low'
  },
  {
    type: 'URL_WITH_AUTH',
    regex: /\b(?:https?|ftp):\/\/[a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+@[^\s]+\b/g,
    priority: 95,
    placeholder: '[URL_AUTH_{n}]',
    description: 'URL with credentials',
    severity: 'high'
  }
];
