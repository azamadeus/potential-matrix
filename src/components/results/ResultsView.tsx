import { ARCHETYPES } from "@/data/archetypes";
import { Card } from "@/components/ui/card";
import type { TestResult } from "@/lib/types";
import { ArchetypeCard } from "./ArchetypeCard";
import { DiagnosisSection } from "./DiagnosisSection";
import { ExportActions } from "./ExportActions";
import { ProtocolSection } from "./ProtocolSection";
import { RadarChart } from "./RadarChart";
import { SelfEsteemBadge, ValidityWarnings } from "./SelfEsteemBadge";

export function ResultsView({ result, onRestart }: { result: TestResult; onRestart: () => void }) {
  const topIds = result.top.map((t) => t.id);
  return (
    <div className="flex flex-col gap-14">
      <header className="flex flex-col gap-4">
        <span className="font-semibold">
          Паспорт Потенциала ·{" "}
          {new Date(result.completedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <h1 className="font-display text-[36px] sm:text-6xl font-extrabold leading-[1.02] tracking-[-0.03em]">Ваша рука</h1>
        <p className="text-lg font-medium leading-snug max-w-2xl">
          Ваши сильнейшие карты: {result.top.map((t) => ARCHETYPES[t.id].name).join(", ")}. Ниже видно, как каждая из
          них играет сейчас и что с этим делать.
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
          <h2 className="font-display text-xl font-extrabold">Вся колода</h2>
          <p className="text-sm text-muted mt-1 mb-2">Сколько раз вы выбрали каждую из 12 карт в дилеммах</p>
          <RadarChart scores={result.scores} top={topIds} />
        </Card>
      </section>

      <Section title="Что происходит сейчас" subtitle="Тени, слепые зоны и скрытые риски каждой карты">
        <DiagnosisSection results={result.top} />
      </Section>

      <Section title="Как прокачать" subtitle="По два конкретных шага на карту. Начните с самой незрелой">
        <ProtocolSection result={result} />
      </Section>

      <footer className="flex flex-col gap-4 border-t-2 border-ink pt-6">
        <ExportActions result={result} onRestart={onRestart} />
        <p className="text-sm font-medium">
          Матрица Потенциала и Зрелости: авторская методика самопознания. Результат не является клиническим диагнозом.
        </p>
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
