/**
 * Technology, Security, and API Patterns
 * API keys, tokens, credentials, and infrastructure identifiers
 */

import { PIIPattern } from '../../types';

/**
 * AWS Access Key ID
 * Format: AKIA + 16 alphanumeric characters
 */
export const AWS_ACCESS_KEY: PIIPattern = {
  type: 'AWS_ACCESS_KEY',
  regex: /\b(AKIA[0-9A-Z]{16})\b/g,
  placeholder: '[AWS_KEY_{n}]',
  priority: 95,
  severity: 'high',
  description: 'AWS Access Key ID'
};

/**
 * AWS Secret Access Key
 * Format: 40 base64 characters
 */
export const AWS_SECRET_KEY: PIIPattern = {
  type: 'AWS_SECRET_KEY',
  regex: /(?:aws.{0,20})?(?:secret.{0,20})?([a-zA-Z0-9/+=]{40})/gi,
  placeholder: '[AWS_SECRET_{n}]',
  priority: 98,
  severity: 'high',
  description: 'AWS Secret Access Key',
  validator: (_value: string, context: string) => {
    // Must be in AWS/secret context
    return /aws|amazon|secret|access.key/i.test(context);
  }
};

/**
 * Google API Key
 * Format: AIza + 35 characters
 */
export const GOOGLE_API_KEY: PIIPattern = {
  type: 'GOOGLE_API_KEY',
  regex: /\b(AIza[0-9A-Za-z\-_]{35})\b/g,
  placeholder: '[GOOGLE_API_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Google API Key'
};

/**
 * Stripe API Keys
 * Format: sk_live_, pk_live_, sk_test_, pk_test_
 */
export const STRIPE_API_KEY: PIIPattern = {
  type: 'STRIPE_API_KEY',
  regex: /\b((sk|pk)_(live|test)_[0-9a-zA-Z]{24,})\b/g,
  placeholder: '[STRIPE_KEY_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Stripe API Keys'
};

/**
 * GitHub Personal Access Token
 * Format: ghp_, gho_, ghu_, ghs_, ghr_
 */
export const GITHUB_TOKEN: PIIPattern = {
  type: 'GITHUB_TOKEN',
  regex: /\b(gh[pousr]_[A-Za-z0-9]{36,})\b/g,
  placeholder: '[GITHUB_TOKEN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'GitHub Personal Access Token'
};

/**
 * JWT Token
 * Format: eyJ... (base64)
 */
export const JWT_TOKEN: PIIPattern = {
  type: 'JWT_TOKEN',
  regex: /\b(eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g,
  placeholder: '[JWT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'JSON Web Token (JWT)'
};

/**
 * Generic API Key Pattern
 */
export const GENERIC_API_KEY: PIIPattern = {
  type: 'GENERIC_API_KEY',
  regex: /\b(?:api.{0,5}key|apikey|api.token)[:\s=]+([a-zA-Z0-9_\-]{20,})\b/gi,
  placeholder: '[API_KEY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Generic API key pattern',
  validator: (value: string, context: string) => {
    // Exclude common false positives
    const excluded = /example|sample|test|fake|demo|placeholder|xxx/i;
    return !excluded.test(value) && !excluded.test(context);
  }
};

/**
 * Generic Secret/Password
 */
export const GENERIC_SECRET: PIIPattern = {
  type: 'GENERIC_SECRET',
  regex: /\b(?:password|passwd|pwd|secret)[:\s=]+([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{8,})\b/gi,
  placeholder: '[SECRET_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Generic passwords and secrets',
  validator: (value: string, _context: string) => {
    // Exclude obvious placeholders
    const excluded = /example|sample|test|fake|demo|placeholder|xxx|password|secret|\*+/i;
    return !excluded.test(value) && value.length >= 8;
  }
};

/**
 * Private Key Headers
 */
export const PRIVATE_KEY: PIIPattern = {
  type: 'PRIVATE_KEY',
  regex: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]{20,}?-----END (?:RSA |EC )?PRIVATE KEY-----/g,
  placeholder: '[PRIVATE_KEY_{n}]',
  priority: 98,
  severity: 'high',
  description: 'RSA/EC Private Keys'
};

/**
 * SSH Private Key
 */
export const SSH_PRIVATE_KEY: PIIPattern = {
  type: 'SSH_PRIVATE_KEY',
  regex: /-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]{20,}?-----END OPENSSH PRIVATE KEY-----/g,
  placeholder: '[SSH_KEY_{n}]',
  priority: 98,
  severity: 'high',
  description: 'SSH Private Keys'
};

/**
 * Database Connection String
 */
export const DATABASE_CONNECTION: PIIPattern = {
  type: 'DATABASE_CONNECTION',
  regex: /(?:postgres|mysql|mongodb|redis|sqlite):\/\/[^\s:]+:[^\s@]+@[^\s]+/gi,
  placeholder: '[DB_CONN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Database connection strings with credentials'
};

/**
 * AWS ARN
 */
export const AWS_ARN: PIIPattern = {
  type: 'AWS_ARN',
  regex: /\b(arn:aws:[a-z0-9\-]+:[a-z0-9\-]*:[0-9]{12}:[a-zA-Z0-9\/\-_:]+)\b/g,
  placeholder: '[AWS_ARN_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'AWS Amazon Resource Name',
  validator: (_value: string, context: string) => {
    // Only in cloud/AWS context
    return /aws|amazon|cloud|arn|resource/i.test(context);
  }
};

/**
 * Docker Hub Credentials
 */
export const DOCKER_AUTH: PIIPattern = {
  type: 'DOCKER_AUTH',
  regex: /\{[^}]*"auth"\s*:\s*"([A-Za-z0-9+/=]{20,})"[^}]*\}/g,
  placeholder: '[DOCKER_AUTH_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Docker authentication tokens'
};

/**
 * Slack Webhook
 */
export const SLACK_WEBHOOK: PIIPattern = {
  type: 'SLACK_WEBHOOK',
  regex: /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Za-z0-9]+/g,
  placeholder: '[SLACK_WEBHOOK_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Slack incoming webhook URLs'
};

/**
 * Slack Token
 */
export const SLACK_TOKEN: PIIPattern = {
  type: 'SLACK_TOKEN',
  regex: /\b(xox[baprs]-[0-9a-zA-Z\-]{10,})\b/g,
  placeholder: '[SLACK_TOKEN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Slack API tokens'
};

/**
 * Twilio API Key
 */
export const TWILIO_API_KEY: PIIPattern = {
  type: 'TWILIO_API_KEY',
  regex: /\b(SK[a-z0-9]{32})\b/g,
  placeholder: '[TWILIO_KEY_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Twilio API Keys',
  validator: (_value: string, context: string) => {
    return /twilio|sms|phone|messaging/i.test(context);
  }
};

/**
 * Mailgun API Key
 */
export const MAILGUN_API_KEY: PIIPattern = {
  type: 'MAILGUN_API_KEY',
  regex: /\b(key-[a-z0-9]{32})\b/g,
  placeholder: '[MAILGUN_KEY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Mailgun API Keys',
  validator: (_value: string, context: string) => {
    return /mailgun|email|mail/i.test(context);
  }
};

/**
 * SendGrid API Key
 */
export const SENDGRID_API_KEY: PIIPattern = {
  type: 'SENDGRID_API_KEY',
  regex: /\b(SG\.[a-zA-Z0-9_\-]{22}\.[a-zA-Z0-9_\-]{43})\b/g,
  placeholder: '[SENDGRID_KEY_{n}]',
  priority: 90,
  severity: 'high',
  description: 'SendGrid API Keys'
};

/**
 * Session ID (generic)
 */
export const SESSION_ID: PIIPattern = {
  type: 'SESSION_ID',
  regex: /\b(?:session|sess|sid)[:\s=]+([a-f0-9]{32,})\b/gi,
  placeholder: '[SESSION_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Session identifiers',
  validator: (value: string, _context: string) => {
    return value.length >= 32 && /^[a-f0-9]+$/.test(value);
  }
};

/**
 * Bearer Token (Authorization header)
 */
export const BEARER_TOKEN: PIIPattern = {
  type: 'BEARER_TOKEN',
  regex: /\bBearer\s+([a-zA-Z0-9_\-\.]{20,})/g,
  placeholder: '[BEARER_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Bearer authentication tokens'
};

// Export all technology patterns
export const technologyPatterns: PIIPattern[] = [
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  GOOGLE_API_KEY,
  STRIPE_API_KEY,
  GITHUB_TOKEN,
  JWT_TOKEN,
  GENERIC_API_KEY,
  GENERIC_SECRET,
  PRIVATE_KEY,
  SSH_PRIVATE_KEY,
  DATABASE_CONNECTION,
  AWS_ARN,
  DOCKER_AUTH,
  SLACK_WEBHOOK,
  SLACK_TOKEN,
  TWILIO_API_KEY,
  MAILGUN_API_KEY,
  SENDGRID_API_KEY,
  SESSION_ID,
  BEARER_TOKEN
];
