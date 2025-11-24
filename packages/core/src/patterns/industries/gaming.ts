/**
 * Gaming & Esports Industry PII Patterns
 * For gaming platforms, esports, and competitive gaming
 */

import { PIIPattern } from '../../types';

/**
 * Riot Games Account ID (Riot ID)
 * Format: Username#TagLine (e.g., Player#1234)
 * Used for League of Legends, Valorant, etc.
 */
export const RIOT_ID: PIIPattern = {
  type: 'RIOT_ID',
  regex: /\b([a-zA-Z0-9_]{3,16})#([a-zA-Z0-9]{3,5})\b/g,
  placeholder: '[RIOT_ID_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Riot Games account ID (Riot ID)',
  validator: (value: string, context: string) => {
    // Must contain # separator
    if (!value.includes('#')) return false;

    const [username, tagline] = value.split('#');
    if (username.length < 3 || username.length > 16) return false;
    if (tagline.length < 3 || tagline.length > 5) return false;

    // Context validation
    return /riot|league[- ]?of[- ]?legends|valorant|tft|teamfight[- ]?tactics|gaming/i.test(context);
  }
};

/**
 * Twitch Username
 * Format: Alphanumeric with underscores (4-25 chars)
 * Used for streaming platform
 */
export const TWITCH_USERNAME: PIIPattern = {
  type: 'TWITCH_USERNAME',
  regex: /\bTWITCH[-\s]?(?:USER|NAME|ID)?[-\s]?[:#]?\s*([a-zA-Z0-9_]{4,25})\b/gi,
  placeholder: '[TWITCH_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Twitch username',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 4 || length > 25) return false;

    // Context validation
    return /twitch|streaming|streamer|channel|live|broadcast/i.test(context);
  }
};

/**
 * Esports Player ID
 * Format: Varies by platform (alphanumeric)
 * Generic esports tournament player ID
 */
export const ESPORTS_PLAYER_ID: PIIPattern = {
  type: 'ESPORTS_PLAYER_ID',
  regex: /\b(?:PLAYER|COMPETITOR|PARTICIPANT)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PLAYER_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Esports player/competitor ID',
  validator: (_value: string, context: string) => {
    return /esports|tournament|competition|player|competitor|gaming|league/i.test(context);
  }
};

/**
 * Gaming Tournament Registration ID
 * Format: Alphanumeric
 * Used for tournament sign-ups and brackets
 */
export const TOURNAMENT_REGISTRATION_ID: PIIPattern = {
  type: 'TOURNAMENT_REGISTRATION_ID',
  regex: /\b(?:TOURNAMENT|BRACKET|REGISTRATION|REG)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[TOURNEY_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Gaming tournament registration ID',
  validator: (_value: string, context: string) => {
    return /tournament|bracket|registration|competition|event|gaming|esports/i.test(context);
  }
};

/**
 * Roblox User ID
 * Format: Numeric (1-12 digits)
 * Used for Roblox platform
 */
export const ROBLOX_USER_ID: PIIPattern = {
  type: 'ROBLOX_USER_ID',
  regex: /\bROBLOX[-\s]?(?:USER|ID)?[-\s]?[:#]?\s*(\d{1,12})\b/gi,
  placeholder: '[ROBLOX_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Roblox user ID',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 1 || length > 12) return false;

    // Context validation
    return /roblox|robux|user|player|gaming/i.test(context);
  }
};

/**
 * Minecraft UUID
 * Format: 32 hex characters (with or without hyphens)
 * Used for Minecraft player identification
 */
export const MINECRAFT_UUID: PIIPattern = {
  type: 'MINECRAFT_UUID',
  regex: /\b([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})\b/gi,
  placeholder: '[MC_UUID_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Minecraft player UUID',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/-/g, '');
    if (cleaned.length !== 32) return false;

    // Must be valid hex
    if (!/^[0-9a-f]+$/i.test(cleaned)) return false;

    // Context validation
    return /minecraft|mc|mojang|player|uuid|server/i.test(context);
  }
};

/**
 * Fortnite Account ID
 * Format: Alphanumeric (32 chars)
 * Used for Epic Games Fortnite
 */
export const FORTNITE_ACCOUNT_ID: PIIPattern = {
  type: 'FORTNITE_ACCOUNT_ID',
  regex: /\b(?:FORTNITE|FN)[-\s]?(?:ACCOUNT|USER|ID)?[-\s]?[:#]?\s*([a-f0-9]{32})\b/gi,
  placeholder: '[FN_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Fortnite account ID',
  validator: (value: string, context: string) => {
    if (value.length !== 32) return false;

    // Must be hex
    if (!/^[a-f0-9]+$/i.test(value)) return false;

    // Context validation
    return /fortnite|epic[- ]?games|battle[- ]?royale|gaming/i.test(context);
  }
};

/**
 * Call of Duty Player ID (Activision ID)
 * Format: Username#1234567
 * Used for COD franchise games
 */
export const COD_PLAYER_ID: PIIPattern = {
  type: 'COD_PLAYER_ID',
  regex: /\b([a-zA-Z0-9_]{3,16})#(\d{7})\b/g,
  placeholder: '[COD_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Call of Duty / Activision player ID',
  validator: (value: string, context: string) => {
    if (!value.includes('#')) return false;

    const [username, id] = value.split('#');
    if (username.length < 3 || username.length > 16) return false;
    if (id.length !== 7) return false;

    // Context validation
    return /call[- ]?of[- ]?duty|cod|warzone|activision|gaming/i.test(context);
  }
};

/**
 * Apex Legends Player ID
 * Format: Alphanumeric
 * Used for Apex Legends (EA/Respawn)
 */
export const APEX_PLAYER_ID: PIIPattern = {
  type: 'APEX_PLAYER_ID',
  regex: /\b(?:APEX|EA)[-\s]?(?:ID|PLAYER)?[-\s]?[:#]?\s*([A-Z0-9]{10,16})\b/gi,
  placeholder: '[APEX_ID_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Apex Legends player ID',
  validator: (_value: string, context: string) => {
    return /apex[- ]?legends|apex|ea|respawn|gaming|player/i.test(context);
  }
};

/**
 * Dota 2 Friend ID
 * Format: 9-10 digit numeric
 * Used for Dota 2 (Steam-based)
 */
export const DOTA_FRIEND_ID: PIIPattern = {
  type: 'DOTA_FRIEND_ID',
  regex: /\bDOTA[-\s]?(?:ID|FRIEND)?[-\s]?[:#]?\s*(\d{9,10})\b/gi,
  placeholder: '[DOTA_ID_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Dota 2 friend ID',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 9 || length > 10) return false;

    // Context validation
    return /dota|steam|valve|gaming|player|moba/i.test(context);
  }
};

/**
 * CS:GO Friend Code
 * Format: XXXXX-XXXXX format
 * Used for Counter-Strike: Global Offensive
 */
export const CSGO_FRIEND_CODE: PIIPattern = {
  type: 'CSGO_FRIEND_CODE',
  regex: /\b(?:CS:?GO|COUNTER[- ]?STRIKE)[-\s]?(?:FRIEND[- ]?CODE|CODE)?[-\s]?[:#]?\s*([A-Z0-9]{5}-[A-Z0-9]{5})\b/gi,
  placeholder: '[CSGO_CODE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'CS:GO friend code',
  validator: (value: string, context: string) => {
    // Must be in XXXXX-XXXXX format
    if (!/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(value)) return false;

    // Context validation
    return /cs:?go|counter[- ]?strike|steam|valve|gaming/i.test(context);
  }
};

/**
 * Overwatch BattleTag
 * Format: Username#1234
 * Covered by BATTLETAG in digital-identity, but adding gaming context
 */
export const OVERWATCH_BATTLETAG: PIIPattern = {
  type: 'OVERWATCH_BATTLETAG',
  regex: /\b([a-zA-Z][a-zA-Z0-9]{2,11})#(\d{4,5})\b/g,
  placeholder: '[OW_TAG_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Overwatch BattleTag',
  validator: (value: string, context: string) => {
    const parts = value.split('#');
    if (parts.length !== 2) return false;
    if (parts[0].length < 3 || parts[0].length > 12) return false;
    if (parts[1].length < 4 || parts[1].length > 5) return false;

    // Context validation - must mention Overwatch specifically
    return /overwatch|ow2|blizzard|gaming|player/i.test(context);
  }
};

// Export all gaming patterns
export const gamingPatterns: PIIPattern[] = [
  RIOT_ID,
  TWITCH_USERNAME,
  ESPORTS_PLAYER_ID,
  TOURNAMENT_REGISTRATION_ID,
  ROBLOX_USER_ID,
  MINECRAFT_UUID,
  FORTNITE_ACCOUNT_ID,
  COD_PLAYER_ID,
  APEX_PLAYER_ID,
  DOTA_FRIEND_ID,
  CSGO_FRIEND_CODE,
  OVERWATCH_BATTLETAG
];
