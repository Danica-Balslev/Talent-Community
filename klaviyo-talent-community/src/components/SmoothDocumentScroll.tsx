"use client";

import { useEffect } from "react";

/** Enables smooth scrolling for in-page anchors (e.g. /#join, /#job-matcher). */
export function SmoothDocumentScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);
  return null;
}
