import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hajiasal_admin_session";

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function getAdminSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return hashToken(password);
}

export function verifyAdminPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const inputHash = hashToken(input);
  const expectedHash = hashToken(password);

  try {
    return timingSafeEqual(
      Buffer.from(inputHash, "hex"),
      Buffer.from(expectedHash, "hex"),
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = getAdminSessionToken();
  if (!token) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!session) return false;

  try {
    return timingSafeEqual(Buffer.from(session, "hex"), Buffer.from(token, "hex"));
  } catch {
    return false;
  }
}

export function isAdminRequestAuthenticated(request: Request): boolean {
  const token = getAdminSessionToken();
  if (!token) return false;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  const session = match?.[1];
  if (!session) return false;

  try {
    return timingSafeEqual(Buffer.from(session, "hex"), Buffer.from(token, "hex"));
  } catch {
    return false;
  }
}
