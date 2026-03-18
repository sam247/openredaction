import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const TO_EMAIL = 'sampettiford@googlemail.com';
// Use environment variable if set, otherwise fallback to a default
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'support@openredaction.com';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, useCase, interest, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (!resend) {
      console.error('Resend client not initialized - RESEND_API_KEY is missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Email content
    const textContent = `
New Contact Form Submission from OpenRedaction

From: ${name} <${email}>
Company: ${company || 'Not provided'}
Use Case/Industry: ${useCase || 'Not provided'}
Interest: ${interest || 'Not specified'}

Message:
${message}

---
Sent from OpenRedaction contact form
Timestamp: ${new Date().toISOString()}
    `.trim();

    // Send email via Resend
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `OpenRedaction Contact Form: ${name} - ${interest || 'General Inquiry'}`,
      text: textContent,
    });

    console.log('Contact form email sent successfully:', { name, email, interest, result });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
