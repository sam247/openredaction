'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface BlogPostTrackerProps {
  slug: string;
  title: string;
}

export default function BlogPostTracker({ slug, title }: BlogPostTrackerProps) {
  useEffect(() => {
    analytics.blogPostView(slug, title);
  }, [slug, title]);

  return null;
}

