"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, FieldError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoCredentials, demoPortalHref } from "@/data/portal";
import { portalActions } from "@/lib/portal/store";
import { usePortalState } from "@/lib/portal/use-portal";
import {
  loginSchema,
  matchesDemoAccount,
  type LoginValues,
} from "@/lib/portal/validation";
import { zodResolver } from "@/lib/validation";

export function LoginForm() {
  const uid = useId();
  const field = (name: string) => `${uid}-${name}`;
  const router = useRouter();
  const state = usePortalState();
  const signedIn = state?.signedIn === true;
  const [formError, setFormError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (signedIn) router.replace(demoPortalHref);
  }, [signedIn, router]);

  const enter = () => {
    portalActions.signIn();
    router.replace(demoPortalHref);
  };

  const onSubmit = (values: LoginValues) => {
    if (!matchesDemoAccount(values)) {
      setFormError(
        "That email and password don't match the demo account. Use the sample credentials below.",
      );
      return;
    }
    setFormError(null);
    enter();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Sign in to the demo resident portal"
        className="space-y-6"
      >
        {formError ? <FieldError>{formError}</FieldError> : null}

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
            autoComplete="username"
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? `${field("email")}-error` : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          id={field("password")}
          label="Password"
          required
          error={errors.password?.message}
        >
          <Input
            id={field("password")}
            type="password"
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={errors.password ? "true" : undefined}
            aria-describedby={
              errors.password ? `${field("password")}-error` : undefined
            }
            {...register("password")}
          />
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setShowReset((value) => !value)}
            aria-expanded={showReset}
          >
            Forgot your password?
          </Button>
        </div>
        {showReset ? (
          <p role="status" className="text-sm leading-relaxed text-ink-3">
            This is a demo, so there are no real passwords to reset. Use the
            sample credentials below.
          </p>
        ) : null}
      </form>

      <div className="mt-10 border border-line-strong bg-paper-2 p-5 sm:p-6">
        <h2 className="font-display text-2xl text-ink">Demo account</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-3">
          These are sample credentials for the demonstration. Please don&rsquo;t
          enter a real password.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex flex-wrap gap-x-3">
            <dt className="w-20 text-ink-3">Email</dt>
            <dd className="font-medium break-all text-ink">{demoCredentials.email}</dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="w-20 text-ink-3">Password</dt>
            <dd className="font-medium text-ink">{demoCredentials.password}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormError(null);
              setValue("email", demoCredentials.email, { shouldValidate: true });
              setValue("password", demoCredentials.password, { shouldValidate: true });
            }}
          >
            Fill in the credentials
          </Button>
          <Button type="button" size="sm" onClick={enter}>
            Continue as demo resident
          </Button>
        </div>
      </div>
    </div>
  );
}
