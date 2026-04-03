import { NextResponse } from "next/server";

import type { SiteContent } from "@/data/site-content";
import { defaultSiteContent } from "@/data/site-content";
import { getCmsStatus, readSupabaseSiteContent, writeSupabaseSiteContent } from "@/lib/supabase-content";

export const runtime = "nodejs";

type UpdateContentRequest = {
  content?: SiteContent;
  secret?: string;
};

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const requiredKeys = ["site", "navigation", "hero", "about", "services", "projects", "resume", "blog", "contact"];
  return requiredKeys.every((key) => key in value);
}

export async function GET() {
  const remoteContent = await readSupabaseSiteContent();
  const content = remoteContent ?? defaultSiteContent;

  return NextResponse.json({
    content,
    status: getCmsStatus()
  });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as UpdateContentRequest;

    if (!body.secret) {
      return NextResponse.json({ error: "Admin secret is required." }, { status: 401 });
    }

    if (!body.content || !isSiteContent(body.content)) {
      return NextResponse.json({ error: "Submitted content is invalid." }, { status: 400 });
    }

    const result = await writeSupabaseSiteContent(body.content, body.secret);

    return NextResponse.json({
      message: "Content saved to Supabase.",
      content: result.content
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";

    return NextResponse.json(
      {
        error: message
      },
      {
        status: message === "Invalid admin secret." ? 401 : 500
      }
    );
  }
}
