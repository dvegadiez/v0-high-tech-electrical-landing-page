import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
      const { name, email, message, phone, serviceType } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields: name, email, message" }, { status: 400 });
    }

    // basic server-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json({ error: 'Missing RESEND_API_KEY on server' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

      const text = `New web quote request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone ?? ''}\nService Type: ${serviceType ?? ''}\n\nMessage:\n${message}`;

    const html = `
      <div style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111">
        <h2>New web quote request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Phone:</strong> ${escapeHtml(phone ?? '')}</p>
          <p><strong>Service Type:</strong> ${escapeHtml(serviceType ?? '')}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <div style="white-space:pre-wrap; background:#f6f6f6; padding:12px; border-radius:6px">${escapeHtml(message)}</div>
      </div>
    `;

    await resend.emails.send({
      from: "HT Electrical <contact@htelectrical.us>",
      to: "contact@htelectrical.us",
      subject: "New web quote request:",
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log the error server-side for debugging
    // eslint-disable-next-line no-console
    console.error("Error sending contact email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
