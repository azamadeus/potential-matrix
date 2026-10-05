import { ARCHETYPES } from "@/data/archetypes";
import { ZONE_META } from "@/data/selfEsteem";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { cardNumber } from "@/data/glyphs";
import { Badge } from "@/components/ui/badge";
import type { ArchetypeResult } from "@/lib/types";
import { MaturityThermometer } from "./MaturityThermometer";

/** Коллекционная карта архетипа. */
export function ArchetypeCard({ result }: { result: ArchetypeResult }) {
  const a = ARCHETYPES[result.id];
  const stats = [
    ["Тень", result.answers.shadow_1, false],
    ["Тень", result.answers.shadow_2, false],
    ["Опора", result.answers.grounded, true],
  ] as const;
  return (
    <article className="flex flex-col gap-4 rounded-[24px] border-2 border-ink bg-paper p-3.5 shadow-hard-lg print-break">
      <div className="relative flex h-44 items-center justify-center rounded-[14px] bg-ink text-paper">
        <ArchetypeGlyph id={result.id} size={104} />
        <span className="absolute left-3 top-2.5 font-display text-sm font-extrabold">{cardNumber(result.id)}</span>
        <span className="absolute right-3 top-2.5 text-xs font-semibold">Карта {result.rank} из 3</span>
        <span className="absolute bottom-2.5 left-3 right-3 truncate text-right text-xs font-semibold">
          {a.themes.join(" · ")}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[22px] font-extrabold leading-[1.05] tracking-[-0.02em]">{a.name}</h3>
          <Badge tone={result.zone} className="mt-1">{ZONE_META[result.zone].label.replace(" зона", "")}</Badge>
        </div>
        <p className="text-[15px] leading-snug">{a.essence}</p>
      </div>
      <dl className="grid grid-cols-3 gap-2 px-1">
        {stats.map(([label, v, grounded], i) => (
          <div
            key={i}
            className={`flex flex-col gap-0.5 rounded-[10px] border-2 border-ink p-2 ${grounded ? "bg-ink text-paper" : ""}`}
          >
            <dt className="text-[11px] font-semibold">{label}</dt>
            <dd className="font-display text-lg font-bold tabular-nums">{v}/5</dd>
          </div>
        ))}
      </dl>
      <div className="px-1 pb-1">
        <MaturityThermometer mi={result.mi} zone={result.zone} capped={result.capped} />
      </div>
      <span className="px-1 pb-1 text-xs font-medium text-muted">Выбрана в дилеммах: {result.votes} из 20</span>
    </article>
  );
}
