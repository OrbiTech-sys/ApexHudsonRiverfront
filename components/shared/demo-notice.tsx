import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoNoticeProps {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}

/** Small, plain note used wherever content is illustrative or unconfirmed. */
export function DemoNotice({
  children,
  className,
  tone = "light",
}: DemoNoticeProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 border-l-2 py-0.5 pl-3 text-sm leading-relaxed",
        tone === "light"
          ? "border-river text-ink-3"
          : "border-river-light text-on-ink-muted",
        className,
      )}
    >
      <Info
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "light" ? "text-river-deep" : "text-river-light",
        )}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  );
}
