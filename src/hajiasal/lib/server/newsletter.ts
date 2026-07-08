import { appendToJsonArray, readJsonFile } from "./db";
import { getSupabaseAdmin } from "./supabase";

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  source?: string;
  readAt?: string;
  repliedAt?: string;
  adminNote?: string;
}

export async function subscribeNewsletter(email: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    if (error?.code === "23505") return false;
    if (error) throw error;
    return true;
  }

  const subscribers = await readJsonFile<NewsletterSubscriber[]>(
    "newsletter.json",
    [],
  );
  if (subscribers.some((s) => s.email === email)) return false;
  await appendToJsonArray("newsletter.json", {
    email,
    subscribedAt: new Date().toISOString(),
  });
  return true;
}

export async function saveContactMessage(
  data: Omit<ContactMessage, "id" | "createdAt"> & { source?: string },
): Promise<ContactMessage> {
  const message: ContactMessage = {
    ...data,
    source: data.source ?? "hajiasal",
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      created_at: message.createdAt,
      source: message.source,
    });
    if (error) throw error;
    return message;
  }

  await appendToJsonArray("contact.json", message);
  return message;
}

export async function getAllNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("email, subscribed_at")
      .order("subscribed_at", { ascending: false });
    return (
      data?.map((r) => ({
        email: r.email,
        subscribedAt: r.subscribed_at,
      })) ?? []
    );
  }
  return readJsonFile<NewsletterSubscriber[]>("newsletter.json", []);
}

function mapContactRow(r: Record<string, unknown>): ContactMessage {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    phone: r.phone as string,
    subject: r.subject as string,
    message: r.message as string,
    createdAt: r.created_at as string,
    source: (r.source as string) ?? "hajiasal",
    readAt: r.read_at as string | undefined,
    repliedAt: r.replied_at as string | undefined,
    adminNote: r.admin_note as string | undefined,
  };
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    return data?.map(mapContactRow) ?? [];
  }
  return readJsonFile<ContactMessage[]>("contact.json", []);
}

export async function getContactMessagesBySource(
  source: string,
): Promise<ContactMessage[]> {
  const all = await getAllContactMessages();
  return all.filter((m) => (m.source ?? "hajiasal") === source);
}

export async function markContactMessageRead(id: string): Promise<boolean> {
  const now = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read_at: now })
      .eq("id", id);
    return !error;
  }

  const all = await readJsonFile<ContactMessage[]>("contact.json", []);
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  all[idx].readAt = now;
  const { writeJsonFile } = await import("./db");
  await writeJsonFile("contact.json", all);
  return true;
}

export async function updateContactMessageNote(
  id: string,
  adminNote: string,
): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ admin_note: adminNote })
      .eq("id", id);
    return !error;
  }

  const all = await readJsonFile<ContactMessage[]>("contact.json", []);
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  all[idx].adminNote = adminNote;
  const { writeJsonFile } = await import("./db");
  await writeJsonFile("contact.json", all);
  return true;
}
