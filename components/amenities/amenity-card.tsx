import type { Amenity } from "@/types/property";
import { AmenityIcon } from "@/components/amenities/amenity-icon";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";

interface AmenityCardProps {
  amenity: Amenity;
  /** Image aspect ratio classes, e.g. "aspect-[16/10]". */
  aspect?: string;
  sizes?: string;
  className?: string;
}

export function AmenityCard({
  amenity,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: AmenityCardProps) {
  return (
    <article className={cn("group flex flex-col", className)}>
      {amenity.image ? (
        <div className={cn("relative overflow-hidden bg-paper-3", aspect)}>
          <SafeImage
            src={amenity.image.src}
            alt={amenity.image.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        </div>
      ) : null}
      <div className="flex items-start gap-4 pt-5">
        <span className="mt-1 flex size-11 shrink-0 items-center justify-center border border-line-strong text-river-deep">
          <AmenityIcon name={amenity.icon} className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight text-ink sm:text-[1.75rem]">
            {amenity.title}
          </h3>
          <p className="mt-2 max-w-prose leading-relaxed text-ink-3">
            {amenity.description}
          </p>
          {amenity.details.length ? (
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-ink-2">
              {amenity.details.map((detail) => (
                <li key={detail} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1 rounded-full bg-river" />
                  {detail}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
