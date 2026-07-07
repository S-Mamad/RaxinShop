import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { readJsonFile, writeJsonFile } from "./db";
import { getSupabaseAdmin } from "./supabase";

const SITE_FILE = "site-overrides.json";

export async function getSiteSettings(): Promise<SiteConfig> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hajiasal")
      .maybeSingle();
    if (data?.value) {
      return { ...(site as SiteConfig), ...(data.value as SiteConfig) };
    }
  }

  const overrides = await readJsonFile<Partial<SiteConfig>>(SITE_FILE, {});
  return { ...(site as SiteConfig), ...overrides };
}

export async function updateSiteSettings(
  updates: Partial<SiteConfig>,
): Promise<SiteConfig> {
  const current = await getSiteSettings();
  const merged = { ...current, ...updates };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("site_settings").upsert({
      key: "hajiasal",
      value: merged,
      updated_at: new Date().toISOString(),
    });
    return merged;
  }

  await writeJsonFile(SITE_FILE, merged);
  return merged;
}
