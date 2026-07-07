import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { readJsonFile, writeJsonFile } from "./db";
import { getSupabaseAdmin } from "./supabase";

const SESSIONS_FILE = "admin-sessions.json";
const SESSION_DAYS = 7;

export interface AdminSession {
  id: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateAdminToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function createAdminSession(meta?: {
  ipAddress?: string;
  userAgent?: string;
}): Promise<{ sessionId: string; token: string }> {
  const sessionId = randomUUID();
  const token = generateAdminToken();
  const tokenHash = hashToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const session: AdminSession = {
    id: sessionId,
    tokenHash,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("admin_sessions").insert({
      id: sessionId,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      ip_address: meta?.ipAddress ?? null,
      user_agent: meta?.userAgent ?? null,
    });
  } else {
    const sessions = await readJsonFile<AdminSession[]>(SESSIONS_FILE, []);
    sessions.push(session);
    await writeJsonFile(SESSIONS_FILE, sessions);
  }

  return { sessionId, token };
}

export async function validateAdminSessionToken(
  token: string,
): Promise<boolean> {
  if (!token) return false;
  const tokenHash = hashToken(token);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("admin_sessions")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("revoked_at", null)
      .maybeSingle();

    if (!data) return false;
    if (new Date(data.expires_at as string).getTime() < Date.now()) return false;
    return true;
  }

  const sessions = await readJsonFile<AdminSession[]>(SESSIONS_FILE, []);
  const session = sessions.find(
    (s) => s.tokenHash === tokenHash && !s.revokedAt,
  );
  if (!session) return false;
  if (new Date(session.expiresAt).getTime() < Date.now()) return false;
  return true;
}

export async function revokeAdminSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", tokenHash);
    return;
  }

  const sessions = await readJsonFile<AdminSession[]>(SESSIONS_FILE, []);
  const updated = sessions.map((s) =>
    s.tokenHash === tokenHash
      ? { ...s, revokedAt: new Date().toISOString() }
      : s,
  );
  await writeJsonFile(SESSIONS_FILE, updated);
}

export function safeCompareTokens(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}
