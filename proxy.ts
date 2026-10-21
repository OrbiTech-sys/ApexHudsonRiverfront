import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listApartmentSlugs } from "@/lib/repository/apartments";

/**
 * Returns a real HTTP 404 for unknown floor plans.
 *
 * With Cache Components, unknown dynamic params are served from the app shell
 * and the page's own `notFound()` streams in afterwards, so the status would
 * stay 200 (a "soft 404"). Checking the slug here, before anything streams,
 * keeps the status correct. `notFound()` in the page remains as a backstop.
 *
 * Keep this check cheap. When apartments move to a database, replace the
 * lookup with an indexed existence query or a cached list of slugs.
 */
export const config = {
  matcher: "/apartments/:slug",
};

function readSlug(pathname: string): string | null {
  try {
    return decodeURIComponent(pathname.split("/")[2] ?? "");
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const slug = readSlug(request.nextUrl.pathname);
  const slugs = await listApartmentSlugs();

  if (slug === null || !slugs.includes(slug)) {
    // A path that matches no route makes Next render the app's not-found
    // page with a 404 status.
    return NextResponse.rewrite(new URL("/apartment-not-found", request.url));
  }

  return NextResponse.next();
}
