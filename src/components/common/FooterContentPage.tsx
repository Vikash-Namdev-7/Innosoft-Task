
import type { FooterPageData } from "../../types";

type FooterContentPageProps = {
  page: FooterPageData;
};

export default function FooterContentPage({
  page,
}: FooterContentPageProps) {
  return (
    <main className="min-h-screen bg-[#090d18] px-3 py-4 text-white sm:px-5 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#0c1422] to-[#06353b] p-4 shadow-2xl sm:p-5 lg:p-7">

        {/* Hero Section */}
        <header>
          <span className="inline-flex rounded-full border border-white/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-teal-300">
            {page.badge}
          </span>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {page.title}
          </h1>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-200 sm:text-base">
            {page.subtitle}
          </p>

          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Last updated: {page.updatedOn}
          </p>
        </header>

        {/* Highlight Banner */}
        <div className="mt-5 rounded-xl border border-white/40 bg-slate-950/20 px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-sm leading-6 text-slate-100 sm:text-base">
            {page.highlight}
          </p>
        </div>

        {/* Introduction + Quick Summary */}
        <div className="mt-5 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.7fr_1fr]">

          {/* Introduction Cards */}
          <section className="space-y-3">
            {page.intro.map((paragraph, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors duration-200 hover:border-teal-400/30 sm:p-5"
              >
                <p className="text-sm leading-7 text-slate-100 sm:text-base">
                  {paragraph}
                </p>
              </div>
            ))}
          </section>

          {/* Quick Summary */}
          <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-teal-400 sm:text-sm">
              {page.summaryTitle}
            </h2>

            <ul className="space-y-3">
              {page.summaryBullets.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm leading-6 text-slate-200 sm:text-base"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Remaining Sections: Two-Column Grid */}
        <div className="mt-5 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          {page.sections.map((section, index) => (
            <section
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-200 hover:border-teal-400/30 hover:bg-white/[0.08] sm:p-5"
            >
              <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                {section.title}
              </h2>

              {section.description && (
                <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
                  {section.description}
                </p>
              )}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((item, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-200 sm:text-base"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}
