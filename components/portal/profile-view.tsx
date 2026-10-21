"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { portalActions } from "@/lib/portal/store";
import { usePortalData } from "@/lib/portal/use-portal";
import { profileSchema, type ProfileValues } from "@/lib/portal/validation";
import { zodResolver } from "@/lib/validation";

function ToggleRow({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-5">
      <div>
        <Label htmlFor={id} className="text-base font-medium text-ink">
          {title}
        </Label>
        <p id={`${id}-desc`} className="mt-1 text-sm leading-relaxed text-ink-3">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-describedby={`${id}-desc`}
      />
    </div>
  );
}

function ProfileForm({ initial }: { initial: ProfileValues }) {
  const uid = useId();
  const field = (name: string) => `${uid}-${name}`;
  const [saved, setSaved] = useState(false);

  // `values` keeps the form in step with the stored profile, including after
  // "Reset demo data".
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: initial,
    mode: "onTouched",
  });

  const onSubmit = (values: ProfileValues) => {
    portalActions.updateProfile(values);
    setSaved(true);
  };

  const describedBy = (name: keyof ProfileValues) =>
    errors[name] ? `${field(name)}-error` : undefined;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact details"
      className="space-y-6"
      onChange={() => setSaved(false)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={field("firstName")} label="First name" required error={errors.firstName?.message}>
          <Input
            id={field("firstName")}
            autoComplete="given-name"
            aria-required="true"
            aria-invalid={errors.firstName ? "true" : undefined}
            aria-describedby={describedBy("firstName")}
            {...register("firstName")}
          />
        </Field>
        <Field id={field("lastName")} label="Last name" required error={errors.lastName?.message}>
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
      <Field id={field("email")} label="Email" required error={errors.email?.message}>
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

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          Save changes
        </Button>
        {saved ? (
          <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-river-deep">
            <Check className="size-4" aria-hidden="true" />
            Saved in this browser
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function ProfileView() {
  const data = usePortalData();
  const [confirmReset, setConfirmReset] = useState(false);
  if (!data) return null;

  const { profile } = data;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <section aria-labelledby="contact-title" className="lg:col-span-6">
        <h2 id="contact-title" className="font-display text-3xl text-ink">
          Contact details
        </h2>
        <div className="mt-6">
          <ProfileForm
            initial={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              phone: profile.phone,
            }}
          />
        </div>
      </section>

      <div className="space-y-10 lg:col-span-5 lg:col-start-8">
        <section aria-labelledby="prefs-title">
          <h2 id="prefs-title" className="font-display text-3xl text-ink">
            Preferences
          </h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            <ToggleRow
              id="pref-email"
              title="Email notices"
              description="Receive announcements and request updates by email."
              checked={profile.notifyEmail}
              onChange={(notifyEmail) => portalActions.updateProfile({ notifyEmail })}
            />
            <ToggleRow
              id="pref-sms"
              title="Text message notices"
              description="Receive urgent updates by text message."
              checked={profile.notifySms}
              onChange={(notifySms) => portalActions.updateProfile({ notifySms })}
            />
            <ToggleRow
              id="pref-autopay"
              title="Autopay"
              description="Pay rent automatically each month. Demo only: nothing is ever scheduled or taken."
              checked={profile.autopay}
              onChange={(autopay) => portalActions.updateProfile({ autopay })}
            />
          </div>
          <p className="mt-3 text-sm text-ink-3">
            Preferences save as you change them. Notices are not actually sent
            in this demo.
          </p>
        </section>

        <section
          aria-labelledby="reset-title"
          className="border border-dashed border-line-strong bg-paper-2 p-6"
        >
          <h2 id="reset-title" className="font-display text-2xl text-ink">
            Demo data
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">
            Everything here lives in this browser. Reset to restore the
            original sample resident, ledger and requests.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {confirmReset ? (
              <>
                <span className="text-sm font-medium text-ink">Reset all demo data?</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    portalActions.resetData();
                    setConfirmReset(false);
                  }}
                >
                  Yes, reset
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmReset(false)}
                >
                  Keep my changes
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmReset(true)}
              >
                Reset demo data
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
