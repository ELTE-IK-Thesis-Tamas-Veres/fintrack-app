import { NextResponse, type NextRequest } from "next/server";

import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  let authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  const session = await auth0.getSession(request);

  if (
    !session &&
    !request.nextUrl.pathname.startsWith("/api") &&
    request.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    const session = await auth0.getSession(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await auth0.getAccessToken(request, authRes);

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login", request.nextUrl.origin)
      );
    }

    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set("Authorization", `Bearer ${token}`);

    const resWithHeaders = NextResponse.next({
      request: {
        headers: modifiedHeaders,
      },
    });

    authRes = resWithHeaders;
  }

  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
  ],
};
