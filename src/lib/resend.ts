import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Resend requires "Display Name <email>" format for the from field.
// Wrap the raw email address if it doesn't already include angle brackets.
function formatFromEmail(raw: string): string {
  if (raw.includes("<")) return raw; // already formatted
  return `Upmark <${raw}>`;
}

export const FROM_EMAIL = formatFromEmail(
  process.env.RESEND_FROM_EMAIL || "noreply@upmark.co"
);

export const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "hello@upmark.co";
