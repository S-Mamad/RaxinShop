import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import sellersData from "@asal/data/sellers.json";
import catalogData from "@asal/data/seller-catalog.json";
import { readJsonFile, writeJsonFile } from "./db";
import {
  memoryGetSellerSessions,
  memoryGetStockOverrides,
  memorySetSellerSessions,
  memorySetStockOverride,
} from "./memory-store";
import { canUseFilesystemPersistence } from "./production";
import { getAllProductsAsync, updateProductAsync } from "./products-store";
import { getAllOrders, type StoredOrder } from "./orders";
import type { Product } from "@asal/types";

export const SELLER_COOKIE = "hajiasal_seller_session";
const SESSIONS_FILE = "seller-sessions.json";
const SESSION_DAYS = 7;

export interface Seller {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  passwordHash: string;
  city: string;
  status: "active" | "suspended";
  joinedAt: string;
}

export interface SellerSession {
  id: string;
  sellerId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export type PublicSeller = Omit<Seller, "passwordHash">;

const sellers = sellersData as Seller[];
const catalog = catalogData as Record<string, string[]>;

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function toPublicSeller(seller: Seller): PublicSeller {
  const { passwordHash: _, ...rest } = seller;
  return rest;
}

export function getAllSellers(): Seller[] {
  return sellers;
}

export function getSellerById(id: string): Seller | null {
  return sellers.find((s) => s.id === id) ?? null;
}

export function getSellerByPhone(phone: string): Seller | null {
  const normalized = phone.replace(/\D/g, "");
  return (
    sellers.find((s) => s.phone.replace(/\D/g, "") === normalized) ?? null
  );
}

export function verifySellerPassword(seller: Seller, password: string): boolean {
  const demo = process.env.SELLER_DEMO_PASSWORD;
  if (demo && password === demo) return true;
  return safeEqualHex(hashPassword(password), seller.passwordHash);
}

export function getSellerProductIds(sellerId: string): string[] {
  return catalog[sellerId] ?? [];
}

export async function setSellerProductStock(
  sellerId: string,
  productId: string,
  inStock: boolean,
): Promise<Product | null> {
  const ids = getSellerProductIds(sellerId);
  if (!ids.includes(productId)) return null;

  const products = await getAllProductsAsync();
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  try {
    const updated = await updateProductAsync(productId, { inStock });
    if (updated) return updated;
  } catch {
    // fall through to local override
  }

  if (canUseFilesystemPersistence()) {
    const overrides = await readJsonFile<Record<string, boolean>>(
      "seller-stock-overrides.json",
      {},
    );
    overrides[productId] = inStock;
    await writeJsonFile("seller-stock-overrides.json", overrides);
    return { ...product, inStock };
  }

  memorySetStockOverride(productId, inStock);
  return { ...product, inStock };
}

async function applyStockOverrides(products: Product[]): Promise<Product[]> {
  let overrides: Record<string, boolean> = {};
  if (canUseFilesystemPersistence()) {
    overrides = await readJsonFile<Record<string, boolean>>(
      "seller-stock-overrides.json",
      {},
    );
  } else {
    overrides = memoryGetStockOverrides();
  }
  return products.map((p) =>
    p.id in overrides ? { ...p, inStock: overrides[p.id]! } : p,
  );
}

export async function getSellerProducts(sellerId: string): Promise<Product[]> {
  const ids = new Set(getSellerProductIds(sellerId));
  const all = await getAllProductsAsync();
  const filtered = all.filter((p) => ids.has(p.id));
  return applyStockOverrides(filtered);
}

export async function getSellerOrders(sellerId: string): Promise<
  Array<
    StoredOrder & {
      sellerSubtotal: number;
      sellerItems: StoredOrder["items"];
    }
  >
> {
  const ids = new Set(getSellerProductIds(sellerId));
  const orders = await getAllOrders();
  return orders
    .map((order) => {
      const sellerItems = order.items.filter((i) => ids.has(i.productId));
      if (sellerItems.length === 0) return null;
      const sellerSubtotal = sellerItems.reduce(
        (sum, i) => sum + i.weight.price * i.quantity,
        0,
      );
      return { ...order, sellerItems, sellerSubtotal };
    })
    .filter(Boolean) as Array<
    StoredOrder & {
      sellerSubtotal: number;
      sellerItems: StoredOrder["items"];
    }
  >;
}

async function readSessions(): Promise<SellerSession[]> {
  if (canUseFilesystemPersistence()) {
    return readJsonFile<SellerSession[]>(SESSIONS_FILE, []);
  }
  return memoryGetSellerSessions().map((s) => ({
    id: s.id,
    sellerId: s.sellerId ?? "",
    tokenHash: s.tokenHash,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    revokedAt: s.revokedAt,
  }));
}

async function writeSessions(sessions: SellerSession[]): Promise<void> {
  if (canUseFilesystemPersistence()) {
    await writeJsonFile(SESSIONS_FILE, sessions);
    return;
  }
  memorySetSellerSessions(
    sessions.map((s) => ({
      id: s.id,
      sellerId: s.sellerId,
      tokenHash: s.tokenHash,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      revokedAt: s.revokedAt,
    })),
  );
}

export async function createSellerSession(
  sellerId: string,
): Promise<{ token: string } | null> {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const session: SellerSession = {
    id: randomUUID(),
    sellerId,
    tokenHash: hashToken(token),
    createdAt: now.toISOString(),
    expiresAt: new Date(
      now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };

  const sessions = await readSessions();
  sessions.push(session);
  await writeSessions(sessions);
  return { token };
}

export async function validateSellerSessionToken(
  token: string,
): Promise<Seller | null> {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const sessions = await readSessions();
  const session = sessions.find(
    (s) =>
      s.tokenHash === tokenHash &&
      !s.revokedAt &&
      new Date(s.expiresAt).getTime() > Date.now(),
  );
  if (!session) return null;
  const seller = getSellerById(session.sellerId);
  if (!seller || seller.status !== "active") return null;
  return seller;
}

export async function revokeSellerSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const sessions = await readSessions();
  const next = sessions.map((s) =>
    s.tokenHash === tokenHash
      ? { ...s, revokedAt: new Date().toISOString() }
      : s,
  );
  await writeSessions(next);
}

function getTokenFromCookieHeader(cookieHeader: string): string | null {
  const match = cookieHeader.match(new RegExp(`${SELLER_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function getSellerFromRequest(
  request: Request,
): Promise<Seller | null> {
  const token = getTokenFromCookieHeader(request.headers.get("cookie") ?? "");
  if (!token) return null;
  return validateSellerSessionToken(token);
}

export async function getSellerFromCookies(): Promise<Seller | null> {
  const store = await cookies();
  const token = store.get(SELLER_COOKIE)?.value;
  if (!token) return null;
  return validateSellerSessionToken(token);
}

export function sellerCookieOptions(token: string) {
  return {
    name: SELLER_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function buildSellerDashboard(sellerId: string) {
  const [products, orders] = await Promise.all([
    getSellerProducts(sellerId),
    getSellerOrders(sellerId),
  ]);

  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const pending = orders.filter(
    (o) =>
      o.status === "pending_payment" ||
      o.status === "confirmed" ||
      o.status === "processing",
  );
  const outOfStock = products.filter((p) => !p.inStock);
  const revenue = activeOrders.reduce((s, o) => s + o.sellerSubtotal, 0);

  return {
    kpis: {
      productCount: products.length,
      outOfStock: outOfStock.length,
      orderCount: orders.length,
      pendingOrders: pending.length,
      revenue,
    },
    recentOrders: orders.slice(0, 8),
    products: products.slice(0, 6),
  };
}
