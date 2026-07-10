import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionTokenFromRequest,
  parseSessionTokenEdge,
} from "@asal/lib/auth/session-edge";

const PROTECTED_PREFIXES = ["/hajiasal/account"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin/seller panel auth is enforced in route layouts + API cookies.
  if (
    pathname.startsWith("/hajiasal/admin") ||
    pathname.startsWith("/hajiasal/seller")
  ) {
    return NextResponse.next();
  }

  if (isProtected(pathname)) {
    const token = getSessionTokenFromRequest(request);
    const session = token ? await parseSessionTokenEdge(token) : null;
    if (!session) {
      const loginUrl = new URL("/hajiasal/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/hajiasal/account/:path*",
    "/hajiasal/admin",
    "/hajiasal/admin/:path*",
    "/hajiasal/seller",
    "/hajiasal/seller/:path*",
  ],
};
