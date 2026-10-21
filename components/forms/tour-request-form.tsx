"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CircleAlert, FlaskConical } from "lucide-react";
import type { TourApartmentType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/data/site";
import { bedroomTypeLabels } from "@/lib/format";
import { submitTourInquiry } from "@/lib/inquiries";
import {
  tourInquiryDefaults,
  tourInquirySchema,
  zodResolver,
  type TourInquiryFormValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const MESSAGE_LIMIT = 1000;

const apartmentTypeOptions: { value: TourApartmentType; label: string }[] = [
  { value: "no-preference", label: "No preference" },
  { value: "studio", label: bedroomTypeLabels.studio },
  { value: "one-bed", label: bedroomTypeLabels["one-bed"] },
  { value: "two-bed", label: bedroomTypeLabels["two-bed"] },
];

interface TourRequestFormProps {
  /** Pre-selects the apartment type, e.g. from a floor plan page. */
  defaultApartmentType?: TourApartmentType;
  /** When set, the form is framed around a specific floor plan. */
  planName?: string;
  className?: string;
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
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
        ) : (
          <span className="font-normal text-ink-3">(optional)</span>
        )}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-danger"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TourRequestForm({
  defaultApartmentType = "no-preference",
  planName,
  className,
}: TourRequestFormProps) {
  const uid = useId();
  const field = (name: string) => `${uid}-${name}`;
  const [submitted, setSubmitted] = useState<TourInquiryFormValues | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<TourInquiryFormValues>({
    resolver: zodResolver(tourInquirySchema),
    defaultValues: {
      ...tourInquiryDefaults,
      apartmentType: defaultApartmentType,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const message = useWatch({ control, name: "message" });
  const messageLength = message?.length ?? 0;
  const errorCount = Object.keys(errors).length;

  const onSubmit = async (values: TourInquiryFormValues) => {
    await submitTourInquiry({
      ...values,
      phone: values.phone || undefined,
      preferredDate: values.preferredDate || undefined,
      message: values.message || undefined,
    });
    setSubmitted(values);
  };

  const describedBy = (name: keyof TourInquiryFormValues, hint = false) => {
    const ids: string[] = [];
    if (errors[name]) ids.push(`${field(name)}-error`);
    else if (hint) ids.push(`${field(name)}-hint`);
    return ids.length ? ids.join(" ") : undefined;
  };

  if (submitted) {
    const typeLabel =
      apartmentTypeOptions.find((o) => o.value === submitted.apartmentType)
        ?.label ?? "No preference";

    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cn(
          "border border-line-strong bg-paper p-6 outline-none sm:p-8",
          className,
        )}
      >
        <p className="inline-flex items-center gap-2 bg-river-soft px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-river-deep uppercase">
          <FlaskConical className="size-4" aria-hidden="true" />
          Demo submission
        </p>
        <h3 className="mt-5 font-display text-3xl leading-tight text-ink">
          Thanks, {submitted.firstName}. This was a demonstration.
        </h3>
        <p className="mt-4 leading-relaxed text-ink-2">
          Your entries passed validation in your browser, but{" "}
          <strong className="font-semibold text-ink">
            nothing was sent to the Apex Hudson Riverfront leasing team and
            nothing was stored.
          </strong>{" "}
          Delivering real tour requests requires a backend or a configured form
          integration, which this proof of concept does not include.
        </p>

        <dl className="mt-6 grid gap-x-6 gap-y-3 border-y border-line py-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-3">Name</dt>
            <dd className="font-medium text-ink">
              {submitted.firstName} {submitted.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Email</dt>
            <dd className="font-medium break-all text-ink">{submitted.email}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Apartment type</dt>
            <dd className="font-medium text-ink">{typeLabel}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Preferred date and time</dt>
            <dd className="font-medium text-ink">
              {submitted.preferredDate || "No date chosen"}
              {submitted.preferredTime ? `, ${submitted.preferredTime}` : ""}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-sm leading-relaxed text-ink-3">
          To arrange a tour today, contact leasing directly
          {site.contact.phone ? (
            <>
              {" "}
              at{" "}
              <a
                href={site.contact.phoneHref ?? undefined}
                className="font-medium text-river-deep underline underline-offset-4"
              >
                {site.contact.phone}
              </a>
            </>
          ) : null}
          .
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset({ ...tourInquiryDefaults, apartmentType: defaultApartmentType });
              setSubmitted(null);
            }}
          >
            Try another demo request
          </Button>
          <Button asChild variant="ghost">
            <Link href="/apartments">Back to apartments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={planName ? `Request a tour of ${planName}` : "Request a tour"}
      className={cn("space-y-6", className)}
    >
      <p className="flex items-start gap-2.5 border-l-2 border-river py-0.5 pl-3 text-sm leading-relaxed text-ink-3">
        <FlaskConical
          className="mt-0.5 size-4 shrink-0 text-river-deep"
          aria-hidden="true"
        />
        <span>
          <strong className="font-semibold text-ink">Demo form.</strong> Your
          entries are checked in your browser but are not sent to the leasing
          team. Please do not enter sensitive information.
        </span>
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={field("firstName")}
          label="First name"
          required
          error={errors.firstName?.message}
        >
          <Input
            id={field("firstName")}
            autoComplete="given-name"
            aria-required="true"
            aria-invalid={errors.firstName ? "true" : undefined}
            aria-describedby={describedBy("firstName")}
            {...register("firstName")}
          />
        </Field>
        <Field
          id={field("lastName")}
          label="Last name"
          required
          error={errors.lastName?.message}
        >
          <Input
            id={field("lastName")}
            autoComplete="family-name"
            aria-required="true"
            aria-invalid={errors.lastName ? "true" : undefined}
            aria-describedby={describedBy("lastName")}
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={field("email")}
          label="Email"
          required
          error={errors.email?.message}
        >
          <Input
            id={field("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={describedBy("email")}
            {...register("email")}
          />
        </Field>
        <Field id={field("phone")} label="Phone" error={errors.phone?.message}>
          <Input
            id={field("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={describedBy("phone")}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field
        id={field("apartmentType")}
        label="Preferred apartment type"
        required
        error={errors.apartmentType?.message}
      >
        <NativeSelect
          id={field("apartmentType")}
          aria-required="true"
          aria-invalid={errors.apartmentType ? "true" : undefined}
          aria-describedby={describedBy("apartmentType")}
          {...register("apartmentType")}
        >
          {apartmentTypeOptions.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={field("preferredDate")}
          label="Preferred tour date"
          error={errors.preferredDate?.message}
        >
          <Input
            id={field("preferredDate")}
            type="date"
            aria-invalid={errors.preferredDate ? "true" : undefined}
            aria-describedby={describedBy("preferredDate")}
            {...register("preferredDate")}
          />
        </Field>
        <Field
          id={field("preferredTime")}
          label="Preferred time"
          error={errors.preferredTime?.message}
        >
          <NativeSelect
            id={field("preferredTime")}
            aria-invalid={errors.preferredTime ? "true" : undefined}
            aria-describedby={describedBy("preferredTime")}
            {...register("preferredTime")}
          >
            <NativeSelectOption value="">No preference</NativeSelectOption>
            <NativeSelectOption value="morning">Morning</NativeSelectOption>
            <NativeSelectOption value="afternoon">Afternoon</NativeSelectOption>
            <NativeSelectOption value="evening">Evening</NativeSelectOption>
          </NativeSelect>
        </Field>
      </div>

      <Field
        id={field("message")}
        label="Message"
        error={errors.message?.message}
        hint={`${messageLength} of ${MESSAGE_LIMIT} characters`}
      >
        <Textarea
          id={field("message")}
          rows={4}
          placeholder={
            planName
              ? `Questions about ${planName}?`
              : "Tell us what you are looking for."
          }
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={describedBy("message", true)}
          {...register("message")}
        />
      </Field>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="consent"
            render={({ field: { value, onChange, onBlur, ref, name } }) => (
              <Checkbox
                id={field("consent")}
                name={name}
                ref={ref}
                checked={value}
                onCheckedChange={(checked) => onChange(checked === true)}
                onBlur={onBlur}
                aria-required="true"
                aria-invalid={errors.consent ? "true" : undefined}
                aria-describedby={describedBy("consent")}
                className="mt-0.5"
              />
            )}
          />
          <Label
            htmlFor={field("consent")}
            className="items-start text-[0.9375rem] leading-snug font-normal text-ink-2"
          >
            I agree to be contacted about this tour request.
            <span aria-hidden="true" className="text-danger">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </Label>
        </div>
        {errors.consent ? (
          <p
            id={`${field("consent")}-error`}
            role="alert"
            className="flex items-start gap-1.5 text-sm font-medium text-danger"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-line pt-6">
        {submitCount > 0 && errorCount > 0 ? (
          <p role="alert" className="text-sm font-medium text-danger">
            Please fix {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`}{" "}
            and try again.
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Request a Tour"}
          </Button>
          <p className="text-xs leading-relaxed text-ink-3">
            Fields marked <span aria-hidden="true">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>
        </div>
      </div>
    </form>
  );
}
