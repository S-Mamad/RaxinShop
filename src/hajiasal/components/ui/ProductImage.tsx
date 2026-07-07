"use client";

import { useState } from "react";
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

const PLACEHOLDER_IMAGE = "/images/hajiasal/placeholder.webp";

export function ProductImage({
  src,
  alt,
  fill = false,
  sizes,
  priority = false,
  className,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [usedFallback, setUsedFallback] = useState(false);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn(className)}
      onError={() => {
        if (!usedFallback) {
          setUsedFallback(true);
          setImgSrc(PLACEHOLDER_IMAGE);
        }
      }}
    />
  );
}
