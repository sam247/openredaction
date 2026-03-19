import { NextRequest, NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';
import { addResendAudienceContact } from '@/lib/waitlist/add-resend-audience-contact';

const resendApiKey = process.env.RESEND_API_KEY;
/** Optional: only if you use a legacy Resend audience or need a specific list ID. */
const audienceId = process.env.RESEND_WORDPRESS_WAITLIST_AUDIENCE_ID?.trim() || undefined;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitName(name: string): { firstName?: string; lastName?: string } {
  const trimmed = name.trim();
  if (!trimmed) return {};
  const space = trimmed.indexOf(' ');
  if (space === -1) {
    return { firstName: trimmed };
  }
  return {
    firstName: trimmed.slice(0, space).trim(),
    lastName: trimmed.slice(space + 1).trim() || undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!resendApiKey) {
      console.error('[wordpress-waitlist] RESEND_API_KEY missing');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const emailRaw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const source =
      typeof body.source === 'string' ? body.source.trim().slice(0, 64) : undefined;

    if (!name || !emailRaw) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!isValidEmail(emailRaw)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    console.log('[wordpress-waitlist] submit', { source: source || 'unspecified' });

    const { firstName, lastName } = splitName(name);

    const result = await addResendAudienceContact({
      apiKey: resendApiKey,
      ...(audienceId ? { audienceId } : {}),
      email: emailRaw,
      firstName,
      lastName,
    });

    if (!result.ok) {
      console.error('[wordpress-waitlist] resend_failed', {
        code: result.code,
        statusCode: result.statusCode,
      });
      return NextResponse.json({ error: 'Could not join waitlist. Try again later.' }, { status: 502 });
    }

    if (result.duplicate) {
      console.log('[wordpress-waitlist] duplicate_soft_success');
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    console.log('[wordpress-waitlist] subscribed');
    return NextResponse.json({ success: true, alreadySubscribed: false });
  } catch (e) {
    console.error('[wordpress-waitlist] error', e);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
