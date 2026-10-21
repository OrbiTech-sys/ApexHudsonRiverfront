import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { demoPortalHref } from "@/data/portal";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Links to the real resident portal when `site.residentPortalUrl` is set.
 * Until then it opens the built-in DEMO portal, marked with a "Demo" tag so
 * nobody mistakes sample data for the property's actual system.
 */
export function ResidentPortalLink({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  if (site.residentPortalUrl) {
    return (
      <a
        href={site.residentPortalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={cn("inline-flex items-center gap-1.5", className)}
      >
        Resident Portal
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link
      href={demoPortalHref}
      onClick={onClick}
      className={cn("inline-flex items-center gap-2", className)}
    >
      Resident Portal
      <span className="rounded-sm bg-current/10 px-1.5 py-0.5 text-[0.625rem] leading-none font-semibold tracking-wider uppercase">
        Demo
      </span>
    </Link>
  );
}
