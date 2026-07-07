import type { CartItem, CheckoutFormData } from "@/types";
import { readJsonFile, writeJsonFile } from "./db";

export interface StoredOrder {
  id: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
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

export async function createOrder(input: {
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
}): Promise<StoredOrder> {
  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  const discount = input.discount ?? 0;
  const order: StoredOrder = {
    id: generateOrderId(),
    status: "paid",
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    discount,
    total: input.subtotal + input.shipping - discount,
    couponCode: input.couponCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingCode: generateTrackingCode(),
  };
  orders.push(order);
  await writeJsonFile(ORDERS_FILE, orders);
  return order;
}

export async function getOrderById(orderId: string): Promise<StoredOrder | null> {
  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  return orders.find((o) => o.id === orderId) ?? null;
}

export async function getOrderByTracking(
  trackingCode: string,
): Promise<StoredOrder | null> {
  const orders = await readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
  return (
    orders.find(
      (o) => o.trackingCode?.toUpperCase() === trackingCode.toUpperCase(),
    ) ?? null
  );
}

export async function getAllOrders(): Promise<StoredOrder[]> {
  return readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
}
