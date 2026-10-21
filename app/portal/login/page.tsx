import { DemoBanner } from "@/components/portal/demo-banner";
import { LoginForm } from "@/components/portal/login-form";

export const metadata = { title: "Sign in" };

export default function PortalLoginPage() {
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-20 lg:pt-[calc(var(--header-h)+4.5rem)] lg:pb-28">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h1 className="display-lg text-ink">Resident portal.</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-3">
            Sign in to pay rent, request maintenance and find your lease
            documents.
          </p>
          <DemoBanner className="mt-8" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
