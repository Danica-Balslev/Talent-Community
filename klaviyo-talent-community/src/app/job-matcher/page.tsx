"use client";

import { useEffect } from "react";

/**
 * Legacy URL: sends visitors to the unified homepage anchor where the matcher is embedded.
 */
export default function JobMatcherRedirectPage() {
  useEffect(() => {
    window.location.replace("/#job-matcher");
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 bg-klaviyo-charcoal px-6 text-center">
      <p className="text-sm text-klaviyo-cotton/70">Opening the job matcher…</p>
      <p className="text-xs text-klaviyo-cotton/45">
        If nothing happens,{" "}
        <a
          href="/#job-matcher"
          className="text-klaviyo-poppy underline decoration-klaviyo-poppy/40 underline-offset-2 hover:decoration-klaviyo-poppy"
        >
          continue here
        </a>
        .
      </p>
    </div>
  );
}
