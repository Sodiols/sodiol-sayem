import { type ContactResponse, validateContact } from "@/lib/contact";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500;

// Best effort only: resets on cold start and is per instance.
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (recentByIp.size > 1000) recentByIp.clear();
  const recent = (recentByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  recentByIp.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function respond(body: ContactResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return respond({ ok: false, reason: "invalid", errors: {} }, 400);
  }

  // Honeypot filled or submitted faster than a person could type: accept quietly, send nothing.
  const elapsed = Number(input.elapsed);
  if (input.company || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return respond({ ok: true }, 200);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return respond({ ok: false, reason: "rate_limited" }, 429);
  }

  const { fields, errors, valid } = validateContact(input);
  if (!valid) {
    return respond({ ok: false, reason: "invalid", errors }, 422);
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    return respond({ ok: false, reason: "not_configured" }, 503);
  }

  const delivery = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [CONTACT_TO_EMAIL],
      reply_to: fields.email,
      subject: `New message from ${fields.name}`,
      text: `${fields.message}\n\n— ${fields.name} <${fields.email}>`,
      html: `<p>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p><p>— ${escapeHtml(fields.name)} &lt;${escapeHtml(fields.email)}&gt;</p>`,
    }),
  }).catch(() => null);

  if (!delivery?.ok) {
    console.error("Contact delivery failed", delivery?.status);
    return respond({ ok: false, reason: "failed" }, 502);
  }

  return respond({ ok: true }, 200);
}
