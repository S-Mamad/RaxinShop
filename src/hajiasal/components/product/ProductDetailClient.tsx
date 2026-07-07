"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, MessageCircle, Share2 } from "lucide-react";
import type { Product, WeightOption } from "@asal/types";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { ProductGallery } from "@asal/components/product/ProductGallery";
import { WeightSelector } from "@asal/components/product/WeightSelector";
import { ProductAccordion } from "@asal/components/product/ProductAccordion";
import { StickyAddToCart } from "@asal/components/product/StickyAddToCart";
import { ReviewsSection } from "@asal/components/product/ReviewsSection";
import { RelatedProducts } from "@asal/components/product/RelatedProducts";
import { Button } from "@asal/components/ui/Button";
import { Badge } from "@asal/components/ui/Badge";
import { PriceDisplay } from "@asal/components/ui/PriceDisplay";
import { RatingStars } from "@asal/components/ui/RatingStars";
import { useCartStore } from "@asal/store/cart";
import { hajiasalPath, hajiasalAbsoluteUrl } from "@asal/lib/paths";

const siteData = site as SiteConfig;

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [shareMessage, setShareMessage] = useState("");

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        image: product.images[0],
        weight: selectedWeight,
      },
      quantity,
    );
  };

  const whatsappUrl = siteData.whatsappNumber
    ? `https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
        `سلام، درباره ${product.title} سوال دارم.`,
      )}`
    : null;

  const handleShare = useCallback(async () => {
    const url = hajiasalAbsoluteUrl(`/product/${product.slug}`);
    const shareData = {
      title: product.title,
      text: product.shortDescription,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage("لینک محصول کپی شد");
      setTimeout(() => setShareMessage(""), 2500);
    } catch {
      setShareMessage("اشتراک‌گذاری انجام نشد");
      setTimeout(() => setShareMessage(""), 2500);
    }
  }, [product]);

  const accordionItems = [
    {
      title: "توضیحات",
      content: product.longDescription,
    },
    ...(product.ingredients
      ? [{ title: "ترکیبات", content: product.ingredients }]
      : []),
    ...(product.shippingInfo
      ? [{ title: "ارسال", content: product.shippingInfo }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <nav className="mb-6 text-sm text-muted">
        <Link href={hajiasalPath()} className="hover:text-amber">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <Link href={hajiasalPath("/shop")} className="hover:text-amber">
          فروشگاه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brown">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{product.categoryLabel}</Badge>
            {product.isBestseller ? (
              <Badge variant="bestseller">پرفروش</Badge>
            ) : null}
            {product.isNew ? <Badge variant="new">جدید</Badge> : null}
            {!product.inStock ? (
              <Badge variant="out-of-stock">ناموجود</Badge>
            ) : null}
          </div>

          <h1 className="text-2xl font-bold text-brown md:text-3xl">
            {product.title}
          </h1>

          <RatingStars
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          <p className="text-muted leading-relaxed">
            {product.shortDescription}
          </p>

          <PriceDisplay
            price={selectedWeight.price}
            discountPrice={product.discountPrice}
            size="lg"
          />

          <WeightSelector
            options={product.weightOptions}
            selected={selectedWeight}
            onChange={setSelectedWeight}
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-brown"
                aria-label="کاهش"
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span className="min-w-[2rem] text-center font-medium">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-brown"
                aria-label="افزایش"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>

            <Button
              size="lg"
              magnetic
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {product.inStock ? "افزودن به سبد" : "ناموجود"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {whatsappUrl ? (
              <Button
                href={whatsappUrl}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                پرسش در واتساپ
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={16} strokeWidth={1.5} />
              اشتراک‌گذاری
            </Button>
            {shareMessage ? (
              <span className="self-center text-xs text-amber" role="status">
                {shareMessage}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <ProductAccordion items={accordionItems} />
      </div>

      <ReviewsSection product={product} />
      <RelatedProducts product={product} />

      <StickyAddToCart
        title={product.title}
        price={selectedWeight.price}
        inStock={product.inStock}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
