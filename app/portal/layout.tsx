import type { Metadata } from "next";

// The demo portal is never indexed, even when the rest of the site is.
export const metadata: Metadata = {
  title: {
    default: "Resident Portal (Demo)",
    template: "%s | Resident Portal Demo",
  },
  description:
    "A demonstration resident portal with sample data: pay rent, request maintenance and find lease documents.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
