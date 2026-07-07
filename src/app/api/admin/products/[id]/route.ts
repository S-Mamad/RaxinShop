import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import type { Product } from "@asal/types";

const PRODUCTS_PATH = path.join(
  process.cwd(),
  "src",
  "hajiasal",
  "data",
  "products.json",
);

const patchSchema = z.object({
  inStock: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(raw) as Product[];
}

async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET(request: Request, context: RouteContext) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await context.params;
  const products = await readProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 },
      );
    }

    const products = await readProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    products[index] = { ...products[index], ...parsed.data };
    await writeProducts(products);

    return NextResponse.json({ success: true, product: products[index] });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
