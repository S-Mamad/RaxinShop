import { appendToJsonArray, readJsonFile } from "./db";
import { getSupabaseAdmin } from "./supabase";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const ATTEMPTS_FILE = "admin-login-attempts.json";

interface LoginAttempt {
  ipAddress: string;
  attemptedAt: string;
  success: boolean;
}

const memoryAttempts = new Map<string, number[]>();

export async function checkAdminLoginRateLimit(
  ipAddress: string,
): Promise<{ allowed: boolean; message?: string }> {
  const now = Date.now();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const since = new Date(now - WINDOW_MS).toISOString();
    const { count } = await supabase
      .from("admin_login_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ipAddress)
      .eq("success", false)
      .gte("attempted_at", since);

    if ((count ?? 0) >= MAX_ATTEMPTS) {
      return {
        allowed: false,
        message: "تعداد تلاش بیش از حد. ۱۵ دقیقه صبر کنید",
      };
    }
    return { allowed: true };
  }

  const times = (memoryAttempts.get(ipAddress) ?? []).filter(
    (t) => now - t < WINDOW_MS,
  );
  if (times.length >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      message: "تعداد تلاش بیش از حد. ۱۵ دقیقه صبر کنید",
    };
  }
  return { allowed: true };
}

export async function recordAdminLoginAttempt(
  ipAddress: string,
  success: boolean,
): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("admin_login_attempts").insert({
      ip_address: ipAddress,
      success,
    });
    return;
  }

  if (!success) {
    const now = Date.now();
    const times = (memoryAttempts.get(ipAddress) ?? []).filter(
      (t) => now - t < WINDOW_MS,
    );
    memoryAttempts.set(ipAddress, [...times, now]);
  }

  await appendToJsonArray(ATTEMPTS_FILE, {
    ipAddress,
    attemptedAt: new Date().toISOString(),
    success,
  } as LoginAttempt);
}
