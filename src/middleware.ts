import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionTokenFromRequest,
  parseSessionTokenEdge,
} from "@asal/lib/auth/session-edge";

const ADMIN_COOKIE = "hajiasal_admin_session";

const PROTECTED_PREFIXES = [
  "/hajiasal/checkout",
  "/hajiasal/account",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function hasAdminCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get(ADMIN_COOKIE)?.value);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/hajiasal/admin")) {
    const isLoginPage = pathname === "/hajiasal/admin";
    if (!isLoginPage && !hasAdminCookie(request)) {
      return NextResponse.redirect(new URL("/hajiasal/admin", request.url));
    }
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
    "/hajiasal/checkout/:path*",
    "/hajiasal/account/:path*",
    "/hajiasal/admin",
    "/hajiasal/admin/:path*",
  ],
};
