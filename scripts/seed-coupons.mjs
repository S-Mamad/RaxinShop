#!/usr/bin/env node
/**
 * Seed coupons from coupons.json into Supabase.
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

const coupons = JSON.parse(
  readFileSync(join(root, "src/hajiasal/data/coupons.json"), "utf8"),
);

const rows = coupons.map((c) => ({
  code: c.code,
  type: c.type,
  value: c.value,
  min_order: c.minOrder,
  max_discount: c.maxDiscount ?? null,
  active: c.active,
  used_count: 0,
}));

console.log(`Seeding ${rows.length} coupons...`);
const { error } = await supabase.from("coupons").upsert(rows);
if (error) {
  console.error("Coupons error:", error.message);
  process.exit(1);
}

console.log("Done.");
