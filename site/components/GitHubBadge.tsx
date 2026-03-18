'use client';

import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface GitHubBadgeProps {
  repo: string; // e.g., "sam247/openredaction"
  showStars?: boolean;
  className?: string;
}

export default function GitHubBadge({ repo, showStars = true, className = '' }: GitHubBadgeProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // Fetch GitHub stars
    if (showStars) {
      fetch(`https://api.github.com/repos/${repo}`)
        .then(res => res.json())
        .then(data => {
          if (data.stargazers_count) {
            setStars(data.stargazers_count);
          }
        })
        .catch(() => {
          // Silently fail - badge will still show without star count
        });
    }
  }, [repo, showStars]);

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-md px-3 py-2 transition-colors ${className}`}
      onClick={() => analytics.externalLinkClick('github', 'header', 'GitHub Badge')}
    >
      <Github size={18} />
      <span className="text-sm font-medium">GitHub</span>
      {showStars && stars !== null && (
        <span className="text-xs text-gray-400">⭐ {stars.toLocaleString()}</span>
      )}
    </a>
  );
}

