import { CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  /** Hide the "(optional)" suffix, e.g. for fields that always have a value. */
  hideOptional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Label, control slot, hint and inline error. The control should set
 * `aria-describedby` to `${id}-error` or `${id}-hint` (see `describedBy`).
 */
export function Field({
  id,
  label,
  required,
  hideOptional,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-[0.9375rem] text-ink">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-danger">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : hideOptional ? null : (
          <span className="font-normal text-ink-3">(optional)</span>
        )}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-sm font-medium text-danger"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
