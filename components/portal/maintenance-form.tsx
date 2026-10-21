"use client";

import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Check } from "lucide-react";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  maintenanceCategoryLabels,
  maintenanceLocationLabels,
  maintenancePriorityLabels,
  maintenanceWindowLabels,
} from "@/data/portal";
import { portalActions } from "@/lib/portal/store";
import {
  maintenanceDefaults,
  maintenanceSchema,
  type MaintenanceValues,
} from "@/lib/portal/validation";
import { zodResolver } from "@/lib/validation";

const MAX = 1000;

function options<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => (
    <NativeSelectOption key={value} value={value}>
      {labels[value]}
    </NativeSelectOption>
  ));
}

export function MaintenanceForm() {
  const uid = useId();
  const field = (name: string) => `${uid}-${name}`;
  const [submitted, setSubmitted] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenanceDefaults,
    mode: "onTouched",
  });
  const description = useWatch({ control, name: "description" });
  const priority = useWatch({ control, name: "priority" });

  const onSubmit = (values: MaintenanceValues) => {
    const created = portalActions.submitRequest(values);
    setSubmitted(created.number);
    reset(maintenanceDefaults);
  };

  const describedBy = (name: keyof MaintenanceValues, hint = false) =>
    errors[name]
      ? `${field(name)}-error`
      : hint
        ? `${field(name)}-hint`
        : undefined;

  return (
    <form
      id="new-request"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="New maintenance request"
      className="space-y-6 border border-line bg-paper p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl text-ink">New request</h2>

      {submitted ? (
        <p
          role="status"
          className="flex items-start gap-2.5 bg-river-soft px-4 py-3 text-sm leading-relaxed text-ink-2"
        >
          <Check className="mt-0.5 size-4 shrink-0 text-river-deep" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-ink">Request {submitted} submitted.</strong>{" "}
            It now appears in your list (demo only; no one is notified).
          </span>
        </p>
      ) : null}

      <Field id={field("category")} label="What needs attention?" required hideOptional>
        <NativeSelect
          id={field("category")}
          aria-required="true"
          {...register("category")}
        >
          {options(maintenanceCategoryLabels)}
        </NativeSelect>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={field("location")} label="Where in your home?" required hideOptional>
          <NativeSelect
            id={field("location")}
            aria-required="true"
            {...register("location")}
          >
            {options(maintenanceLocationLabels)}
          </NativeSelect>
        </Field>
        <Field id={field("priority")} label="Priority" required hideOptional>
          <NativeSelect
            id={field("priority")}
            aria-required="true"
            {...register("priority")}
          >
            {options(maintenancePriorityLabels)}
          </NativeSelect>
        </Field>
      </div>

      {priority === "urgent" ? (
        <p role="note" className="border-l-2 border-danger pl-3 text-sm leading-relaxed text-ink-2">
          For a fire, a gas smell or any emergency, call 911 first. The portal
          is not monitored in real time.
        </p>
      ) : null}

      <Field
        id={field("description")}
        label="Describe the issue"
        required
        error={errors.description?.message}
        hint={`${description?.length ?? 0} of ${MAX} characters`}
      >
        <Textarea
          id={field("description")}
          rows={4}
          aria-required="true"
          aria-invalid={errors.description ? "true" : undefined}
          aria-describedby={describedBy("description", true)}
          placeholder="What is happening, and when did it start?"
          {...register("description")}
        />
      </Field>

      <Field id={field("preferredWindow")} label="Preferred visit time" required hideOptional>
        <NativeSelect
          id={field("preferredWindow")}
          aria-required="true"
          {...register("preferredWindow")}
        >
          {options(maintenanceWindowLabels)}
        </NativeSelect>
      </Field>

      <div className="flex items-start gap-3">
        <Controller
          control={control}
          name="permissionToEnter"
          render={({ field: { value, onChange, onBlur, ref, name } }) => (
            <Checkbox
              id={field("permission")}
              name={name}
              ref={ref}
              checked={value}
              onCheckedChange={(checked) => onChange(checked === true)}
              onBlur={onBlur}
              className="mt-0.5"
            />
          )}
        />
        <Label
          htmlFor={field("permission")}
          className="items-start text-[0.9375rem] leading-snug font-normal text-ink-2"
        >
          Staff may enter my home if I&rsquo;m not there.
        </Label>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit request"}
      </Button>
    </form>
  );
}
