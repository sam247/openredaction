import Link from 'next/link';
import { Heart, ExternalLink } from 'lucide-react';
import {
  WALL_OF_LOVE_ENTRIES,
  WALL_OF_LOVE_SUBMIT_URL,
  type WallOfLoveEntry,
} from '@/lib/wall-of-love';

function WallCard({ entry }: { entry: WallOfLoveEntry }) {
  const title = entry.url ? (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white font-semibold hover:text-gray-200 inline-flex items-center gap-1.5 group"
    >
      {entry.name}
      <ExternalLink size={14} className="text-gray-500 group-hover:text-gray-400 shrink-0" aria-hidden />
    </a>
  ) : (
    <span className="text-white font-semibold">{entry.name}</span>
  );

  return (
    <article className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        {entry.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external press logos; avoid remotePatterns churn
          <img
            src={entry.logoUrl}
            alt=""
            className="h-10 w-auto max-w-[120px] object-contain object-left"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 text-sm font-semibold shrink-0"
            aria-hidden
          >
            {entry.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">{title}</div>
      </div>
      {entry.quote ? (
        <p className="text-gray-300 text-sm leading-relaxed flex-grow">&ldquo;{entry.quote}&rdquo;</p>
      ) : (
        <p className="text-gray-500 text-sm flex-grow">Using Open Redaction in production.</p>
      )}
      {entry.discussionUrl ? (
        <a
          href={entry.discussionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-400 mt-4 inline-flex items-center gap-1"
        >
          Source on GitHub
          <ExternalLink size={12} aria-hidden />
        </a>
      ) : null}
    </article>
  );
}

type WallOfLoveProps = {
  variant?: 'homepage' | 'full';
  id?: string;
};

export default function WallOfLove({ variant = 'full', id = 'wall-of-love' }: WallOfLoveProps) {
  const limit = variant === 'homepage' ? 6 : WALL_OF_LOVE_ENTRIES.length;
  const entries = WALL_OF_LOVE_ENTRIES.slice(0, limit);
  const hasMore = variant === 'homepage' && WALL_OF_LOVE_ENTRIES.length > limit;

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 border border-gray-800 mb-6">
          <Heart className="text-red-400" size={22} aria-hidden />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Who&rsquo;s using Open Redaction?</h2>
        <p className="text-xl text-gray-300">
          Teams and projects that agreed to be listed. Submissions are curated from{' '}
          <a
            href={WALL_OF_LOVE_SUBMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-gray-200"
          >
            GitHub Discussions
          </a>
          .
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950/50 p-10 text-center max-w-2xl mx-auto">
          <p className="text-gray-300 mb-6">
            No public listings yet. If you use Open Redaction, tell us how — we&rsquo;ll add you here after you
            confirm you&rsquo;re happy to be on the site.
          </p>
          <a
            href={WALL_OF_LOVE_SUBMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Share on GitHub Discussions
          </a>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry, i) => (
              <WallCard key={`${entry.name}-${i}`} entry={entry} />
            ))}
          </div>
          {hasMore ? (
            <div className="text-center mt-10">
              <Link
                href="/community"
                className="text-white font-medium hover:text-gray-300 underline underline-offset-4"
              >
                View all {WALL_OF_LOVE_ENTRIES.length} listings →
              </Link>
            </div>
          ) : null}
        </>
      )}

      {entries.length > 0 ? (
        <div className="text-center mt-10">
          <a
            href={WALL_OF_LOVE_SUBMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-400"
          >
            Using Open Redaction? Get listed →
          </a>
        </div>
      ) : null}
    </section>
  );
}
