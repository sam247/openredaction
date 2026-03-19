'use client';

import WordPressWaitlistModal from '@/components/WordPressWaitlistModal';

/** One modal for the whole site: timed open + listeners from page triggers. */
export default function WordPressWaitlistRoot() {
  return (
    <WordPressWaitlistModal
      source="site"
      hideTrigger
      listenForOpenEvent
      autoOpenAfterMs={10_000}
    />
  );
}
