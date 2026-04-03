import { NextResponse } from "next/server";

import type { SiteContent } from "@/data/site-content";
import { getBundledSiteContent, getCmsStatus, isSiteContent, readGithubSiteContent, writeGithubSiteContent } from "@/lib/github-cms";

export const runtime = "nodejs";

type UpdateContentRequest = {
  content?: SiteContent;
  secret?: string;
};

export async function GET() {
  const remoteContent = await readGithubSiteContent();
  const content = remoteContent ?? getBundledSiteContent();

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

    const result = await writeGithubSiteContent(body.content, body.secret);

    return NextResponse.json({
      message: "Content saved. Your live site will read the new version on the next request.",
      commitUrl: result.commitUrl,
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
