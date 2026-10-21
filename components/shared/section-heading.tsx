import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  as?: "h1" | "h2";
  id?: string;
  tone?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeading({
  title,
  description,
  as: Heading = "h2",
  id,
  tone = "light",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Heading
        id={id}
        className={cn(
          "display-lg",
          tone === "dark" ? "text-on-ink" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            tone === "dark" ? "text-on-ink-muted" : "text-ink-3",
          )}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
