"use client";

import { useState } from "react";

const MAX_250 = 250;

const inputClass =
  "w-full rounded-lg border border-klaviyo-stone/15 bg-klaviyo-charcoal px-4 py-3 text-klaviyo-cotton placeholder:text-klaviyo-cotton/35 outline-none ring-klaviyo-poppy/40 transition focus:border-klaviyo-poppy/50 focus:ring-2";

const selectClass =
  "w-full rounded-lg border border-klaviyo-stone/15 bg-klaviyo-charcoal px-4 py-3 text-klaviyo-cotton outline-none ring-klaviyo-poppy/40 transition focus:border-klaviyo-poppy/50 focus:ring-2";

const labelClass = "mb-2 block text-sm font-medium text-klaviyo-cotton/80";

function CharRemaining({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-1 text-xs text-klaviyo-cotton/45">
      Characters remaining: {max - value.length}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-klaviyo-stone/10 pb-2 text-sm font-semibold tracking-wide text-klaviyo-cotton">
      {children}
    </h3>
  );
}

const interestOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "data-analytics", label: "Data & Analytics" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "customer-success", label: "Customer Success" },
  { value: "operations", label: "Operations" },
  { value: "people-hr", label: "People & HR" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
] as const;

export function JoinForm({ embedded = false }: { embedded?: boolean }) {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [linkedin, setLinkedin] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className={
          embedded
            ? "rounded-xl border border-klaviyo-poppy/25 bg-klaviyo-poppy/10 px-6 py-10 text-center"
            : "rounded-2xl border border-klaviyo-poppy/25 bg-klaviyo-poppy/10 px-8 py-12 text-center"
        }
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
      className={
        embedded
          ? "space-y-10"
          : "rounded-2xl border border-klaviyo-stone/12 bg-klaviyo-cotton/[0.03] p-8 sm:p-10"
      }
      noValidate
    >
      <div className="space-y-10">
        <div className="space-y-6">
          <SectionTitle>Your profile</SectionTitle>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="linkedin" className={labelClass}>
                LinkedIn profile URL <span className="text-klaviyo-poppy">*</span>
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                required
                maxLength={MAX_250}
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/in/yourprofile"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-klaviyo-cotton/50">
                Your public profile link is our primary identifier (no résumé upload).
              </p>
              <CharRemaining value={linkedin} max={MAX_250} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="fullName" className={labelClass}>
                Full name <span className="text-klaviyo-poppy">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                maxLength={MAX_250}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
              <CharRemaining value={fullName} max={MAX_250} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className={labelClass}>
                Email <span className="text-klaviyo-poppy">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="location" className={labelClass}>
                Current location <span className="text-klaviyo-poppy">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                autoComplete="address-level2"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="company" className={labelClass}>
                Current company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={MAX_250}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
              />
              <CharRemaining value={company} max={MAX_250} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="jobTitle" className={labelClass}>
                Current job title
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                autoComplete="organization-title"
                maxLength={MAX_250}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={inputClass}
              />
              <CharRemaining value={jobTitle} max={MAX_250} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle>Interests &amp; experience</SectionTitle>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="primaryInterest" className={labelClass}>
                Primary area of interest <span className="text-klaviyo-poppy">*</span>
              </label>
              <select
                id="primaryInterest"
                name="primaryInterest"
                defaultValue=""
                required
                className={selectClass}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {interestOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="yearsExperience" className={labelClass}>
                Years of professional experience <span className="text-klaviyo-poppy">*</span>
              </label>
              <select
                id="yearsExperience"
                name="yearsExperience"
                defaultValue=""
                required
                className={selectClass}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="0-1">0-1</option>
                <option value="2-4">2-4</option>
                <option value="5-7">5-7</option>
                <option value="8-12">8-12</option>
                <option value="13+">13+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle>Graduation date</SectionTitle>
          <p
            id="graduationDate-disclosure"
            className="text-sm leading-relaxed text-klaviyo-cotton/65"
          >
            If you are a Student/New Graduate, please enter your graduation date below. If the exact date is
            unknown, select the 1st day of the month, e.g. June 1st.
          </p>
          <div>
            <label htmlFor="graduationDate" className={labelClass}>
              Graduation date
            </label>
            <input
              id="graduationDate"
              name="graduationDate"
              type="date"
              className={inputClass}
              aria-describedby="graduationDate-disclosure"
            />
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle>Communication preferences</SectionTitle>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                id="consentHiring"
                name="consentHiring"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-klaviyo-stone/25 bg-klaviyo-charcoal text-klaviyo-poppy focus:ring-klaviyo-poppy/50"
              />
              <label htmlFor="consentHiring" className="text-sm leading-relaxed text-klaviyo-cotton/70">
                By submitting the Talent Community form, I agree to receive communications about Klaviyo
                hiring events, communications and future openings.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="consentPrivacy"
                name="consentPrivacy"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-klaviyo-stone/25 bg-klaviyo-charcoal text-klaviyo-poppy focus:ring-klaviyo-poppy/50"
              />
              <label htmlFor="consentPrivacy" className="text-sm leading-relaxed text-klaviyo-cotton/70">
                I confirm that I have read and agree to the Applicants Privacy Notice. I understand I can
                exercise privacy rights and manage choices as described in Klaviyo&apos;s Privacy Notice.
              </label>
            </div>
          </div>

          <p className="text-sm">
            <a
              href="https://www.klaviyo.com/legal/privacy"
              className="text-klaviyo-poppy underline decoration-klaviyo-poppy/40 underline-offset-4 hover:decoration-klaviyo-poppy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Notice
            </a>
            <span className="mx-2 text-klaviyo-cotton/35" aria-hidden>
              ·
            </span>
            <a
              href="https://www.klaviyo.com/legal"
              className="text-klaviyo-poppy underline decoration-klaviyo-poppy/40 underline-offset-4 hover:decoration-klaviyo-poppy"
              target="_blank"
              rel="noreferrer"
            >
              Applicants Privacy Notice
            </a>
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-10 w-full rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaviyo-cotton/30 sm:w-auto"
      >
        Submit
      </button>

      <p className="mt-6 text-xs text-klaviyo-cotton/45">
        Klaviyo Talent Community — demo form; wire fields to your ATS or Klaviyo list in production.
      </p>
    </form>
  );
}
