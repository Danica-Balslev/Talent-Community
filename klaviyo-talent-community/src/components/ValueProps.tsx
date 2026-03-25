function IconEarlyAccess() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v2M5.64 5.64l1.41 1.41M3 12h2m-.36 6.36l1.41-1.41M12 21v-2m6.36.36-1.41-1.41M21 12h-2m.36-6.36-1.41 1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconUpdates() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h10M4 18h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 15v4l2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEvents() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M3 11h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const items = [
  {
    title: "Get early access to new roles",
    body: "Be among the first to see openings that match what you do best—before they’re widely posted.",
    Icon: IconEarlyAccess,
  },
  {
    title: "Company updates that matter",
    body: "Occasional notes on what we’re building, how we work, and the team behind Klaviyo.",
    Icon: IconUpdates,
  },
  {
    title: "Invites to events & conversations",
    body: "Virtual and in-person touchpoints with our recruiters and hiring teams when it makes sense.",
    Icon: IconEvents,
  },
] as const;

export function ValueProps() {
  return (
    <ul className="mt-14 grid gap-10 sm:grid-cols-3">
      {items.map(({ title, body, Icon }) => (
        <li key={title} className="flex flex-col gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-klaviyo-poppy/15 text-klaviyo-poppy">
            <Icon />
          </div>
          <div>
            <h3 className="text-base font-semibold text-klaviyo-cotton">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-klaviyo-cotton/65">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
