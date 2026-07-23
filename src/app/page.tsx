import Link from "next/link";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const demoTasks = [
  "Draft Q3 proposal",
  "Review PR #482",
  "Sync with design",
  "Ship changelog",
  "Plan tomorrow",
];

export default function HomePage() {
  return (
    <main
      className={`${fraunces.variable} ${plexMono.variable} min-h-screen bg-[#F5F6F3] text-[#181B2E]`}
    >
      <style>{`
        @keyframes tf-box {
          0%, 8%   { background: transparent; border-color: #D9DCD2; }
          14%, 78% { background: #E2A63B; border-color: #E2A63B; }
          86%, 100%{ background: transparent; border-color: #D9DCD2; }
        }
        @keyframes tf-text {
          0%, 8%   { color: #181B2E; text-decoration-color: transparent; }
          14%, 78% { color: #9A9C90; text-decoration-color: #9A9C90; }
          86%, 100%{ color: #181B2E; text-decoration-color: transparent; }
        }
        .tf-box { animation: tf-box 6.6s ease-in-out infinite; border-width: 1.5px; }
        .tf-text { animation: tf-text 6.6s ease-in-out infinite; text-decoration-line: line-through; }
        .tf-item:nth-child(1) .tf-box, .tf-item:nth-child(1) .tf-text { animation-delay: 0s; }
        .tf-item:nth-child(2) .tf-box, .tf-item:nth-child(2) .tf-text { animation-delay: 1.15s; }
        .tf-item:nth-child(3) .tf-box, .tf-item:nth-child(3) .tf-text { animation-delay: 2.3s; }
        .tf-item:nth-child(4) .tf-box, .tf-item:nth-child(4) .tf-text { animation-delay: 3.45s; }
        .tf-item:nth-child(5) .tf-box, .tf-item:nth-child(5) .tf-text { animation-delay: 4.6s; }
        @media (prefers-reduced-motion: reduce) {
          .tf-box, .tf-text { animation: none !important; }
          .tf-item:nth-child(1) .tf-box, .tf-item:nth-child(3) .tf-box { background: #E2A63B; border-color: #E2A63B; }
          .tf-item:nth-child(1) .tf-text, .tf-item:nth-child(3) .tf-text { color: #9A9C90; text-decoration-color: #9A9C90; }
        }
      `}</style>

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-[#181B2E]">
            <span className="h-2 w-2 rounded-full bg-[#E2A63B]" />
          </span>
          <span
            className="text-[1.05rem] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TaskFlow
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login" className="text-[#4A4D46] hover:text-[#181B2E] transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#181B2E] px-4 py-2 text-white transition-colors hover:bg-[#2A2E48]"
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-24 pt-8 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-16">
        <div>
          <p
            className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#8A6D2F]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            One list. No noise.
          </p>
          <h1
            className="text-[2.75rem] leading-[1.08] tracking-tight sm:text-[3.4rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Organize your work.
            <br />
            <span className="italic text-[#8A6D2F]">Ship your day.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[#5B5F58]">
            TaskFlow keeps your list honest — what&apos;s next, what&apos;s
            stuck, and what&apos;s already done. Nothing else on the screen.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#181B2E] px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#2A2E48]"
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-[#181B2E] underline decoration-[#D9DCD2] decoration-2 underline-offset-4 hover:decoration-[#8A6D2F]"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Signature element: a living task list, quietly working through itself */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm -rotate-2 rounded-2xl border border-[#E4E6DE] bg-white p-6 shadow-[0_30px_60px_-25px_rgba(24,27,46,0.25)]">
            <div className="mb-5 flex items-center justify-between">
              <span
                className="text-xs font-medium uppercase tracking-[0.14em] text-[#9A9C90]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Today
              </span>
              <span
                className="text-xs text-[#9A9C90]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {demoTasks.length} tasks
              </span>
            </div>
            <ul className="space-y-4">
              {demoTasks.map((task) => (
                <li key={task} className="tf-item flex items-center gap-3">
                  <span className="tf-box flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border" />
                  <span
                    className="tf-text text-[0.95rem]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-[#E4E6DE] bg-white/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:px-10 sm:grid-cols-3">
          {[
            {
              label: "Capture",
              copy: "Get a task out of your head and onto the list in under five seconds.",
            },
            {
              label: "Sort",
              copy: "Priority and status you actually glance at, not fields you fill in and forget.",
            },
            {
              label: "Finish",
              copy: "One tap closes it out. The list gets shorter, not longer.",
            },
          ].map((f) => (
            <div key={f.label}>
              <p
                className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#8A6D2F]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {f.label}
              </p>
              <p className="text-[0.98rem] leading-relaxed text-[#5B5F58]">
                {f.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#181B2E]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:px-10 sm:flex-row sm:items-center">
          <h2
            className="text-2xl text-white sm:text-[1.75rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your day, organized. <span className="italic text-[#E2A63B]">Start today.</span>
          </h2>
          <Link
            href="/register"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#181B2E] transition-colors hover:bg-[#E2A63B]"
          >
            Create your account
          </Link>
        </div>
      </section>
    </main>
  );
}
