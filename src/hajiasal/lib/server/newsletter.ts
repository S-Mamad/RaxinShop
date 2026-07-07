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
  data: Omit<ContactMessage, "id" | "createdAt">,
): Promise<ContactMessage> {
  const message: ContactMessage = {
    ...data,
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

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    return (
      data?.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        subject: r.subject,
        message: r.message,
        createdAt: r.created_at,
      })) ?? []
    );
  }
  return readJsonFile<ContactMessage[]>("contact.json", []);
}
