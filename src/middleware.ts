import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionTokenFromRequest,
  parseSessionTokenEdge,
} from "@asal/lib/auth/session-edge";

const PROTECTED_PREFIXES = [
  "/hajiasal/checkout",
  "/hajiasal/account",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/hajiasal/checkout/:path*", "/hajiasal/account/:path*"],
};
