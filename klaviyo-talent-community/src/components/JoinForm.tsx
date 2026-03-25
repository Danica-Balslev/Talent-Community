"use client";

import { useState } from "react";

export function JoinForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-klaviyo-poppy/25 bg-klaviyo-poppy/10 px-8 py-12 text-center"
        role="status"
      >
        <p className="text-lg font-medium text-klaviyo-cotton">
          You&apos;re in. Thanks for joining the Klaviyo Talent Community.
        </p>
        <p className="mt-3 text-sm text-klaviyo-cotton/65">
          Watch your inbox for updates. You can close this page anytime.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-klaviyo-stone/12 bg-klaviyo-cotton/[0.03] p-8 sm:p-10"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-klaviyo-cotton/80">
            Work email <span className="text-klaviyo-poppy">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-klaviyo-stone/15 bg-klaviyo-charcoal px-4 py-3 text-klaviyo-cotton placeholder:text-klaviyo-cotton/35 outline-none ring-klaviyo-poppy/40 transition focus:border-klaviyo-poppy/50 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-klaviyo-cotton/80">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Alex"
            className="w-full rounded-lg border border-klaviyo-stone/15 bg-klaviyo-charcoal px-4 py-3 text-klaviyo-cotton placeholder:text-klaviyo-cotton/35 outline-none ring-klaviyo-poppy/40 transition focus:border-klaviyo-poppy/50 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="focus" className="mb-2 block text-sm font-medium text-klaviyo-cotton/80">
            Primary interest
          </label>
          <select
            id="focus"
            name="focus"
            defaultValue=""
            className="w-full rounded-lg border border-klaviyo-stone/15 bg-klaviyo-charcoal px-4 py-3 text-klaviyo-cotton outline-none ring-klaviyo-poppy/40 transition focus:border-klaviyo-poppy/50 focus:ring-2"
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="engineering">Engineering</option>
            <option value="product">Product &amp; Design</option>
            <option value="sales">Sales &amp; Success</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations &amp; G&amp;A</option>
            <option value="other">Something else</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-klaviyo-stone/25 bg-klaviyo-charcoal text-klaviyo-poppy focus:ring-klaviyo-poppy/50"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-klaviyo-cotton/70">
          I agree to receive talent community emails from Klaviyo about opportunities and updates. I
          can unsubscribe anytime. See our{" "}
          <a
            href="https://www.klaviyo.com/legal"
            className="text-klaviyo-poppy underline decoration-klaviyo-poppy/40 underline-offset-4 hover:decoration-klaviyo-poppy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          .
        </label>
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-lg bg-klaviyo-poppy px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-klaviyo-poppy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaviyo-poppy sm:w-auto"
      >
        Join the community
      </button>
      <p className="mt-4 text-xs text-klaviyo-cotton/45">
        Demo form — wire this to your ATS or Klaviyo list in production.
      </p>
    </form>
  );
}
