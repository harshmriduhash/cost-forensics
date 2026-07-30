const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "notifications@costforensics.app";
const APP_URL = process.env.APP_URL ?? "https://costforensics.app";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(message: EmailMessage) {
  if (!RESEND_API_KEY) {
    return { ok: false as const, skipped: "missing_resend_api_key" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend error ${response.status}: ${body}`);
    }

    return { ok: true as const };
  } catch (error) {
    console.error("[email] send failed", error);
    return { ok: false as const, error: error instanceof Error ? error.message : "unknown" };
  }
}

export async function sendNotificationEmail({
  to,
  title,
  body,
  ctaUrl = `${APP_URL}/dashboard`,
}: {
  to: string;
  title: string;
  body: string;
  ctaUrl?: string;
}) {
  return sendEmail({
    to,
    subject: `Cost Forensics • ${title}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin-bottom: 8px;">${escapeHtml(title)}</h2>
        <p style="margin: 0 0 16px;">${escapeHtml(body)}</p>
        <a href="${escapeHtml(ctaUrl)}" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: #2563eb; color: #fff; text-decoration: none;">
          Open dashboard
        </a>
      </div>
    `,
    text: `${title}\n\n${body}\n\nOpen dashboard: ${ctaUrl}`,
  });
}
