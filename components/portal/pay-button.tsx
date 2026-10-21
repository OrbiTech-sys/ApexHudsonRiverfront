"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Check, Download } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type { LedgerEntry, PortalData } from "@/types/portal";
import { Field } from "@/components/forms/field";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { demoPaymentMethods } from "@/data/portal";
import { formatMoney } from "@/lib/format";
import { formatIsoDate } from "@/lib/portal/dates";
import { downloadTextFile } from "@/lib/demo/download";
import { buildReceipt } from "@/lib/portal/documents";
import { ledgerBalance, outstandingCharges } from "@/lib/portal/selectors";
import { portalActions } from "@/lib/portal/store";
import { usePortalData } from "@/lib/portal/use-portal";
import {
  makePaymentSchema,
  parseAmount,
  type PaymentValues,
} from "@/lib/portal/validation";
import { zodResolver } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface PayButtonProps {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
  label?: string;
}

/** Opens a demo payment flow. No card details are collected and no money moves. */
export function PayButton({
  variant = "default",
  size = "lg",
  className,
  label = "Make a payment",
}: PayButtonProps) {
  const data = usePortalData();
  const [open, setOpen] = useState(false);
  if (!data) return null;

  const balance = ledgerBalance(data.ledger);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={balance <= 0 && !open}
        >
          {balance <= 0 && !open ? "Nothing due" : label}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto bg-paper p-0 sm:max-w-md"
      >
        <PaymentFlow data={data} onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function RadioCard({
  children,
  ...props
}: React.ComponentProps<"input"> & { children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-line-strong bg-paper p-4 transition-colors has-checked:border-river has-checked:bg-river-soft">
      <input
        type="radio"
        {...props}
        className="mt-1 size-4 shrink-0 accent-river"
      />
      <span className="text-[0.9375rem] leading-snug text-ink">{children}</span>
    </label>
  );
}

function PaymentFlow({
  data,
  onClose,
}: {
  data: PortalData;
  onClose: () => void;
}) {
  const balance = ledgerBalance(data.ledger);
  const nextOwed = outstandingCharges(data.ledger)[0];
  const [receipt, setReceipt] = useState<LedgerEntry | null>(null);
  const schema = useMemo(() => makePaymentSchema(balance), [balance]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentValues>({
    resolver: zodResolver(schema),
    defaultValues: { mode: "full", amount: "", method: "bank" },
  });
  const mode = useWatch({ control, name: "mode" });

  const onSubmit = (values: PaymentValues) => {
    const amount = values.mode === "full" ? balance : parseAmount(values.amount);
    const method = demoPaymentMethods.find((item) => item.id === values.method);
    const entry = portalActions.makePayment({
      amount,
      methodLabel: method?.label ?? "Demo payment method",
    });
    if (entry) setReceipt(entry);
  };

  if (receipt) {
    return (
      <div className="flex flex-1 flex-col">
        <SheetHeader className="border-b border-line p-6">
          <SheetTitle className="font-display text-2xl text-ink">
            Demo payment recorded
          </SheetTitle>
          <SheetDescription>
            No money was moved. This is a demonstration.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 p-6">
          <p className="flex size-12 items-center justify-center rounded-full bg-river-soft text-river-deep">
            <Check className="size-6" aria-hidden="true" />
          </p>
          <dl className="space-y-3 border-y border-line py-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Confirmation</dt>
              <dd className="font-medium text-ink">{receipt.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Amount</dt>
              <dd className="font-medium text-ink">{formatMoney(receipt.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Date</dt>
              <dd className="font-medium text-ink">{formatIsoDate(receipt.date)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Method</dt>
              <dd className="text-right font-medium text-ink">{receipt.method}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadTextFile(buildReceipt(receipt, data))}
            >
              <Download aria-hidden="true" />
              Download receipt
            </Button>
            <Button type="button" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <SheetHeader className="border-b border-line p-6">
        <SheetTitle className="font-display text-2xl text-ink">
          Make a payment
        </SheetTitle>
        <SheetDescription>
          Demo only. No card or bank details are collected.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-8 p-6">
        <div>
          <p className="label-caps text-ink-3">Current balance</p>
          <p className="mt-2 font-display text-5xl leading-none text-ink">
            {formatMoney(balance)}
          </p>
          {nextOwed ? (
            <p className="mt-2 text-sm text-ink-3">
              {nextOwed.entry.description}, due {formatIsoDate(nextOwed.entry.date)}
            </p>
          ) : null}
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-3 text-[0.9375rem] font-medium text-ink">
            Amount
          </legend>
          <RadioCard value="full" {...register("mode")}>
            Pay the full balance ({formatMoney(balance)})
          </RadioCard>
          <RadioCard value="other" {...register("mode")}>
            Pay a different amount
          </RadioCard>
          {mode === "other" ? (
            <Field
              id="pay-amount"
              label="Amount in dollars"
              required
              error={errors.amount?.message}
              className="pt-1"
            >
              <Input
                id="pay-amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                aria-required="true"
                aria-invalid={errors.amount ? "true" : undefined}
                aria-describedby={errors.amount ? "pay-amount-error" : undefined}
                {...register("amount")}
              />
            </Field>
          ) : null}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-3 text-[0.9375rem] font-medium text-ink">
            Pay with
          </legend>
          {demoPaymentMethods.map((method) => (
            <RadioCard key={method.id} value={method.id} {...register("method")}>
              {method.label}
            </RadioCard>
          ))}
        </fieldset>
      </div>

      <div className={cn("border-t border-line bg-paper-2 p-6")}>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing…" : "Confirm demo payment"}
        </Button>
      </div>
    </form>
  );
}
