import { appendToJsonArray, readJsonFile } from "./db";

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
  await appendToJsonArray("contact.json", message);
  return message;
}
