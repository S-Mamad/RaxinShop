import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminSessionToken,
  verifyAdminPassword,
} from "@asal/lib/server/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body.password as string | undefined;

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: "رمز عبور نادرست است" },
        { status: 401 },
      );
    }

    const token = getAdminSessionToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "پنل ادمین پیکربندی نشده است" },
        { status: 503 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
