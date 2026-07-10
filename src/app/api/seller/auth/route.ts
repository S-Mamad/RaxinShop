import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSellerSession,
  getSellerByPhone,
  getSellerFromRequest,
  revokeSellerSession,
  sellerCookieOptions,
  SELLER_COOKIE,
  toPublicSeller,
  verifySellerPassword,
} from "@asal/lib/server/sellers";

const loginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(4),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ورود نامعتبر است" },
        { status: 400 },
      );
    }

    const seller = getSellerByPhone(parsed.data.phone);
    if (!seller || seller.status !== "active") {
      return NextResponse.json(
        { success: false, message: "فروشنده یافت نشد" },
        { status: 401 },
      );
    }

    if (!verifySellerPassword(seller, parsed.data.password)) {
      return NextResponse.json(
        { success: false, message: "رمز عبور نادرست است" },
        { status: 401 },
      );
    }

    const session = await createSellerSession(seller.id);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "ایجاد نشست ممکن نشد. در محیط لوکال دوباره تلاش کنید.",
        },
        { status: 503 },
      );
    }

    const response = NextResponse.json({
      success: true,
      seller: toPublicSeller(seller),
    });
    response.cookies.set(sellerCookieOptions(session.token));
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const seller = await getSellerFromRequest(request);
  if (!seller) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    seller: toPublicSeller(seller),
  });
}

export async function DELETE(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SELLER_COOKIE}=([^;]+)`));
  const token = match?.[1] ? decodeURIComponent(match[1]) : null;
  if (token) await revokeSellerSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SELLER_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
