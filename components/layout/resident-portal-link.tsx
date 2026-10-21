import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

interface ResidentPortalLinkProps {
  className?: string;
  /** Show the "not configured" explanation as visible text. */
  showStatus?: boolean;
}

/**
 * Renders a live external link only when `site.residentPortalUrl` is set.
 * Otherwise it is an inert, clearly labelled placeholder: no URL is invented.
 */
export function ResidentPortalLink({
  className,
  showStatus = false,
}: ResidentPortalLinkProps) {
  if (site.residentPortalUrl) {
    return (
      <a
        href={site.residentPortalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-flex items-center gap-1.5", className)}
      >
        Resident Portal
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-disabled="true"
      title="Resident Portal link is not configured in this demo"
      className={cn(
        "inline-flex cursor-not-allowed items-center gap-2 opacity-60",
        className,
      )}
    >
      Resident Portal
      <span
        className={cn(
          "normal-case tracking-normal",
          showStatus ? "text-xs" : "sr-only",
        )}
      >
        {showStatus ? "(not configured)" : "Link not configured in this demo"}
      </span>
    </button>
  );
}
