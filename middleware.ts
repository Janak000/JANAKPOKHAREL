import { NextResponse, type NextRequest } from "next/server";

/**
 * Mixed-case paths used to 404 (e.g. /Services). Redirect them to the
 * lowercase canonical form so no inbound link is wasted.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname !== pathname.toLowerCase()) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/|api/|image/|favicon|robots\\.txt|sitemap\\.xml|llms\\.txt|feed\\.xml|manifest).*)",
};
