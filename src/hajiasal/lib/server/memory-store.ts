/**
 * Process-local fallback when production has no Supabase and filesystem
 * writes are disabled. Suitable for single-instance / demo deploys.
 * Multi-instance hosts (e.g. Vercel) need Supabase for durable data.
 */

export interface MemorySession {
  id: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
  sellerId?: string;
  ipAddress?: string;
  userAgent?: string;
}

type MemoryRoot = {
  adminSessions: MemorySession[];
  sellerSessions: MemorySession[];
  stockOverrides: Record<string, boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews: any[];
};

const globalKey = "__hajiasal_memory_store__";

function root(): MemoryRoot {
  const g = globalThis as unknown as Record<string, MemoryRoot | undefined>;
  if (!g[globalKey]) {
    g[globalKey] = {
      adminSessions: [],
      sellerSessions: [],
      stockOverrides: {},
      orders: [],
      reviews: [],
    };
  }
  return g[globalKey]!;
}

export function memoryGetAdminSessions(): MemorySession[] {
  return root().adminSessions;
}

export function memorySetAdminSessions(sessions: MemorySession[]): void {
  root().adminSessions = sessions;
}

export function memoryGetSellerSessions(): MemorySession[] {
  return root().sellerSessions;
}

export function memorySetSellerSessions(sessions: MemorySession[]): void {
  root().sellerSessions = sessions;
}

export function memoryGetStockOverrides(): Record<string, boolean> {
  return { ...root().stockOverrides };
}

export function memorySetStockOverride(productId: string, inStock: boolean): void {
  root().stockOverrides[productId] = inStock;
}

export function memoryGetOrders<T = unknown>(): T[] {
  return root().orders as T[];
}

export function memoryPushOrder(order: unknown): void {
  root().orders.unshift(order);
}

export function memoryUpdateOrder<T extends { id: string }>(
  orderId: string,
  patch: Partial<T>,
): T | null {
  const list = root().orders as T[];
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx < 0) return null;
  const next = {
    ...list[idx]!,
    ...patch,
    updatedAt: new Date().toISOString(),
  } as T;
  list[idx] = next;
  return next;
}

export function memoryGetReviews<T = unknown>(): T[] {
  return root().reviews as T[];
}

export function memoryPushReview(review: unknown): void {
  root().reviews.unshift(review);
}

export function memorySetReviews(reviews: unknown[]): void {
  root().reviews = reviews;
}

export function memoryUpdateReview<T extends { id: string }>(
  id: string,
  patch: Partial<T>,
): T | null {
  const list = root().reviews as T[];
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const next = { ...list[idx]!, ...patch } as T;
  list[idx] = next;
  return next;
}
