import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const topic = String(payload.topic ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const honeypot = String(payload.website ?? "").trim();

  // Bots fill the hidden field; pretend success so they move on.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: "Please write a message." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return NextResponse.json(
      { error: "Contact form is not configured yet. Please email directly." },
      { status: 503 }
    );
  }

  const res = await fetch(`${url}/rest/v1/messages`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, email, topic, message }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again or email directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
