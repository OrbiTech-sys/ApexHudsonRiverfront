import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

interface PageIntroProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  className?: string;
  children?: React.ReactNode;
}

/** Heading block for interior pages; clears the fixed header. */
export function PageIntro({
  title,
  description,
  crumbs,
  className,
  children,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        "border-b border-line bg-paper-2 pt-[calc(var(--header-h)+3rem)] pb-12 lg:pt-[calc(var(--header-h)+4.5rem)] lg:pb-16",
        className,
      )}
    >
      <div className="container-page">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-3">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="inline-flex min-h-11 items-center hover:text-river-deep"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink">
                      {crumb.label}
                    </span>
                  )}
                  {index < crumbs.length - 1 ? (
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <h1 className="display-lg max-w-3xl text-ink">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-3">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
