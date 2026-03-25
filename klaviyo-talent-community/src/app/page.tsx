import { HeaderLogo } from "@/components/HeaderLogo";
import { JoinForm } from "@/components/JoinForm";
import { ValueProps } from "@/components/ValueProps";

export default function TalentCommunityPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-klaviyo-stone/12 blur-[120px]" />
        <div className="absolute -right-1/4 top-1/3 h-[380px] w-[380px] rounded-full bg-klaviyo-poppy/14 blur-[100px]" />
      </div>

      <header className="relative z-10 border-b border-klaviyo-stone/10 bg-klaviyo-charcoal/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5 sm:px-8">
          <HeaderLogo />
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="#join"
              className="text-klaviyo-cotton/70 transition hover:text-klaviyo-cotton"
            >
              Join
            </a>
            <a
              href="https://www.klaviyo.com/careers"
              className="font-medium text-klaviyo-poppy transition hover:text-klaviyo-poppy/90"
              target="_blank"
              rel="noreferrer"
            >
              View careers
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-klaviyo-poppy/90">
            Talent community
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-klaviyo-cotton sm:text-5xl sm:leading-[1.08]">
            Join the Klaviyo Talent Community
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-klaviyo-cotton/70 sm:text-xl">
            Don&apos;t see the right role today? Join our talent community and be the first to hear
            about new opportunities, company updates, and events at Klaviyo.
          </p>
          <ValueProps />
          <div className="mt-14">
            <a
              href="#join"
              className="inline-flex items-center justify-center rounded-lg bg-klaviyo-poppy px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-klaviyo-poppy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaviyo-poppy"
            >
              Join the community
            </a>
          </div>
        </section>

        <section
          id="join"
          className="scroll-mt-24 border-t border-klaviyo-stone/10 bg-black/20 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight text-klaviyo-cotton sm:text-3xl">
                Stay on our radar
              </h2>
              <p className="mt-4 text-base leading-relaxed text-klaviyo-cotton/65">
                Share a few details so we can keep you informed. No spam—just thoughtful updates
                when there&apos;s something worth your time.
              </p>
            </div>
            <div className="mt-12 max-w-xl">
              <JoinForm />
            </div>
          </div>
        </section>

        <section className="border-t border-klaviyo-stone/10 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-lg font-semibold text-klaviyo-cotton">What happens next</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-klaviyo-cotton/65">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-klaviyo-poppy" />
                    Your profile is routed to our recruiting team for future matching.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-klaviyo-poppy" />
                    You&apos;ll get relevant outreach when roles align—never generic blasts.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-klaviyo-poppy" />
                    Prefer to apply later? You can unsubscribe anytime from community emails.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-klaviyo-stone/15 bg-klaviyo-cotton/[0.04] p-8">
                <p className="text-sm leading-relaxed text-klaviyo-cotton/65">
                  Klaviyo is the intelligent marketing automation platform brands use to grow on
                  their own terms. We hire people who care about craft, customers, and each other.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a
                    href="https://www.klaviyo.com/careers"
                    className="font-medium text-klaviyo-poppy underline decoration-klaviyo-poppy/35 underline-offset-4 hover:decoration-klaviyo-poppy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Careers
                  </a>
                  <a
                    href="https://www.klaviyo.com/legal"
                    className="text-klaviyo-cotton/55 underline decoration-klaviyo-stone/30 underline-offset-4 hover:text-klaviyo-cotton"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Legal
                  </a>
                  <a
                    href="https://www.klaviyo.com"
                    className="text-klaviyo-cotton/55 underline decoration-klaviyo-stone/30 underline-offset-4 hover:text-klaviyo-cotton"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Klaviyo.com
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-14 text-center text-xs text-klaviyo-cotton/40">
              © {new Date().getFullYear()} Klaviyo placeholder microsite — not an official Klaviyo
              property unless published by Klaviyo.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
