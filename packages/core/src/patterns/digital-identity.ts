/**
 * Digital Identity PII Patterns
 * Social media, gaming platforms, and modern digital identifiers
 */

import { PIIPattern } from '../types';

/**
 * Discord User ID (Snowflake)
 * Format: 17-19 digit unique identifier
 * Example: 123456789012345678
 */
export const DISCORD_USER_ID: PIIPattern = {
  type: 'DISCORD_USER_ID',
  regex: /\b(\d{17,19})\b/g,
  placeholder: '[DISCORD_ID_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Discord user ID (Snowflake format)',
  validator: (value: string, context: string) => {
    // Must be 17-19 digits
    if (value.length < 17 || value.length > 19) return false;

    // Context validation required (many numeric IDs could match)
    return /discord|snowflake|user[-_]?id|server|guild/i.test(context);
  }
};

/**
 * Steam ID64
 * Format: 17-digit number starting with 765
 * Example: 76561198012345678
 */
export const STEAM_ID64: PIIPattern = {
  type: 'STEAM_ID64',
  regex: /\b(765\d{14})\b/g,
  placeholder: '[STEAM_ID_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Steam 64-bit user ID',
  validator: (value: string, context: string) => {
    if (!value.startsWith('765') || value.length !== 17) return false;

    // Context validation
    return /steam|gaming|player|profile|valve|community/i.test(context);
  }
};

/**
 * Social Media Handle (Generic)
 * Format: @username (3-30 characters)
 * Covers Twitter, Instagram, TikTok, etc.
 */
export const SOCIAL_MEDIA_HANDLE: PIIPattern = {
  type: 'SOCIAL_MEDIA_HANDLE',
  regex: /@([a-zA-Z0-9_]{3,30})\b/g,
  placeholder: '[@HANDLE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Social media handle/username',
  validator: (value: string, context: string) => {
    // Must be valid handle format
    if (value.length < 3 || value.length > 30) return false;

    // Context validation
    return /twitter|instagram|tiktok|social|handle|profile|mention|tag/i.test(context);
  }
};

/**
 * Twitter/X User ID
 * Format: 5-19 digit numeric ID
 * Example: 12345678901234567
 */
export const TWITTER_USER_ID: PIIPattern = {
  type: 'TWITTER_USER_ID',
  regex: /\b(\d{5,19})\b/g,
  placeholder: '[TWITTER_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Twitter/X numeric user ID',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 5 || length > 19) return false;

    // Context validation required for numeric ID
    return /twitter|tweet|@|user[-_]?id|x\.com/i.test(context);
  }
};

/**
 * Facebook Profile ID
 * Format: 15-17 digit numeric ID
 * Example: 100012345678901
 */
export const FACEBOOK_ID: PIIPattern = {
  type: 'FACEBOOK_ID',
  regex: /\b(\d{15,17})\b/g,
  placeholder: '[FB_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Facebook numeric profile ID',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 15 || length > 17) return false;

    // Context validation required
    return /facebook|fb|profile|meta|user[-_]?id/i.test(context);
  }
};

/**
 * Instagram Username
 * Format: @username with alphanumeric, periods, underscores (1-30 chars)
 * Example: @user.name_123
 * Note: Requires @ symbol to prevent false positives from matching regular words
 * Higher priority than generic SOCIAL_MEDIA_HANDLE to match usernames with periods
 */
export const INSTAGRAM_USERNAME: PIIPattern = {
  type: 'INSTAGRAM_USERNAME',
  regex: /@([a-zA-Z0-9._]{1,30})\b/g,
  placeholder: '[@IG_USER_{n}]',
  priority: 80, // Higher than SOCIAL_MEDIA_HANDLE (75) to match first
  severity: 'medium',
  description: 'Instagram username with @ symbol',
  validator: (value: string, _context: string) => {
    // Must be valid Instagram format
    if (value.length < 1 || value.length > 30) return false;
    if (!/^[a-zA-Z0-9._]+$/.test(value)) return false;

    // Can't start or end with period
    if (value.startsWith('.') || value.endsWith('.')) return false;

    // Can't have consecutive periods
    if (/\.\./.test(value)) return false;

    // Since @ symbol is required in regex, we can be lenient with context
    // The @ symbol itself provides sufficient signal
    return true;
  }
};

/**
 * TikTok Username
 * Format: alphanumeric, periods, underscores (2-24 chars)
 * Example: @user.name123
 */
export const TIKTOK_USERNAME: PIIPattern = {
  type: 'TIKTOK_USERNAME',
  regex: /@([a-zA-Z0-9._]{2,24})\b/g,
  placeholder: '[@TIKTOK_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'TikTok username',
  validator: (value: string, context: string) => {
    if (value.length < 2 || value.length > 24) return false;

    // Context validation
    return /tiktok|tt|video|profile|creator/i.test(context);
  }
};

/**
 * LinkedIn Profile URL/ID
 * Format: Various (numeric ID or custom URL slug)
 * Example: /in/john-smith-123456/
 */
export const LINKEDIN_PROFILE: PIIPattern = {
  type: 'LINKEDIN_PROFILE',
  regex: /\/in\/([a-zA-Z0-9-]{3,100})\/?/g,
  placeholder: '[LINKEDIN_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'LinkedIn profile URL identifier',
  validator: (value: string, context: string) => {
    if (value.length < 3 || value.length > 100) return false;

    // Context validation
    return /linkedin|profile|professional|connection|network/i.test(context);
  }
};

/**
 * YouTube Channel ID
 * Format: 24-character alphanumeric
 * Example: UC1234567890abcdefghijk
 */
export const YOUTUBE_CHANNEL_ID: PIIPattern = {
  type: 'YOUTUBE_CHANNEL_ID',
  regex: /\b(UC[a-zA-Z0-9_-]{22})\b/g,
  placeholder: '[YT_CHANNEL_{n}]',
  priority: 75,
  severity: 'low',
  description: 'YouTube channel ID',
  validator: (value: string, context: string) => {
    if (!value.startsWith('UC') || value.length !== 24) return false;

    // Context validation
    return /youtube|yt|channel|video|creator|subscriber/i.test(context);
  }
};

/**
 * Reddit Username
 * Format: u/username (3-20 characters)
 * Example: u/username123
 */
export const REDDIT_USERNAME: PIIPattern = {
  type: 'REDDIT_USERNAME',
  regex: /u\/([a-zA-Z0-9_-]{3,20})\b/g,
  placeholder: '[REDDIT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Reddit username',
  validator: (value: string, context: string) => {
    if (value.length < 3 || value.length > 20) return false;

    // Context validation
    return /reddit|subreddit|post|comment|karma/i.test(context);
  }
};

/**
 * Xbox Gamertag
 * Format: alphanumeric with spaces (3-15 chars)
 * Example: GamerName123
 * Note: Disabled by default - too prone to false positives. Use custom pattern if needed.
 */
export const XBOX_GAMERTAG: PIIPattern = {
  type: 'XBOX_GAMERTAG',
  regex: /\b([a-zA-Z][a-zA-Z0-9 ]{2,14})\b/g,
  placeholder: '[XBOX_TAG_{n}]',
  priority: 50, // Lowered priority
  severity: 'low', // Lowered severity
  description: 'Xbox Live Gamertag (requires strong context)',
  validator: (value: string, context: string) => {
    if (value.length < 3 || value.length > 15) return false;
    if (!/^[a-zA-Z]/.test(value)) return false;

    // Much stricter context validation required to avoid false positives
    const strictContext = /(?:xbox|gamertag|live|XBL)[\s:]+/i.test(context) ||
                         /\b(?:xbox|gamertag)\b.*\b(?:is|:|=)\b/i.test(context);
    return strictContext;
  }
};

/**
 * PlayStation Network ID
 * Format: alphanumeric, hyphens, underscores (3-16 chars)
 * Example: PSN_User123
 * Note: Requires strong context to avoid false positives with common words
 */
export const PSN_ID: PIIPattern = {
  type: 'PSN_ID',
  regex: /\b([a-zA-Z][a-zA-Z0-9_-]{2,15})\b/g,
  placeholder: '[PSN_{n}]',
  priority: 50, // Lowered priority
  severity: 'low', // Lowered severity
  description: 'PlayStation Network ID (requires strong context)',
  validator: (value: string, context: string) => {
    if (value.length < 3 || value.length > 16) return false;
    if (!/^[a-zA-Z]/.test(value)) return false;

    // Much stricter context validation required
    const strictContext = /(?:playstation|psn|PSN)[\s:]+/i.test(context) ||
                         /\b(?:psn|playstation)\b.*\b(?:is|id|:|=)\b/i.test(context);
    return strictContext;
  }
};

/**
 * Nintendo Friend Code (Switch)
 * Format: SW-XXXX-XXXX-XXXX (12 digits)
 * Example: SW-1234-5678-9012
 */
export const NINTENDO_FRIEND_CODE: PIIPattern = {
  type: 'NINTENDO_FRIEND_CODE',
  regex: /\bSW[-\s]?(\d{4}[-\s]?\d{4}[-\s]?\d{4})\b/gi,
  placeholder: '[NINTENDO_FC_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Nintendo Switch Friend Code',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 12) return false;

    // Context validation
    return /nintendo|switch|friend[- ]?code|gaming/i.test(context);
  }
};

/**
 * Battle.net BattleTag
 * Format: Name#1234 (name + 4-5 digit discriminator)
 * Example: Player#12345
 */
export const BATTLETAG: PIIPattern = {
  type: 'BATTLETAG',
  regex: /\b([a-zA-Z][a-zA-Z0-9]{2,11}#\d{4,5})\b/g,
  placeholder: '[BTAG_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Battle.net BattleTag',
  validator: (value: string, context: string) => {
    // Value should be Name#NNNN format
    const parts = value.split('#');
    if (parts.length !== 2) return false;
    if (parts[0].length < 3 || parts[0].length > 12) return false;
    if (parts[1].length < 4 || parts[1].length > 5) return false;

    // Context validation
    return /battle|battletag|blizzard|overwatch|warcraft|diablo/i.test(context);
  }
};

/**
 * Epic Games Account ID
 * Format: 32-character hex string
 * Example: 1234567890abcdef1234567890abcdef
 */
export const EPIC_GAMES_ID: PIIPattern = {
  type: 'EPIC_GAMES_ID',
  regex: /\b([a-f0-9]{32})\b/gi,
  placeholder: '[EPIC_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Epic Games account ID',
  validator: (value: string, context: string) => {
    if (value.length !== 32) return false;
    if (!/^[a-f0-9]+$/i.test(value)) return false;

    // Context validation required
    return /epic|fortnite|unreal|games|launcher|account/i.test(context);
  }
};

/**
 * Telegram User ID
 * Format: Numeric (up to 10 digits)
 * Example: 123456789
 */
export const TELEGRAM_USER_ID: PIIPattern = {
  type: 'TELEGRAM_USER_ID',
  regex: /\b(\d{6,10})\b/g,
  placeholder: '[TG_ID_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Telegram user ID',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 6 || length > 10) return false;

    // Context validation required
    return /telegram|tg|chat|user[-_]?id|messenger/i.test(context);
  }
};

// Export all digital identity patterns
export const digitalIdentityPatterns: PIIPattern[] = [
  DISCORD_USER_ID,
  STEAM_ID64,
  SOCIAL_MEDIA_HANDLE,
  TWITTER_USER_ID,
  FACEBOOK_ID,
  INSTAGRAM_USERNAME,
  TIKTOK_USERNAME,
  LINKEDIN_PROFILE,
  YOUTUBE_CHANNEL_ID,
  REDDIT_USERNAME,
  XBOX_GAMERTAG,
  PSN_ID,
  NINTENDO_FRIEND_CODE,
  BATTLETAG,
  EPIC_GAMES_ID,
  TELEGRAM_USER_ID
];
