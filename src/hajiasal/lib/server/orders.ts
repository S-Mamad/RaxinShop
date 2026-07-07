import type { CartItem, CheckoutFormData } from "@asal/types";
import { readJsonFile, writeJsonFile } from "./db";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "card_to_card";

export interface StoredOrder {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
  trackingCode?: string;
}

const ORDERS_FILE = "orders.json";

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HA-${timestamp}-${random}`;
}

function generateTrackingCode(): string {
  return `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function mapRowToOrder(row: Record<string, unknown>): StoredOrder {
  return {
    id: row.id as string,
    status: row.status as OrderStatus,
    paymentMethod: (row.payment_method as PaymentMethod) ?? "cod",
    customer: row.customer as CheckoutFormData,
    items: row.items as CartItem[],
    subtotal: row.subtotal as number,
    shipping: row.shipping as number,
    discount: (row.discount as number) ?? 0,
    total: row.total as number,
    couponCode: row.coupon_code as string | undefined,
    shippingMethod: row.shipping_method as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    trackingCode: row.tracking_code as string | undefined,
  };
}

export async function createOrder(input: {
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  paymentMethod?: PaymentMethod;
  shippingMethod?: string;
}): Promise<StoredOrder> {
  const discount = input.discount ?? 0;
  const now = new Date().toISOString();
  const order: StoredOrder = {
    id: generateOrderId(),
    status: "pending_payment",
    paymentMethod: input.paymentMethod ?? "cod",
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    discount,
    total: input.subtotal + input.shipping - discount,
    couponCode: input.couponCode,
    shippingMethod: input.shippingMethod,
    createdAt: now,
    updatedAt: now,
    trackingCode: generateTrackingCode(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("orders").insert({
      id: order.id,
      status: order.status,
      payment_method: order.paymentMethod,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      coupon_code: order.couponCode ?? null,
      tracking_code: order.trackingCode,
      shipping_method: order.shippingMethod ?? null,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    });
    if (error) throw error;
    return order;
  }

  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  orders.push(order);
  await writeJsonFile(ORDERS_FILE, orders);
  return order;
}

export async function getOrderById(orderId: string): Promise<StoredOrder | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();
    if (error || !data) return null;
    return mapRowToOrder(data);
  }

  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  return orders.find((o) => o.id === orderId) ?? null;
}

export async function getOrderByTracking(
  trackingCode: string,
): Promise<StoredOrder | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_code", trackingCode.toUpperCase())
      .maybeSingle();
    if (error || !data) return null;
    return mapRowToOrder(data);
  }

  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  return (
    orders.find(
      (o) => o.trackingCode?.toUpperCase() === trackingCode.toUpperCase(),
    ) ?? null
  );
}

export async function getOrderByPhoneAndTracking(
  phone: string,
  trackingCode: string,
): Promise<StoredOrder | null> {
  const order = await getOrderByTracking(trackingCode);
  if (!order) return null;
  if (order.customer.phone !== phone) return null;
  return order;
}

export async function getAllOrders(): Promise<StoredOrder[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(mapRowToOrder);
  }
  return readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<StoredOrder | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: now })
      .eq("id", orderId)
      .select("*")
      .maybeSingle();
    if (error || !data) return null;
    return mapRowToOrder(data);
  }

  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status, updatedAt: now };
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[idx];
}

export function getPersistenceMode(): "supabase" | "file" {
  return isSupabaseConfigured() ? "supabase" : "file";
}
