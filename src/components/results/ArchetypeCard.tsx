import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Badge } from "@/components/ui/badge";
import { cardNumber } from "@/data/glyphs";
import { useLang } from "@/i18n/context";
import type { ArchetypeResult } from "@/lib/types";
import { MaturityThermometer } from "./MaturityThermometer";

/** Коллекционная карта архетипа. */
export function ArchetypeCard({ result }: { result: ArchetypeResult }) {
  const { c } = useLang();
  const a = c.archetypes[result.id];
  // Два теневых утверждения сводим в одну оценку: так «Тень» не дублируется.
  const shadow = (result.answers.shadow_1 + result.answers.shadow_2) / 2;
  const fmt = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
  const stats = [
    [c.ui.shadow, fmt(shadow), false],
    [c.ui.grounded, fmt(result.answers.grounded), true],
  ] as const;
  return (
    <article className="flex flex-col gap-4 rounded-[24px] border-2 border-ink bg-paper p-3.5 shadow-hard-lg print-break">
      <div className="relative flex h-44 items-center justify-center rounded-[14px] bg-ink text-paper">
        <ArchetypeGlyph id={result.id} size={104} />
        <span className="absolute left-3 top-2.5 font-display text-sm font-extrabold">{cardNumber(result.id)}</span>
        <span className="absolute right-3 top-2.5 text-xs font-semibold">{c.ui.cardOf(result.rank)}</span>
        <span className="absolute bottom-2.5 left-3 right-3 truncate text-right text-xs font-semibold">
          {a.traits.join(" · ")}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <Badge tone={result.zone} className="self-start">
          {c.zones[result.zone].level}
        </Badge>
        <h3 className="font-display text-[22px] font-extrabold leading-[1.05] tracking-[-0.02em] break-words">{a.name}</h3>
        <p className="text-[15px] leading-snug">{a.essence}</p>
      </div>
      <dl className="grid grid-cols-2 gap-2 px-1">
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
      <span className="px-1 pb-1 text-xs font-medium text-muted">{c.ui.pickedTimes(result.votes)}</span>
    </article>
  );
}
