import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import type { TestResult } from "@/lib/types";
import { ArchetypeCard } from "./ArchetypeCard";
import { DiagnosisSection } from "./DiagnosisSection";
import { ExportActions } from "./ExportActions";
import { ProtocolSection } from "./ProtocolSection";
import { RadarChart } from "./RadarChart";
import { SelfEsteemBadge, ValidityWarnings } from "./SelfEsteemBadge";

export function ResultsView({ result, onRestart }: { result: TestResult; onRestart: () => void }) {
  const { c } = useLang();
  const topIds = result.top.map((t) => t.id);
  const date = c.ui.formatDate(new Date(result.completedAt));
  return (
    <div className="flex flex-col gap-14">
      <header className="flex flex-col gap-4">
        <span className="font-semibold">
          {c.ui.passport} · {date}
        </span>
        <h1 className="font-display text-[36px] sm:text-6xl font-extrabold leading-[1.02] tracking-[-0.03em]">
          {c.ui.handTitle}
        </h1>
        <p className="text-lg font-medium leading-snug max-w-2xl">
          {c.ui.handLead(result.top.map((t) => c.archetypes[t.id].name).join(", "))}
        </p>
        <ExportActions result={result} onRestart={onRestart} />
      </header>

      <ValidityWarnings validity={result.validity} />

      <div className="grid gap-6 md:grid-cols-3">
        {result.top.map((r) => (
          <ArchetypeCard key={r.id} result={r} />
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr] items-start">
        <SelfEsteemBadge result={result} />
        <Card className="p-4 sm:p-6 print-break">
          <h2 className="font-display text-xl font-extrabold">{c.ui.deck}</h2>
          <p className="text-sm text-muted mt-1 mb-2">{c.ui.deckLead}</p>
          <RadarChart scores={result.scores} top={topIds} />
        </Card>
      </section>

      <Section title={c.ui.nowTitle} subtitle={c.ui.nowLead}>
        <DiagnosisSection results={result.top} />
      </Section>

      <Section title={c.ui.levelUpTitle} subtitle={c.ui.levelUpLead}>
        <ProtocolSection result={result} />
      </Section>

      <footer className="flex flex-col gap-4 border-t-2 border-ink pt-6">
        <ExportActions result={result} onRestart={onRestart} />
        <p className="text-sm font-medium">{c.ui.disclaimer}</p>
      </footer>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-[28px] sm:text-4xl font-extrabold leading-tight tracking-[-0.02em]">{title}</h2>
        <p className="mt-1 font-medium">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
