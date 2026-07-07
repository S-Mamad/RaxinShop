import { isSupabaseConfigured } from "./supabase";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function requireSupabaseInProduction(): void {
  if (isProduction() && !isSupabaseConfigured()) {
    throw new Error(
      "Supabase is required in production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}

export function canUseFilesystemPersistence(): boolean {
  return !isProduction();
}
