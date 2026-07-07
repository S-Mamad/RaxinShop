"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowLeft } from "lucide-react";
import type { Product } from "@/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brown-deep/50 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-4 shadow-2xl md:inset-x-auto"
          >
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Search size={20} strokeWidth={1.5} className="text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی محصول..."
                className="flex-1 bg-transparent text-base text-brown outline-none placeholder:text-dim"
                autoFocus
              />
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-brown"
                aria-label="بستن"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto pt-2">
              {loading ? (
                <p className="py-8 text-center text-sm text-muted">در حال جستجو...</p>
              ) : results.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-cream-dark"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                          <ProductImage
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-brown">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted">
                            {product.categoryLabel}
                          </p>
                        </div>
                        <ArrowLeft size={16} className="shrink-0 text-dim" strokeWidth={1.5} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.length >= 2 ? (
                <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد</p>
              ) : (
                <p className="py-8 text-center text-sm text-dim">
                  حداقل ۲ حرف تایپ کنید
                </p>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
