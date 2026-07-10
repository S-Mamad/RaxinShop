import { createHash, randomInt } from "crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@asal/lib/server/supabase";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 10 * 60 * 1000;

interface MemoryChallenge {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

const memoryChallenges = new Map<string, MemoryChallenge>();
const sendLog = new Map<string, number[]>();

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function generateCode(): string {
  return String(randomInt(1000, 10000));
}

export function checkSendRateLimit(phone: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const times = (sendLog.get(phone) ?? []).filter((t) => now - t < SEND_WINDOW_MS);
  if (times.length >= MAX_SENDS_PER_WINDOW) {
    return {
      allowed: false,
      message: "لطفاً چند دقیقه صبر کنید و دوباره تلاش کنید",
    };
  }
  sendLog.set(phone, [...times, now]);
  return { allowed: true };
}

export async function createOtpChallenge(
  phone: string,
  fixedCode?: string,
): Promise<string> {
  if (process.env.NODE_ENV === "production" && !isSupabaseConfigured()) {
    throw new Error("Supabase is required for OTP in production");
  }

  const code = fixedCode ?? generateCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("otp_challenges").insert({
      phone,
      code_hash: codeHash,
      expires_at: expiresAt,
      attempts: 0,
    });
  } else {
    memoryChallenges.set(phone, {
      codeHash,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });
  }

  return code;
}

export async function verifyOtpChallenge(
  phone: string,
  code: string,
): Promise<{ valid: boolean; message: string }> {
  const codeHash = hashCode(code);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("otp_challenges")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { valid: false, message: "کد منقضی شده. دوباره درخواست دهید" };
    }

    if (new Date(data.expires_at as string).getTime() < Date.now()) {
      return { valid: false, message: "کد منقضی شده. دوباره درخواست دهید" };
    }

    if ((data.attempts as number) >= 5) {
      return { valid: false, message: "تعداد تلاش بیش از حد. کد جدید بگیرید" };
    }

    if (data.code_hash !== codeHash) {
      await supabase
        .from("otp_challenges")
        .update({ attempts: (data.attempts as number) + 1 })
        .eq("id", data.id);
      return { valid: false, message: "کد تأیید نادرست است" };
    }

    await supabase.from("otp_challenges").delete().eq("id", data.id);
    return { valid: true, message: "تأیید شد" };
  }

  const challenge = memoryChallenges.get(phone);
  if (!challenge) {
    return { valid: false, message: "کد منقضی شده. دوباره درخواست دهید" };
  }

  if (challenge.expiresAt < Date.now()) {
    memoryChallenges.delete(phone);
    return { valid: false, message: "کد منقضی شده. دوباره درخواست دهید" };
  }

  if (challenge.attempts >= 5) {
    return { valid: false, message: "تعداد تلاش بیش از حد. کد جدید بگیرید" };
  }

  if (challenge.codeHash !== codeHash) {
    challenge.attempts += 1;
    return { valid: false, message: "کد تأیید نادرست است" };
  }

  memoryChallenges.delete(phone);
  return { valid: true, message: "تأیید شد" };
}
