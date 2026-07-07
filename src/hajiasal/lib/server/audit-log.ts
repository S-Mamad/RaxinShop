import { getSupabaseAdmin } from "./supabase";

export async function logAdminAction(input: {
  action: string;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from("admin_audit_log").insert({
    action: input.action,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    payload: input.payload ?? null,
  });
}
