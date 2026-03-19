'use client';

import {
  WP_WAITLIST_OPEN_EVENT,
  type WordPressWaitlistSource,
} from '@/components/WordPressWaitlistModal';

export default function WordPressWaitlistTrigger({
  source,
  triggerLabel,
  className = '',
  triggerClassName = '',
}: {
  source: WordPressWaitlistSource;
  triggerLabel: string;
  className?: string;
  triggerClassName?: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent(WP_WAITLIST_OPEN_EVENT, { detail: { source } })
          )
        }
        className={
          triggerClassName ||
          'inline-flex items-center justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600'
        }
      >
        {triggerLabel}
      </button>
    </div>
  );
}
