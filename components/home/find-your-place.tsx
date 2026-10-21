import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { listBedroomTypes } from "@/lib/repository/apartments";
import { cn } from "@/lib/utils";

const cta: Record<string, string> = {
  studio: "Browse Studios",
  "one-bed": "Browse One Bedrooms",
  "two-bed": "Browse Two Bedrooms",
};

export async function FindYourPlace() {
  const types = await listBedroomTypes();

  return (
    <section aria-labelledby="find-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          title="Find Your Place."
          id="find-title"
          description="Start with the size that fits your life, then compare floor plans side by side."
        />

        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {types.map((item, index) => (
            <li
              key={item.type}
              className={cn(
                // Stagger the middle card on desktop for an editorial rhythm.
                index === 1 && "lg:mt-14",
                index === 2 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <article className="group">
                <Link
                  href={`/apartments?type=${item.type}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className={cn(
                    "relative block overflow-hidden bg-paper-3",
                    index === 2
                      ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/5]"
                      : "aspect-[4/3] sm:aspect-[4/5]",
                  )}
                >
                  <SafeImage
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="pt-6">
                  <h3 className="font-display text-3xl text-ink">{item.label}</h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-ink-3">
                    {item.description}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-5">
                    <Link href={`/apartments?type=${item.type}`}>
                      {cta[item.type]}
                    </Link>
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
