/**
 * Tests for Digital Identity patterns
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Digital Identity Pattern Detection', () => {
  describe('Discord User ID', () => {
    it('should detect valid Discord snowflake ID', () => {
      const detector = new OpenRedaction({ patterns: ['DISCORD_USER_ID'] });
      // Valid Discord snowflake from 2015 onwards
      const result = detector.detect('Discord user ID: 123456789012345678');
      expect(result.detections.some(d => d.type === 'DISCORD_USER_ID')).toBe(true);
    });

    it('should require Discord context', () => {
      const detector = new OpenRedaction({ patterns: ['DISCORD_USER_ID'] });
      const result = detector.detect('Random number: 123456789012345678');
      expect(result.detections.some(d => d.type === 'DISCORD_USER_ID')).toBe(false);
    });

    it('should validate snowflake timestamp', () => {
      const detector = new OpenRedaction({ patterns: ['DISCORD_USER_ID'] });
      // Invalid snowflake (timestamp too old)
      const result = detector.detect('Discord ID: 1234567890');
      expect(result.detections.some(d => d.type === 'DISCORD_USER_ID')).toBe(false);
    });
  });

  describe('Steam ID64', () => {
    it('should detect Steam ID64', () => {
      const detector = new OpenRedaction({ patterns: ['STEAM_ID64'] });
      const result = detector.detect('Steam profile: 76561198012345678');
      expect(result.detections.some(d => d.type === 'STEAM_ID64')).toBe(true);
    });

    it('should require 765 prefix', () => {
      const detector = new OpenRedaction({ patterns: ['STEAM_ID64'] });
      const result = detector.detect('Steam ID: 12345678901234567');
      expect(result.detections.some(d => d.type === 'STEAM_ID64')).toBe(false);
    });

    it('should require Steam context', () => {
      const detector = new OpenRedaction({ patterns: ['STEAM_ID64'] });
      const result = detector.detect('Number: 76561198012345678');
      expect(result.detections.some(d => d.type === 'STEAM_ID64')).toBe(false);
    });
  });

  describe('Social Media Handle', () => {
    it('should detect Twitter handle', () => {
      const detector = new OpenRedaction({ patterns: ['SOCIAL_MEDIA_HANDLE'] });
      const result = detector.detect('Twitter: @username123');
      expect(result.detections.some(d => d.type === 'SOCIAL_MEDIA_HANDLE')).toBe(true);
    });

    it('should detect Instagram handle', () => {
      const detector = new OpenRedaction({ patterns: ['SOCIAL_MEDIA_HANDLE'] });
      const result = detector.detect('Instagram handle: @user.name_123');
      expect(result.detections.some(d => d.type === 'SOCIAL_MEDIA_HANDLE')).toBe(true);
    });

    it('should require social media context', () => {
      const detector = new OpenRedaction({ patterns: ['SOCIAL_MEDIA_HANDLE'] });
      const result = detector.detect('Email: @company.com');
      expect(result.detections.some(d => d.type === 'SOCIAL_MEDIA_HANDLE')).toBe(false);
    });

    it('should enforce length constraints', () => {
      const detector = new OpenRedaction({ patterns: ['SOCIAL_MEDIA_HANDLE'] });
      // Too short (< 3 chars)
      const result = detector.detect('Twitter: @ab');
      expect(result.detections.some(d => d.type === 'SOCIAL_MEDIA_HANDLE')).toBe(false);
    });
  });

  describe('Twitter User ID', () => {
    it('should detect Twitter user ID', () => {
      const detector = new OpenRedaction({ patterns: ['TWITTER_USER_ID'] });
      const result = detector.detect('Twitter user ID: 12345678901234567');
      expect(result.detections.some(d => d.type === 'TWITTER_USER_ID')).toBe(true);
    });

    it('should require Twitter context', () => {
      const detector = new OpenRedaction({ patterns: ['TWITTER_USER_ID'] });
      const result = detector.detect('ID: 12345678901234567');
      expect(result.detections.some(d => d.type === 'TWITTER_USER_ID')).toBe(false);
    });
  });

  describe('Facebook ID', () => {
    it('should detect Facebook profile ID', () => {
      const detector = new OpenRedaction({ patterns: ['FACEBOOK_ID'] });
      const result = detector.detect('Facebook profile: 100012345678901');
      expect(result.detections.some(d => d.type === 'FACEBOOK_ID')).toBe(true);
    });

    it('should require 15-17 digits', () => {
      const detector = new OpenRedaction({ patterns: ['FACEBOOK_ID'] });
      const result = detector.detect('Facebook: 12345678901234'); // Only 14 digits
      expect(result.detections.some(d => d.type === 'FACEBOOK_ID')).toBe(false);
    });

    it('should require Facebook context', () => {
      const detector = new OpenRedaction({ patterns: ['FACEBOOK_ID'] });
      const result = detector.detect('ID: 100012345678901');
      expect(result.detections.some(d => d.type === 'FACEBOOK_ID')).toBe(false);
    });
  });

  describe('TikTok Username', () => {
    it('should detect TikTok username', () => {
      const detector = new OpenRedaction({ patterns: ['TIKTOK_USERNAME'] });
      const result = detector.detect('TikTok: @user.name123');
      expect(result.detections.some(d => d.type === 'TIKTOK_USERNAME')).toBe(true);
    });

    it('should require TikTok context', () => {
      const detector = new OpenRedaction({ patterns: ['TIKTOK_USERNAME'] });
      const result = detector.detect('Username: @user.name123');
      expect(result.detections.some(d => d.type === 'TIKTOK_USERNAME')).toBe(false);
    });
  });

  describe('LinkedIn Profile', () => {
    it('should detect LinkedIn profile URL', () => {
      const detector = new OpenRedaction({ patterns: ['LINKEDIN_PROFILE'] });
      const result = detector.detect('LinkedIn profile: /in/john-smith-123456/');
      expect(result.detections.some(d => d.type === 'LINKEDIN_PROFILE')).toBe(true);
    });

    it('should require LinkedIn context', () => {
      const detector = new OpenRedaction({ patterns: ['LINKEDIN_PROFILE'] });
      const result = detector.detect('URL: /in/john-smith/');
      expect(result.detections.some(d => d.type === 'LINKEDIN_PROFILE')).toBe(false);
    });
  });

  describe('YouTube Channel ID', () => {
    it('should detect YouTube channel ID', () => {
      const detector = new OpenRedaction({ patterns: ['YOUTUBE_CHANNEL_ID'] });
      const result = detector.detect('YouTube channel: UC1234567890abcdefghijkl');
      expect(result.detections.some(d => d.type === 'YOUTUBE_CHANNEL_ID')).toBe(true);
    });

    it('should require UC prefix', () => {
      const detector = new OpenRedaction({ patterns: ['YOUTUBE_CHANNEL_ID'] });
      const result = detector.detect('YouTube: AB1234567890abcdefghijkl');
      expect(result.detections.some(d => d.type === 'YOUTUBE_CHANNEL_ID')).toBe(false);
    });

    it('should require YouTube context', () => {
      const detector = new OpenRedaction({ patterns: ['YOUTUBE_CHANNEL_ID'] });
      const result = detector.detect('ID: UC1234567890abcdefghijkl');
      expect(result.detections.some(d => d.type === 'YOUTUBE_CHANNEL_ID')).toBe(false);
    });
  });

  describe('Reddit Username', () => {
    it('should detect Reddit username', () => {
      const detector = new OpenRedaction({ patterns: ['REDDIT_USERNAME'] });
      const result = detector.detect('Reddit user: u/username123');
      expect(result.detections.some(d => d.type === 'REDDIT_USERNAME')).toBe(true);
    });

    it('should require Reddit context', () => {
      const detector = new OpenRedaction({ patterns: ['REDDIT_USERNAME'] });
      const result = detector.detect('User: u/username123');
      expect(result.detections.some(d => d.type === 'REDDIT_USERNAME')).toBe(false);
    });
  });

  describe('Nintendo Friend Code', () => {
    it('should detect Nintendo Switch Friend Code', () => {
      const detector = new OpenRedaction({ patterns: ['NINTENDO_FRIEND_CODE'] });
      const result = detector.detect('Nintendo Switch: SW-1234-5678-9012');
      expect(result.detections.some(d => d.type === 'NINTENDO_FRIEND_CODE')).toBe(true);
    });

    it('should detect without dashes', () => {
      const detector = new OpenRedaction({ patterns: ['NINTENDO_FRIEND_CODE'] });
      const result = detector.detect('Friend Code: SW 1234 5678 9012');
      expect(result.detections.some(d => d.type === 'NINTENDO_FRIEND_CODE')).toBe(true);
    });

    it('should require Nintendo context', () => {
      const detector = new OpenRedaction({ patterns: ['NINTENDO_FRIEND_CODE'] });
      const result = detector.detect('Code: SW-1234-5678-9012');
      expect(result.detections.some(d => d.type === 'NINTENDO_FRIEND_CODE')).toBe(false);
    });
  });

  describe('BattleTag', () => {
    it('should detect Battle.net BattleTag', () => {
      const detector = new OpenRedaction({ patterns: ['BATTLETAG'] });
      const result = detector.detect('Battle.net: Player#12345');
      expect(result.detections.some(d => d.type === 'BATTLETAG')).toBe(true);
    });

    it('should require Blizzard context', () => {
      const detector = new OpenRedaction({ patterns: ['BATTLETAG'] });
      const result = detector.detect('Username: Player#12345');
      expect(result.detections.some(d => d.type === 'BATTLETAG')).toBe(false);
    });

    it('should validate format', () => {
      const detector = new OpenRedaction({ patterns: ['BATTLETAG'] });
      // Too short name (< 3 chars)
      const result = detector.detect('BattleTag: AB#12345');
      expect(result.detections.some(d => d.type === 'BATTLETAG')).toBe(false);
    });
  });

  describe('Xbox Gamertag', () => {
    it('should detect Xbox Gamertag', () => {
      const detector = new OpenRedaction({ patterns: ['XBOX_GAMERTAG'] });
      const result = detector.detect('Xbox gamertag: GamerName123');
      expect(result.detections.some(d => d.type === 'XBOX_GAMERTAG')).toBe(true);
    });

    it('should require Xbox context', () => {
      const detector = new OpenRedaction({ patterns: ['XBOX_GAMERTAG'] });
      const result = detector.detect('Username: GamerName123');
      expect(result.detections.some(d => d.type === 'XBOX_GAMERTAG')).toBe(false);
    });
  });

  describe('PlayStation Network ID', () => {
    it('should detect PSN ID', () => {
      const detector = new OpenRedaction({ patterns: ['PSN_ID'] });
      const result = detector.detect('PlayStation PSN: PSN_User123');
      expect(result.detections.some(d => d.type === 'PSN_ID')).toBe(true);
    });

    it('should require PlayStation context', () => {
      const detector = new OpenRedaction({ patterns: ['PSN_ID'] });
      const result = detector.detect('Username: RandomUser123');
      expect(result.detections.some(d => d.type === 'PSN_ID')).toBe(false);
    });
  });

  describe('Telegram User ID', () => {
    it('should detect Telegram user ID', () => {
      const detector = new OpenRedaction({ patterns: ['TELEGRAM_USER_ID'] });
      const result = detector.detect('Telegram user ID: 123456789');
      expect(result.detections.some(d => d.type === 'TELEGRAM_USER_ID')).toBe(true);
    });

    it('should require 6-10 digits', () => {
      const detector = new OpenRedaction({ patterns: ['TELEGRAM_USER_ID'] });
      const result = detector.detect('Telegram: 12345'); // Only 5 digits
      expect(result.detections.some(d => d.type === 'TELEGRAM_USER_ID')).toBe(false);
    });

    it('should require Telegram context', () => {
      const detector = new OpenRedaction({ patterns: ['TELEGRAM_USER_ID'] });
      const result = detector.detect('ID: 123456789');
      expect(result.detections.some(d => d.type === 'TELEGRAM_USER_ID')).toBe(false);
    });
  });

  describe('Integration: Multiple Digital Identities', () => {
    it('should detect multiple digital identity patterns', () => {
      const detector = new OpenRedaction();
      const text = `
        Discord user: 987654321098765432
        Steam profile: 76561198012345678
        Twitter: @username123
        Facebook profile: 100012345678901
        TikTok: @user123
        YouTube channel: UC1234567890abcdefghijkl
        Reddit: u/username123
        Nintendo Switch: SW-1234-5678-9012
        Battle.net: Player#12345
        Xbox gamertag: GamerName123
        PlayStation PSN: PSN_User123
        Telegram: 123456789
      `;

      const result = detector.detect(text);

      // Verify multiple digital identity patterns are detected
      // Check for distinctive patterns with strong context
      expect(result.detections.some(d => d.type === 'STEAM_ID64')).toBe(true);
      // Social media handles may be detected as INSTAGRAM_USERNAME (higher priority) or SOCIAL_MEDIA_HANDLE
      expect(result.detections.some(d =>
        d.type === 'SOCIAL_MEDIA_HANDLE' ||
        d.type === 'INSTAGRAM_USERNAME' ||
        d.type === 'TIKTOK_USERNAME'
      )).toBe(true);
      expect(result.detections.some(d => d.type === 'REDDIT_USERNAME')).toBe(true);
      expect(result.detections.some(d => d.type === 'NINTENDO_FRIEND_CODE')).toBe(true);
      expect(result.detections.some(d => d.type === 'BATTLETAG')).toBe(true);
      expect(result.detections.some(d => d.type === 'XBOX_GAMERTAG')).toBe(true);
      expect(result.detections.some(d => d.type === 'PSN_ID')).toBe(true);

      // Verify we detected multiple different patterns
      expect(result.detections.length).toBeGreaterThan(5);
    });
  });
});
