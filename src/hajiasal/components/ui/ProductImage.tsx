"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@asal/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

const PLACEHOLDER_WEBP = "/images/hajiasal/placeholder.webp";
const PLACEHOLDER_SVG = "/images/hajiasal/placeholder.svg";

function toSvgFallback(webpPath: string): string | null {
  if (!webpPath.endsWith(".webp")) return null;
  return webpPath.replace(/\.webp$/, ".svg");
}

export function ProductImage({
  src,
  alt,
  fill = false,
  sizes,
  priority = false,
  className,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [fallbackStep, setFallbackStep] = useState(0);

  useEffect(() => {
    setImgSrc(src);
    setFallbackStep(0);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn(className)}
      onError={() => {
        if (fallbackStep === 0) {
          const svg = toSvgFallback(src);
          if (svg) {
            setFallbackStep(1);
            setImgSrc(svg);
            return;
          }
        }
        if (fallbackStep <= 1 && imgSrc !== PLACEHOLDER_WEBP) {
          setFallbackStep(2);
          setImgSrc(PLACEHOLDER_WEBP);
          return;
        }
        if (fallbackStep <= 2 && imgSrc !== PLACEHOLDER_SVG) {
          setFallbackStep(3);
          setImgSrc(PLACEHOLDER_SVG);
        }
      }}
    />
  );
}
