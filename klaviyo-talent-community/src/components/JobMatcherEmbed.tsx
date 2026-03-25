"use client";

import { useCallback, useEffect, useState } from "react";

const IFRAME_SRC = "/job-matcher.html?embedded=1";
const MIN_HEIGHT = 720;

export function JobMatcherEmbed() {
  const [height, setHeight] = useState(MIN_HEIGHT);

  const onMessage = useCallback((e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;
    if (
      e.data?.type === "klaviyo-job-matcher-height" &&
      typeof e.data.height === "number"
    ) {
      setHeight(Math.max(MIN_HEIGHT, Math.ceil(e.data.height) + 32));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  return (
    <div className="w-full">
      <iframe
        src={IFRAME_SRC}
        title="Klaviyo careers job matcher"
        className="block w-full max-w-full border-0"
        style={{ height }}
      />
      <p className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-center text-xs text-neutral-600">
        If the form doesn&apos;t load,{" "}
        <a
          href="/job-matcher.html"
          className="font-medium text-[#EF6351] underline decoration-[#EF6351]/40 underline-offset-2 hover:decoration-[#EF6351]"
        >
          open the job matcher in full page
        </a>
        .
      </p>
    </div>
  );
}
