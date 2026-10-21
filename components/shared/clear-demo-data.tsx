"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tourRequestActions } from "@/lib/demo/tour-requests";
import { portalStore } from "@/lib/portal/store";

/** Removes everything this demo has saved in the visitor's browser. */
export function ClearDemoData() {
  const [cleared, setCleared] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          portalStore.clear();
          tourRequestActions.clear();
          setCleared(true);
        }}
      >
        Clear saved demo data
      </Button>
      {cleared ? (
        <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-river-deep">
          <Check className="size-4" aria-hidden="true" />
          Cleared. The portal session and saved tour requests were removed.
        </p>
      ) : null}
    </div>
  );
}
