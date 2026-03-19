import wallRaw from '@/data/wall-of-love.json';

export type WallOfLoveEntry = {
  name: string;
  url?: string;
  logoUrl?: string;
  quote?: string;
  /** Link back to the GitHub Discussion comment, if applicable */
  discussionUrl?: string;
};

export const WALL_OF_LOVE_ENTRIES: WallOfLoveEntry[] = wallRaw as WallOfLoveEntry[];

/** Pinned “who’s using” thread — override with NEXT_PUBLIC_WALL_OF_LOVE_DISCUSSION_URL if the discussion moves */
export const WALL_OF_LOVE_SUBMIT_URL =
  typeof process.env.NEXT_PUBLIC_WALL_OF_LOVE_DISCUSSION_URL === 'string' &&
  process.env.NEXT_PUBLIC_WALL_OF_LOVE_DISCUSSION_URL.length > 0
    ? process.env.NEXT_PUBLIC_WALL_OF_LOVE_DISCUSSION_URL
    : 'https://github.com/sam247/openredaction/discussions/28';
