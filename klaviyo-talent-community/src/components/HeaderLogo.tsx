"use client";

import { useState } from "react";

/**
 * Uses <img> (not next/image) for maximum dev/preview compatibility.
 * Falls back to text if the asset is missing (e.g. public/ not synced).
 */
export function HeaderLogo() {
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <span className="text-sm font-semibold tracking-tight text-klaviyo-cotton">Klaviyo</span>
    );
  }

  return (
    <a
      href="https://www.klaviyo.com"
      target="_blank"
      rel="noreferrer"
      className="inline-flex shrink-0 overflow-hidden rounded-md ring-1 ring-klaviyo-stone/20 transition hover:ring-klaviyo-stone/35 focus-visible:outline focus-visible:ring-2 focus-visible:ring-klaviyo-poppy"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- need onError fallback; static asset from /public */}
      <img
        src="/klaviyo-logo.png"
        alt="Klaviyo"
        width={115}
        height={36}
        className="h-9 w-auto max-w-[min(100%,280px)] object-contain object-left"
        decoding="async"
        fetchPriority="high"
        onError={() => setShowFallback(true)}
      />
    </a>
  );
}
