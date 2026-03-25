"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { JoinForm } from "./JoinForm";

type Ctx = { openJoinSurvey: () => void };

const JoinSurveyModalContext = createContext<Ctx | null>(null);

export function useJoinSurveyModal() {
  const c = useContext(JoinSurveyModalContext);
  if (!c) throw new Error("useJoinSurveyModal must be used within JoinSurveyModalProvider");
  return c;
}

export function JoinSurveyModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const openJoinSurvey = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const dialog =
    open && mounted ? (
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
        <button
          type="button"
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          aria-label="Close"
          onClick={close}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-2xl flex-col rounded-t-2xl border border-klaviyo-stone/20 bg-klaviyo-charcoal shadow-2xl sm:max-h-[min(88dvh,920px)] sm:rounded-2xl"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-klaviyo-stone/10 px-5 py-4 sm:px-8 sm:py-5">
            <div className="min-w-0 pr-2">
              <h2
                id={titleId}
                className="text-lg font-semibold tracking-tight text-klaviyo-cotton sm:text-xl"
              >
                Join the Talent Community
              </h2>
              <p id={descId} className="mt-1 text-sm leading-relaxed text-klaviyo-cotton/60">
                Answer a few questions below—we&apos;ll keep you in mind for roles and updates.
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="shrink-0 rounded-lg p-2 text-klaviyo-cotton/60 transition hover:bg-klaviyo-cotton/10 hover:text-klaviyo-cotton focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaviyo-poppy/50"
              aria-label="Close survey"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
            <JoinForm embedded />
          </div>
        </div>
      </div>
    ) : null;

  return (
    <JoinSurveyModalContext.Provider value={{ openJoinSurvey }}>
      {children}
      {mounted && dialog ? createPortal(dialog, document.body) : null}
    </JoinSurveyModalContext.Provider>
  );
}

const poppyCtaClass =
  "inline-flex items-center justify-center rounded-lg border border-klaviyo-poppy/90 bg-klaviyo-poppy px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-black/20 transition hover:bg-klaviyo-poppy/90 hover:shadow-lg hover:shadow-black/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaviyo-poppy active:translate-y-px";

function mergeCtaClass(className?: string) {
  return [poppyCtaClass, className].filter(Boolean).join(" ");
}

/** Hero CTA — opens the survey modal. */
export function JoinTheCommunityButton({ className }: { className?: string }) {
  const { openJoinSurvey } = useJoinSurveyModal();
  return (
    <button type="button" className={mergeCtaClass(className)} onClick={() => openJoinSurvey()}>
      Join the community
    </button>
  );
}

const navJoinClass =
  "cursor-pointer border-0 bg-transparent p-0 text-sm text-klaviyo-cotton/70 transition hover:text-klaviyo-cotton focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaviyo-poppy/50";

/** Header nav — opens the same survey modal as JoinTheCommunityButton. */
export function JoinSurveyNavButton({ className }: { className?: string }) {
  const { openJoinSurvey } = useJoinSurveyModal();
  return (
    <button
      type="button"
      className={[navJoinClass, className].filter(Boolean).join(" ")}
      onClick={() => openJoinSurvey()}
    >
      Join
    </button>
  );
}
