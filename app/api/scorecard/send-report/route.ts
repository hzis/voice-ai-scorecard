import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ScorecardResult } from "@/lib/scoring";

// Send email via Gmail API using stored OAuth credentials
async function getGmailAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID!,
    client_secret: process.env.GMAIL_CLIENT_SECRET!,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(`OAuth error: ${data.error}`);
  return data.access_token;
}

function buildEmailMime(to: string, subject: string, htmlBody: string): string {
  const mime = [
    `From: Talkra AI <talkra.ai@gmail.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    htmlBody,
  ].join("\r\n");
  return Buffer.from(mime).toString("base64url");
}

async function sendGmail(to: string, subject: string, html: string): Promise<void> {
  const token = await getGmailAccessToken();
  const raw = buildEmailMime(to, subject, html);
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const err = await res.json() as { error?: { message?: string } };
    throw new Error(`Gmail API error: ${err?.error?.message ?? res.status}`);
  }
}

function generateEmailHtml(result: ScorecardResult, email: string): string {
  const levelColors: Record<string, string> = {
    "not-ready": "#dc2626",
    exploring: "#d97706",
    ready: "#16a34a",
    champion: "#2563eb",
  };
  const levelLabels: Record<string, string> = {
    "not-ready": "Not Ready",
    exploring: "Exploring",
    ready: "Ready",
    champion: "Champion 🏆",
  };

  const color = levelColors[result.level] ?? "#3b82f6";
  const label = levelLabels[result.level] ?? result.level;

  const categoriesHtml = result.categories
    .map(
      (cat) => `
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#374151;">${cat.label}</td>
        <td style="padding:8px 0;text-align:right;font-size:14px;font-weight:600;color:#111827;">${cat.score}/100</td>
      </tr>
      <tr>
        <td colspan="2" style="padding-bottom:12px;">
          <div style="background:#e5e7eb;border-radius:99px;height:8px;overflow:hidden;">
            <div style="background:${color};height:8px;border-radius:99px;width:${cat.score}%;"></div>
          </div>
        </td>
      </tr>`
    )
    .join("");

  const recsHtml = result.recommendations
    .map(
      (rec, i) => `
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:32px;">
          <span style="display:inline-block;background:${color};color:white;border-radius:50%;width:22px;height:22px;line-height:22px;text-align:center;font-size:12px;font-weight:700;">${i + 1}</span>
        </td>
        <td style="padding:10px 0;font-size:14px;color:#374151;line-height:1.5;">${rec}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:40px 32px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Voice AI Scorecard</div>
            <div style="font-size:72px;font-weight:800;color:white;line-height:1;">${result.totalScore}</div>
            <div style="font-size:16px;color:rgba(255,255,255,0.8);margin-top:4px;">out of 100</div>
            <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:99px;padding:6px 20px;margin-top:16px;font-size:15px;font-weight:600;color:white;">${label}</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            <h2 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 20px;">Category Breakdown</h2>
            <table width="100%" cellpadding="0" cellspacing="0">${categoriesHtml}</table>

            <h2 style="font-size:18px;font-weight:700;color:#111827;margin:32px 0 16px;">Top Recommendations</h2>
            <table width="100%" cellpadding="0" cellspacing="0">${recsHtml}</table>

            <!-- ROI -->
            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin:28px 0;">
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#0369a1;margin-bottom:8px;">💰 ROI Estimate</div>
              <div style="font-size:15px;color:#0c4a6e;line-height:1.5;">${result.roiEstimate}</div>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin:32px 0 8px;">
              <a href="https://cal.com/talkra" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:16px 36px;border-radius:8px;font-size:16px;font-weight:700;">📞 Book a Talkra Demo</a>
              <div style="font-size:13px;color:#6b7280;margin-top:12px;">See a live AI voice agent built for your industry — free 20-min demo</div>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
            <div style="font-size:13px;color:#9ca3af;">Sent to ${email} · <a href="https://scorecard.talkra.ai" style="color:#6b7280;">scorecard.talkra.ai</a></div>
            <div style="font-size:12px;color:#9ca3af;margin-top:4px;">© 2026 Talkra.AI · talkra.ai@gmail.com</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, sessionId } = (await req.json()) as {
      email: string;
      sessionId: string;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required." }, { status: 400 });
    }

    const scorecard = await db.scorecard.findUnique({ where: { sessionId } });
    if (!scorecard || !scorecard.paid) {
      return NextResponse.json({ error: "Scorecard not found or not paid." }, { status: 404 });
    }

    const result = scorecard.result as unknown as ScorecardResult;
    const html = generateEmailHtml(result, email);
    const subject = `Your Voice AI Readiness Score: ${result.totalScore}/100 — ${
      result.level === "champion" ? "🏆 Champion"
      : result.level === "ready" ? "✅ Ready"
      : result.level === "exploring" ? "🔍 Exploring"
      : "🔧 Action Required"
    }`;

    await sendGmail(email, subject, html);

    await db.scorecard.update({
      where: { sessionId },
      data: { email, emailSentAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("send-report error:", msg);
    return NextResponse.json({ error: "Failed to send report.", detail: msg }, { status: 500 });
  }
}
