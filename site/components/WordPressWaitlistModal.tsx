'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const DEFAULT_DISMISSAL_STORAGE_KEY = 'openredaction_wp_waitlist_dismissed_at';

function safeTrackWaitlistOpen(source: string) {
  try {
    analytics.wordpressWaitlistOpen(source);
  } catch {
    /* never block modal open on analytics */
  }
}

function readDismissedAt(storageKey: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const t = parseInt(raw, 10);
    return Number.isNaN(t) ? null : t;
  } catch {
    return null;
  }
}

function isDismissedWithin48h(storageKey: string): boolean {
  const at = readDismissedAt(storageKey);
  if (at == null) return false;
  return Date.now() - at < FORTY_EIGHT_HOURS_MS;
}

function writeDismissedNow(storageKey: string) {
  try {
    localStorage.setItem(storageKey, String(Date.now()));
  } catch {
    /* private mode / quota */
  }
}

export type WordPressWaitlistSource =
  | 'playground'
  | 'roadmap'
  | 'pricing'
  | 'changelog'
  | string;

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function WordPressWaitlistModal({
  source,
  triggerLabel = 'WordPress plugin — join waitlist',
  className = '',
  triggerClassName = '',
}: {
  source: WordPressWaitlistSource;
  triggerLabel?: string;
  /** Wrapper around the trigger button */
  className?: string;
  triggerClassName?: string;
}) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  /** Avoid SSR / hydration mismatch; portal only attaches after mount. */
  const [mounted, setMounted] = useState(false);
  const autoOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Same key everywhere: closing the waitlist on any page suppresses timed auto-open for 48h. */
  const storageKey = dismissalStorageKey ?? DEFAULT_DISMISSAL_STORAGE_KEY;

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearAutoOpenTimer = useCallback(() => {
    if (autoOpenTimerRef.current != null) {
      clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setClientError(null);
    if (submitState !== 'loading') {
      setSubmitState('idle');
      setAlreadySubscribed(false);
    }
    writeDismissedNow(storageKey);
  }, [submitState, storageKey]);

  const openModal = useCallback(() => {
    clearAutoOpenTimer();
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setClientError(null);
    setSubmitState('idle');
    setAlreadySubscribed(false);
    setOpen(true);
    safeTrackWaitlistOpen(source);
  }, [source, clearAutoOpenTimer]);

  /** Delayed auto-open (e.g. playground): skipped if dismissed within 48h on any page using this modal. */
  useEffect(() => {
    if (!mounted || autoOpenAfterMs == null || autoOpenAfterMs <= 0) {
      return undefined;
    }
    if (typeof window === 'undefined') return undefined;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    if (isDismissedWithin48h(storageKey)) {
      return undefined;
    }

    const tid = window.setTimeout(() => {
      autoOpenTimerRef.current = null;
      if (isDismissedWithin48h(storageKey)) return;
      lastFocusRef.current = document.activeElement as HTMLElement | null;
      setClientError(null);
      setSubmitState('idle');
      setAlreadySubscribed(false);
      setOpen(true);
      safeTrackWaitlistOpen(source);
    }, autoOpenAfterMs);

    autoOpenTimerRef.current = tid;
    return () => {
      clearTimeout(tid);
      if (autoOpenTimerRef.current === tid) {
        autoOpenTimerRef.current = null;
      }
    };
  }, [mounted, storageKey, autoOpenAfterMs, source]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const t = requestAnimationFrame(() => nameInputRef.current?.focus());
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open && lastFocusRef.current) {
      lastFocusRef.current.focus();
      lastFocusRef.current = null;
    }
  }, [open]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setClientError('Please enter your name.');
      return false;
    }
    if (!email.trim()) {
      setClientError('Please enter your email.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setClientError('Please enter a valid email address.');
      return false;
    }
    setClientError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitState('loading');
    analytics.wordpressWaitlistSubmit(source);

    try {
      const response = await fetch('/api/wordpress-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          source,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errType =
          response.status === 403
            ? 'forbidden'
            : response.status === 503
              ? 'unavailable'
              : 'http_error';
        analytics.wordpressWaitlistError(source, errType);
        setSubmitState('error');
        setClientError(
          typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.'
        );
        return;
      }

      setAlreadySubscribed(!!data.alreadySubscribed);
      setSubmitState('success');
      analytics.wordpressWaitlistSuccess(source);
    } catch {
      analytics.wordpressWaitlistError(source, 'network');
      setSubmitState('error');
      setClientError('Network error. Check your connection and try again.');
    }
  };

  const overlay =
    mounted &&
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70"
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative w-full max-w-md rounded-lg border border-gray-800 bg-gray-950 text-white shadow-2xl"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <div className="p-6 pt-10">
            <h2 id={titleId} className="text-lg font-semibold text-white pr-8">
              WordPress plugin waitlist
            </h2>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              We&apos;re exploring a future plugin for forms, comments, and UGC redaction. Join for
              updates only — no spam. We use your email only for plugin-related updates.
            </p>

            {submitState === 'success' ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-300">
                  {alreadySubscribed
                    ? "You're already on the list — we'll keep you posted."
                    : "You're on the list. We'll email you when there's news."}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label htmlFor={`${titleId}-name`} className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    ref={nameInputRef}
                    id={`${titleId}-name`}
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder="Your name"
                    disabled={submitState === 'loading'}
                  />
                </div>
                <div>
                  <label htmlFor={`${titleId}-email`} className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id={`${titleId}-email`}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder="you@example.com"
                    disabled={submitState === 'loading'}
                  />
                </div>
                {clientError && (
                  <p className="text-sm text-red-400" role="alert">
                    {clientError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {submitState === 'loading' ? 'Joining…' : 'Join waitlist'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={openModal}
          className={
            triggerClassName ||
            'inline-flex items-center justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600'
          }
        >
          {triggerLabel}
        </button>
      </div>
      {overlay}
    </>
  );
}
