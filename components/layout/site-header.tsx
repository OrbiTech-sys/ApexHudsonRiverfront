"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ResidentPortalLink } from "@/components/layout/resident-portal-link";
import { Wordmark } from "@/components/layout/wordmark";
import { formattedAddress, primaryNav, site, tourHref } from "@/data/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The home page opens on a full-bleed photograph, so the header starts
  // transparent there and becomes solid once the page scrolls.
  const overHero = pathname === "/" && !scrolled && !menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-(--header-h) transition-colors duration-300",
        overHero
          ? "on-dark border-b border-transparent bg-transparent"
          : "border-b border-line bg-paper text-ink",
      )}
    >
      <div className="container-page flex h-full items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-9">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center border-b-2 text-[0.8125rem] font-semibold tracking-[0.1em] uppercase transition-colors",
                      active
                        ? overHero
                          ? "border-river-light"
                          : "border-river"
                        : "border-transparent hover:border-current/40",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 xl:gap-6">
          <ResidentPortalLink className="hidden h-11 text-[0.8125rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase xl:inline-flex" />
          <Button
            asChild
            variant={overHero ? "inverse" : "default"}
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href={tourHref}>Schedule a Tour</Link>
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "xl:hidden",
                  overHero && "text-on-ink hover:bg-white/10",
                )}
              >
                <Menu aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton
              className="w-full gap-0 bg-paper p-0 sm:max-w-md"
            >
              <div className="border-b border-line px-6 py-6">
                <SheetTitle className="font-display text-2xl text-ink">
                  Menu
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation and leasing actions
                </SheetDescription>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="divide-y divide-line">
                  {primaryNav.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-14 items-center font-display text-3xl",
                            active ? "text-river-deep" : "text-ink",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                  <li className="flex min-h-14 items-center">
                    <ResidentPortalLink
                      onClick={() => setMenuOpen(false)}
                      className="min-h-14 flex-1 text-base font-medium text-ink"
                    />
                  </li>
                </ul>
              </nav>

              <div className="space-y-5 border-t border-line bg-paper-2 px-6 py-6">
                <Button asChild size="lg" className="w-full">
                  <Link href={tourHref} onClick={() => setMenuOpen(false)}>
                    Schedule a Tour
                  </Link>
                </Button>
                <div className="space-y-2 text-sm text-ink-3">
                  <p>{formattedAddress}</p>
                  {site.contact.phone && site.contact.phoneHref ? (
                    <a
                      href={site.contact.phoneHref}
                      className="inline-flex min-h-11 items-center gap-2 font-medium text-ink"
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {site.contact.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
