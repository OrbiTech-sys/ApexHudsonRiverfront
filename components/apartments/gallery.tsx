"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageAsset } from "@/types/property";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  planName,
}: {
  images: ImageAsset[];
  planName: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const total = images.length;

  const go = (step: number) => setIndex((value) => (value + step + total) % total);

  return (
    <section aria-label={`${planName} photo gallery`}>
      <div className="relative aspect-[3/2] overflow-hidden bg-paper-3">
        <SafeImage
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          fetchPriority={index === 0 ? "high" : "auto"}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />

        {total > 1 ? (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink/60 to-transparent p-4">
            <p
              className="text-sm font-medium text-paper"
              aria-live="polite"
            >
              Photo {index + 1} of {total}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="inverse"
                size="icon"
                onClick={() => go(-1)}
              >
                <ChevronLeft aria-hidden="true" />
                <span className="sr-only">Previous photo</span>
              </Button>
              <Button
                type="button"
                variant="inverse"
                size="icon"
                onClick={() => go(1)}
              >
                <ChevronRight aria-hidden="true" />
                <span className="sr-only">Next photo</span>
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {total > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((photo, photoIndex) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setIndex(photoIndex)}
                aria-label={`Show photo ${photoIndex + 1}`}
                aria-current={photoIndex === index ? "true" : undefined}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden border-2 bg-paper-3 transition-colors",
                  photoIndex === index
                    ? "border-river"
                    : "border-transparent hover:border-line-strong",
                )}
              >
                <SafeImage
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 14vw, 25vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-sm text-ink-3">
        Stock photography shown for illustration. Images do not depict this
        residence.
      </p>
    </section>
  );
}
