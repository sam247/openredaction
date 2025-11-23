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
  },
  {
    type: 'IOT_SERIAL_NUMBER',
    regex: /\bSN:([A-Z0-9]{12})\b/gi,
    priority: 80,
    placeholder: '[IOT_SERIAL_{n}]',
    description: 'IoT device serial numbers',
    severity: 'medium'
  },
  {
    type: 'DEVICE_UUID',
    regex: /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/gi,
    priority: 75,
    placeholder: '[DEVICE_UUID_{n}]',
    description: 'Device UUID identifiers',
    severity: 'medium',
    validator: (_match: string, context: string) => {
      return /device|uuid|identifier|hardware|iot|sensor/i.test(context);
    }
  }
];
