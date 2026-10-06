import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { LangSwitcher } from "@/components/LangSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ArchetypeCard } from "@/components/results/ArchetypeCard";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/config/site";
import { ARCHETYPE_IDS } from "@/data/archetypes";
import { useLang } from "@/i18n/context";
import { maturityIndex, zoneOf } from "@/lib/scoring";
import type { ArchetypeId, ArchetypeResult, Likert } from "@/lib/types";
import { CheckoutDialog, type CheckoutNotice } from "./CheckoutDialog";
import { PricingSection } from "./PricingSection";

/** Вымышленный результат для блока «Как выглядит результат». */
function sample(id: ArchetypeId, rank: number, votes: number, s1: Likert, s2: Likert, g: Likert): ArchetypeResult {
  const mi = maturityIndex(s1, s2, g);
  return { id, rank, votes, answers: { shadow_1: s1, shadow_2: s2, grounded: g }, rawMI: mi, mi, zone: zoneOf(mi), capped: false };
}
const EXAMPLE: ArchetypeResult[] = [
  sample("ARCH_07", 1, 4, 3, 3, 4),
  sample("ARCH_09", 2, 3, 1, 2, 4),
  sample("ARCH_01", 3, 3, 5, 4, 2),
];

const HERO_FAN: { id: ArchetypeId; cls: string }[] = [
  { id: "ARCH_05", cls: "-rotate-12 translate-y-4 bg-paper text-ink" },
  { id: "ARCH_07", cls: "rotate-0 -translate-y-2 bg-ink text-paper z-10" },
  { id: "ARCH_10", cls: "rotate-12 translate-y-4 bg-paper text-ink" },
];

export function Landing() {
  const { c } = useLang();
  const t = c.landing;
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-20 border-b-2 border-ink bg-background/95 backdrop-blur no-print">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display text-base font-extrabold">
            {c.ui.appShort}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label={c.ui.appTitle}>
            <a href="#about" className="hover:underline">{t.nav.about}</a>
            <a href="#deck" className="hover:underline">{t.nav.deck}</a>
            <a href="#example" className="hover:underline">{t.nav.example}</a>
            <a href="#pricing" className="hover:underline">{t.nav.pricing}</a>
            <a href="#faq" className="hover:underline">{t.nav.faq}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <ButtonLink to="/test" size="sm" className="hidden sm:inline-flex">
              {t.nav.start}
            </ButtonLink>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-12 sm:px-6 sm:py-20">
        {/* Первый экран */}
        <section className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <span className="self-start rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-semibold">
              {t.hero.kicker}
            </span>
            <h1 className="font-display text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl break-words">
              {t.hero.title}
            </h1>
            <p className="max-w-xl text-lg font-medium leading-snug sm:text-xl">{t.hero.lead}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink to="/test" size="lg">
                {t.hero.cta} <ArrowRight className="size-5" />
              </ButtonLink>
              <a href="#pricing" className="inline-flex h-14 items-center justify-center px-4 font-semibold underline decoration-2 underline-offset-4">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <span className="text-sm font-medium">{t.hero.note}</span>
          </div>
          <div className="flex justify-center overflow-hidden py-6 sm:overflow-visible" aria-hidden>
            {HERO_FAN.map(({ id, cls }) => (
              <div
                key={id}
                className={`-mx-3 flex h-44 w-28 items-center justify-center rounded-[20px] border-2 border-ink shadow-hard sm:-mx-4 sm:h-64 sm:w-44 ${cls}`}
              >
                <ArchetypeGlyph id={id} size={72} />
              </div>
            ))}
          </div>
        </section>

        {/* Чем отличается */}
        <section id="about" className="flex scroll-mt-24 flex-col gap-8">
          <SectionTitle>{t.why.title}</SectionTitle>
          <div className="grid gap-5 md:grid-cols-3">
            {t.why.items.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 rounded-[22px] border-2 border-ink bg-paper p-6 shadow-hard">
                <h3 className="font-display text-lg font-extrabold leading-tight">{item.title}</h3>
                <p className="leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-6 font-display text-2xl font-extrabold">{t.how.title}</h3>
          <ol className="grid gap-4 sm:grid-cols-3">
            {c.ui.introSteps.map(([title, text], i) => (
              <li key={title} className="flex gap-3 rounded-[18px] border-2 border-ink bg-ink p-5 text-paper">
                <span className="font-display text-3xl font-extrabold leading-none">{i + 1}</span>
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">{title}</span>
                  <span className="text-sm leading-snug opacity-85">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Колода */}
        <section id="deck" className="flex scroll-mt-24 flex-col gap-8">
          <div>
            <SectionTitle>{t.deck.title}</SectionTitle>
            <p className="mt-2 text-lg font-medium">{t.deck.lead}</p>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ARCHETYPE_IDS.map((id) => {
              const a = c.archetypes[id];
              return (
                <li key={id} className="flex flex-col gap-3 rounded-[18px] border-2 border-ink bg-paper p-3 shadow-hard-sm">
                  <div className="flex h-24 items-center justify-center rounded-[12px] bg-ink text-paper">
                    <ArchetypeGlyph id={id} size={48} />
                  </div>
                  <div className="flex flex-col gap-1 px-1 pb-1">
                    <h3 className="font-display text-base font-extrabold leading-tight break-words">{a.name}</h3>
                    <p className="text-sm leading-snug text-muted">{a.tagline}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Пример результата */}
        <section id="example" className="flex scroll-mt-24 flex-col gap-8">
          <div>
            <SectionTitle>{t.example.title}</SectionTitle>
            <p className="mt-2 max-w-2xl text-lg font-medium">{t.example.lead}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {EXAMPLE.map((r) => (
              <ArchetypeCard key={r.id} result={r} />
            ))}
          </div>
          <p className="text-sm font-medium">{t.example.note}</p>
        </section>

        {/* Тарифы */}
        <section id="pricing" className="flex scroll-mt-24 flex-col gap-8">
          <div>
            <SectionTitle>{t.pricing.title}</SectionTitle>
            <p className="mt-2 text-lg font-medium">{t.pricing.lead}</p>
          </div>
          <PricingSection onNotice={setNotice} />
        </section>

        {/* Вопросы */}
        <section id="faq" className="flex scroll-mt-24 flex-col gap-8">
          <SectionTitle>{t.faq.title}</SectionTitle>
          <div className="flex flex-col gap-3">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group rounded-[18px] border-2 border-ink bg-paper px-5 py-4 open:shadow-hard-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Финальный призыв */}
        <section className="flex flex-col items-start gap-5 rounded-[28px] border-2 border-ink bg-ink p-8 text-paper shadow-[8px_8px_0_var(--paper)] sm:p-12">
          <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl break-words">{t.final.title}</h2>
          <p className="max-w-xl text-lg">{t.final.lead}</p>
          <ButtonLink to="/test" size="lg" variant="secondary">
            {t.final.cta} <ArrowRight className="size-5" />
          </ButtonLink>
        </section>
      </main>

      <footer className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-1 text-sm font-medium">
            <span>
              {t.footer.contacts}:{" "}
              <a href={`mailto:${SITE.ordersEmail}`} className="underline">
                {SITE.ordersEmail}
              </a>
            </span>
            <span>{c.ui.disclaimer}</span>
          </div>
          <ThemeSwitcher />
        </div>
      </footer>

      <CheckoutDialog notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[30px] font-extrabold leading-tight tracking-[-0.02em] sm:text-5xl break-words">
      {children}
    </h2>
  );
}
