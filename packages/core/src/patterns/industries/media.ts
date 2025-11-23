/**
 * Media and Publishing Industry PII Patterns
 * For journalism, publishing, content creation, media companies
 */

import { PIIPattern } from '../../types';

/**
 * Interviewee ID
 */
export const INTERVIEWEE_ID: PIIPattern = {
  type: 'INTERVIEWEE_ID',
  regex: /\bINTV[-\s]?([A-Z]{1}\d{5})\b/gi,
  placeholder: '[INTERVIEWEE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Interviewee identification numbers for anonymity'
};

/**
 * Source ID (confidential sources)
 */
export const SOURCE_ID: PIIPattern = {
  type: 'SOURCE_ID',
  regex: /\bSOURCE[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[SOURCE_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Confidential source identifiers',
  validator: (_value: string, context: string) => {
    return /source|informant|confidential|anonymous|whistleblower/i.test(context);
  }
};

/**
 * Article/Story ID
 */
export const ARTICLE_ID: PIIPattern = {
  type: 'ARTICLE_ID',
  regex: /\b(?:ARTICLE|STORY)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[ARTICLE_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Article and story identification numbers',
  validator: (_value: string, context: string) => {
    return /article|story|piece|content|publication/i.test(context);
  }
};

/**
 * Manuscript ID
 */
export const MANUSCRIPT_ID: PIIPattern = {
  type: 'MANUSCRIPT_ID',
  regex: /\b(?:MANUSCRIPT|MS)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[MANUSCRIPT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Manuscript identification numbers',
  validator: (_value: string, context: string) => {
    return /manuscript|ms|draft|submission|review/i.test(context);
  }
};

/**
 * Press Pass ID
 */
export const PRESS_PASS_ID: PIIPattern = {
  type: 'PRESS_PASS_ID',
  regex: /\b(?:PRESS[-\s]?PASS|MEDIA[-\s]?CREDENTIAL)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PRESS_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Press pass and media credential numbers',
  validator: (_value: string, context: string) => {
    return /press|media|credential|pass|journalist|reporter/i.test(context);
  }
};

/**
 * Contributor/Freelancer ID
 */
export const CONTRIBUTOR_ID: PIIPattern = {
  type: 'CONTRIBUTOR_ID',
  regex: /\b(?:CONTRIBUTOR|FREELANCER|WRITER)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[CONTRIBUTOR_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Contributor and freelancer identification numbers',
  validator: (_value: string, context: string) => {
    return /contributor|freelancer|writer|author|journalist/i.test(context);
  }
};

/**
 * Publishing Contract Number
 */
export const PUBLISHING_CONTRACT: PIIPattern = {
  type: 'PUBLISHING_CONTRACT',
  regex: /\b(?:PUBLISHING|PUB)[-\s]?(?:CONTRACT)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[PUB_CONTRACT_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Publishing contract numbers',
  validator: (_value: string, context: string) => {
    return /publishing|contract|agreement|deal|rights/i.test(context);
  }
};

/**
 * Editorial Ticket/Task ID
 */
export const EDITORIAL_TICKET: PIIPattern = {
  type: 'EDITORIAL_TICKET',
  regex: /\b(?:EDITORIAL|EDIT)[-\s]?(?:TICKET|TASK)?[-\s]?(?:ID|NO)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[EDIT_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Editorial ticket and task identifiers',
  validator: (_value: string, context: string) => {
    return /editorial|edit|task|ticket|assignment/i.test(context);
  }
};

/**
 * Subscriber ID
 */
export const SUBSCRIBER_ID: PIIPattern = {
  type: 'SUBSCRIBER_ID',
  regex: /\bSUBSCRIBER[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[SUBSCRIBER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Subscriber identification numbers',
  validator: (_value: string, context: string) => {
    return /subscriber|subscription|member|account|reader/i.test(context);
  }
};

/**
 * ISBN (International Standard Book Number)
 */
export const ISBN: PIIPattern = {
  type: 'ISBN',
  regex: /\bISBN[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{3}[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?\d{1})\b/gi,
  placeholder: '[ISBN_{n}]',
  priority: 65,
  severity: 'low',
  description: 'International Standard Book Numbers'
};

/**
 * Copyright Registration Number
 */
export const COPYRIGHT_REG: PIIPattern = {
  type: 'COPYRIGHT_REG',
  regex: /\b(?:COPYRIGHT|©)[-\s]?(?:REG(?:ISTRATION)?)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{2,3}\d{6,10})\b/gi,
  placeholder: '[COPYRIGHT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Copyright registration numbers',
  validator: (_value: string, context: string) => {
    return /copyright|registration|intellectual|property|rights/i.test(context);
  }
};

/**
 * Production ID (film/video)
 */
export const PRODUCTION_ID: PIIPattern = {
  type: 'PRODUCTION_ID',
  regex: /\b(?:PRODUCTION|PROD)[-\s]?(?:ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PRODUCTION_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Film and video production identifiers',
  validator: (_value: string, context: string) => {
    return /production|film|video|shoot|project/i.test(context);
  }
};

// Export all media patterns
export const mediaPatterns: PIIPattern[] = [
  INTERVIEWEE_ID,
  SOURCE_ID,
  ARTICLE_ID,
  MANUSCRIPT_ID,
  PRESS_PASS_ID,
  CONTRIBUTOR_ID,
  PUBLISHING_CONTRACT,
  EDITORIAL_TICKET,
  SUBSCRIBER_ID,
  ISBN,
  COPYRIGHT_REG,
  PRODUCTION_ID
];
