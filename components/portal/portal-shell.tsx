"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DemoBanner } from "@/components/portal/demo-banner";
import { Button } from "@/components/ui/button";
import { demoPortalHref } from "@/data/portal";
import { portalActions } from "@/lib/portal/store";
import { usePortalState } from "@/lib/portal/use-portal";
import { cn } from "@/lib/utils";

const tabs = [
  { href: demoPortalHref, label: "Overview" },
  { href: `${demoPortalHref}/payments`, label: "Payments" },
  { href: `${demoPortalHref}/maintenance`, label: "Maintenance" },
  { href: `${demoPortalHref}/lease`, label: "Lease and documents" },
  { href: `${demoPortalHref}/profile`, label: "Profile" },
];

function titleFor(pathname: string, firstName: string): string {
  if (pathname.startsWith(`${demoPortalHref}/payments`)) return "Payments.";
  if (pathname.startsWith(`${demoPortalHref}/maintenance`)) return "Maintenance.";
  if (pathname.startsWith(`${demoPortalHref}/lease`)) return "Lease and documents.";
  if (pathname.startsWith(`${demoPortalHref}/profile`)) return "Your profile.";
  return `Welcome back, ${firstName}.`;
}

function isActive(pathname: string, href: string): boolean {
  return href === demoPortalHref
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Loading (and redirecting) state shown until the browser copy is ready. */
export function PortalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="container-page pt-[calc(var(--header-h)+4rem)] pb-32"
    >
      <p className="font-display text-3xl text-ink">Loading your portal&hellip;</p>
      <div aria-hidden="true" className="mt-8 space-y-3">
        <div className="h-4 w-2/3 bg-paper-3" />
        <div className="h-4 w-1/2 bg-paper-3" />
        <div className="h-4 w-3/5 bg-paper-3" />
      </div>
    </div>
  );
}

/**
 * Gate and frame for signed-in pages. Redirects to the sign-in page when the
 * demo session is not active.
 */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const state = usePortalState();
  const router = useRouter();
  const pathname = usePathname();
  const signedOut = state !== null && !state.signedIn;

  useEffect(() => {
    if (signedOut) router.replace(`${demoPortalHref}/login`);
  }, [signedOut, router]);

  if (!state || !state.signedIn) return <PortalLoading />;

  const { profile, lease } = state.data;

  return (
    <>
      <section className="border-b border-line bg-paper-2 pt-[calc(var(--header-h)+1.5rem)]">
        <div className="container-page">
          <DemoBanner />
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="display-md text-ink">
                {titleFor(pathname, profile.firstName)}
              </h1>
              <p className="mt-2 text-ink-3">
                {lease.unitLabel} &middot; {lease.planName}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => portalActions.signOut()}
            >
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </div>

          <nav aria-label="Resident portal" className="mt-6 -mb-px">
            <ul className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const active = isActive(pathname, tab.href);
                return (
                  <li key={tab.href} className="shrink-0">
                    <Link
                      href={tab.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-12 items-center border-b-2 px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                        active
                          ? "border-river text-ink"
                          : "border-transparent text-ink-3 hover:text-ink",
                      )}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <div className="container-page py-10 lg:py-14">{children}</div>
    </>
  );
}
