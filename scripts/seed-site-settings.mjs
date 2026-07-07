#!/usr/bin/env node
/**
 * Seed site settings from site.json into Supabase site_settings.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const site = JSON.parse(
  readFileSync(join(root, "src/hajiasal/data/site.json"), "utf8"),
);

console.log("Seeding site_settings (hajiasal)...");
const { error } = await supabase.from("site_settings").upsert({
  key: "hajiasal",
  value: site,
  updated_at: new Date().toISOString(),
});

if (error) {
  console.error("Site settings error:", error.message);
  process.exit(1);
}

console.log("Done.");
