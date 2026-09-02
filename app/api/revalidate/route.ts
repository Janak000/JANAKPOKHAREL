import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called by the CMS after saving content so changes go live immediately
// instead of waiting for the ISR window. Authenticated by verifying the
// caller's Supabase session belongs to a registered admin.
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 401 });
  }

  // RLS lets a user read only their own admin_users row, so a non-empty
  // result proves the caller is an admin.
  const check = await fetch(
    `${url}/rest/v1/admin_users?select=user_id&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${token}` } }
  );
  if (!check.ok) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
  const rows = (await check.json()) as unknown[];
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Not an admin." }, { status: 403 });
  }

  revalidateTag("content");
  return NextResponse.json({ revalidated: true });
}
