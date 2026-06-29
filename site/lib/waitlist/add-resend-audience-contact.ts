import { Resend } from "resend";

export type AddResendAudienceContactResult =
  | { ok: true; contactId?: string; duplicate: boolean }
  | { ok: false; code: string; statusCode: number | null };

/**
 * Adds a contact via Resend Contacts API.
 * - With `audienceId`: POST /audiences/{id}/contacts (legacy / explicit list).
 * - Without `audienceId`: POST /contacts — matches the current Resend dashboard default
 *   (workspace Audience); no separate “audience ID” is required in the UI.
 */
export async function addResendAudienceContact(params: {
  apiKey: string;
  /** Optional. Omit to use workspace-level contacts (Resend’s default Audience). */
  audienceId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  properties?: Record<string, string | number | null>;
}): Promise<AddResendAudienceContactResult> {
  const resend = new Resend(params.apiKey);
  const { data, error } = await resend.contacts.create({
    ...(params.audienceId ? { audienceId: params.audienceId } : {}),
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    properties: params.properties,
    unsubscribed: false,
  });

  if (!error && data?.id) {
    return { ok: true, contactId: data.id, duplicate: false };
  }

  if (error) {
    const msg = (error.message || "").toLowerCase();
    const duplicate =
      msg.includes("already") ||
      msg.includes("duplicate") ||
      msg.includes("exists") ||
      error.statusCode === 409;
    if (duplicate) {
      return { ok: true, duplicate: true };
    }
    return {
      ok: false,
      code: error.name || "resend_error",
      statusCode: error.statusCode,
    };
  }

  return { ok: false, code: "unknown", statusCode: null };
}
