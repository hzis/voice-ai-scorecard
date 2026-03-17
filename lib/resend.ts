import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

export async function sendWelcomeEmail(user: {
  email: string;
  name?: string;
}) {
  return getResend().emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_URL ?? "our app"}!`,
    html: `
      <h1>Welcome${user.name ? `, ${user.name}` : ""}!</h1>
      <p>We're excited to have you on board.</p>
      <p>Get started by visiting your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">dashboard</a>.</p>
    `,
  });
}

export async function sendUpgradeEmail(user: {
  email: string;
  name?: string;
}) {
  return getResend().emails.send({
    from: "billing@resend.dev",
    to: user.email,
    subject: "You're approaching your usage limit",
    html: `
      <h1>Time to upgrade?</h1>
      <p>Hi${user.name ? ` ${user.name}` : ""}, you're nearing your monthly limit.</p>
      <p>Upgrade to Pro for 100x more requests and premium features.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/billing">View plans</a></p>
    `,
  });
}
