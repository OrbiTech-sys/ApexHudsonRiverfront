import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Typographic wordmark. Swap for the official logo asset when available. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, home`}
      className={cn("inline-flex flex-col leading-none", className)}
    >
      <span className="font-display text-[1.7rem] font-semibold tracking-[0.24em]">
        APEX
      </span>
      <span className="mt-1.5 text-[0.625rem] font-semibold tracking-[0.34em] uppercase">
        Hudson Riverfront
      </span>
    </Link>
  );
}
