"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  ChatCircle,
  ShareNetwork,
  CheckCircle,
} from "@phosphor-icons/react";
import type { Product, WeightOption } from "@asal/types";
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { ProductGallery } from "@asal/components/product/ProductGallery";
import { ProductTrustBadges } from "@asal/components/product/ProductTrustBadges";
import { WeightSelector } from "@asal/components/product/WeightSelector";
import { ProductAccordion } from "@asal/components/product/ProductAccordion";
import { StickyAddToCart } from "@asal/components/product/StickyAddToCart";
import { ReviewsSection } from "@asal/components/product/ReviewsSection";
import type { Review } from "@asal/lib/server/reviews";
import { RelatedProductsCarousel } from "@asal/components/product/RelatedProductsCarousel";
import { Button } from "@asal/components/ui/Button";
import { PriceDisplay } from "@asal/components/ui/PriceDisplay";
import { RatingStars } from "@asal/components/ui/RatingStars";
import { Icon } from "@asal/components/ui/Icon";
import { useCartStore } from "@asal/store/cart";
import { hajiasalPath, hajiasalAbsoluteUrl } from "@asal/lib/paths";
import { formatPersianNumber } from "@asal/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  initialReviews?: Review[];
  relatedProducts?: Product[];
}

export function ProductDetailClient({
  product,
  initialReviews,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const siteData = useSiteSettings();
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
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.shortDescription,
          url,
        });
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
    { title: "توضیحات", content: product.longDescription },
    ...(product.ingredients
      ? [{ title: "ترکیبات", content: product.ingredients }]
      : []),
    ...(product.shippingInfo
      ? [{ title: "ارسال", content: product.shippingInfo }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <nav className="mb-6 text-sm text-[var(--pdp-muted)]">
        <Link href={hajiasalPath()} className="hover:text-[var(--pdp-accent)]">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={hajiasalPath("/shop")}
          className="hover:text-[var(--pdp-accent)]"
        >
          فروشگاه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--pdp-text)]">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-6">
          <p className="text-sm text-[var(--pdp-muted)]">
            {product.categoryLabel}
          </p>

          <h1 className="text-2xl font-bold leading-tight text-[var(--pdp-text)] text-balance md:text-3xl lg:text-4xl">
            {product.title}
          </h1>

          <RatingStars
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          <p className="leading-relaxed text-[var(--pdp-muted)]">
            {product.shortDescription}
          </p>

          <ProductTrustBadges />

          <div className="rounded-2xl border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-5">
            <PriceDisplay
              price={selectedWeight.price}
              discountPrice={product.discountPrice}
              size="lg"
              className="[&_.text-brown]:text-[var(--pdp-accent)] [&_.text-muted]:text-[var(--pdp-muted)]"
            />

            {product.inStock ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-[var(--success)]">
                <Icon icon={CheckCircle} size={18} weight="fill" />
                موجود در انبار
              </p>
            ) : (
              <p className="mt-3 text-sm text-[var(--error)]">ناموجود</p>
            )}
          </div>

          <WeightSelector
            options={product.weightOptions}
            selected={selectedWeight}
            onChange={setSelectedWeight}
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--pdp-border)] bg-[var(--pdp-surface)]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-11 w-11 items-center justify-center text-[var(--pdp-muted)] hover:text-[var(--pdp-text)]"
                aria-label="کاهش"
              >
                <Minus size={16} weight="light" />
              </button>
              <span className="min-w-[2rem] text-center font-medium tabular-nums text-[var(--pdp-text)]">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-[var(--pdp-muted)] hover:text-[var(--pdp-text)]"
                aria-label="افزایش"
              >
                <Plus size={16} weight="light" />
              </button>
            </div>

            <Button
              size="lg"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="flex-1 bg-[var(--pdp-accent)] text-[#1c1714] hover:bg-[#b8922a]"
            >
              <ShoppingBag size={18} weight="light" />
              {product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
            </Button>
          </div>

          <div className="space-y-1 text-xs text-[var(--pdp-muted)]">
            <p>
              ارسال رایگان برای سفارش‌های بالای{" "}
              {formatPersianNumber(siteData.freeShippingThreshold)} تومان
            </p>
            <p>ضمانت کیفیت و اصالت محصول</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {whatsappUrl ? (
              <Button
                href={whatsappUrl}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                className="border-[var(--pdp-border)] text-[var(--pdp-text)]"
              >
                <ChatCircle size={16} weight="light" />
                پرسش در واتساپ
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-[var(--pdp-border)] text-[var(--pdp-text)]"
            >
              <ShareNetwork size={16} weight="light" />
              اشتراک‌گذاری
            </Button>
            {shareMessage ? (
              <span className="self-center text-xs text-[var(--pdp-accent)]" role="status">
                {shareMessage}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <ProductAccordion items={accordionItems} />
      </div>

      <ReviewsSection product={product} initialReviews={initialReviews} />
      <RelatedProductsCarousel products={relatedProducts} />

      <StickyAddToCart
        title={product.title}
        price={selectedWeight.price}
        inStock={product.inStock}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
