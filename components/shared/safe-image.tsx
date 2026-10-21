"use client";

import { useCallback, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

/**
 * next/image with a graceful fallback. If the source fails to load (removed
 * photo, network error), a labelled navy panel is shown instead of a broken
 * image icon, and the alt text stays available to assistive technology.
 */
export function SafeImage({
  src,
  alt,
  className,
  onError,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  // Catches images that failed before React hydrated and attached onError.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-ink p-4 text-center text-on-ink-muted",
          rest.fill && "absolute inset-0",
          className,
        )}
      >
        <ImageOff className="size-6" aria-hidden="true" />
        <span className="max-w-[22ch] text-xs leading-snug">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...rest}
    />
  );
}
