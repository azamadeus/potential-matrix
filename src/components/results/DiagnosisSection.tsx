import { BatteryLow, EyeOff, Leaf, Siren, Sprout, Stethoscope, Swords, Users } from "lucide-react";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import type { ArchetypeResult } from "@/lib/types";

export function DiagnosisSection({ results }: { results: ArchetypeResult[] }) {
  const { c } = useLang();
  return (
    <div className="grid gap-5">
      {results.map((r) => {
        const a = c.archetypes[r.id];
        return (
          <Card key={r.id} className="p-5 sm:p-6 flex flex-col gap-5 print-break">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-ink text-paper">
                <ArchetypeGlyph id={r.id} size={26} />
              </span>
              <div className="flex flex-col">
                <h3 className="font-display text-lg font-extrabold leading-tight">{a.name}</h3>
                <span className="text-sm font-medium text-muted">
                  {c.ui.shadowLabel}: {a.shadowPattern}
                </span>
              </div>
            </div>
            <Row icon={Stethoscope} title={c.ui.happeningNow} text={a.diagnosis[r.zone]} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Row icon={EyeOff} title={c.ui.blindSpot} text={a.blindSpot} />
              <Row icon={Siren} title={c.ui.hiddenRisk} text={a.hiddenRisk} />
              <Row icon={Leaf} title={c.ui.needs} items={a.needs} />
              <Row icon={BatteryLow} title={c.ui.drains} items={a.drains} />
              <Row icon={Users} title={c.ui.inTeam} text={a.inTeam} />
              <Row icon={Swords} title={c.ui.inConflict} text={a.inConflict} />
            </div>
            <details className="group rounded-[14px] border-2 border-ink/15 p-4 open:border-ink/30">
              <summary className="flex cursor-pointer items-center gap-3 font-bold">
                <Sprout className="size-5 shrink-0" aria-hidden />
                {c.ui.roots}
              </summary>
              <p className="mt-2 text-sm text-muted">{c.ui.rootsNote}</p>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 leading-relaxed">
                {a.roots.map((root) => (
                  <li key={root}>{root}</li>
                ))}
              </ul>
            </details>
          </Card>
        );
      })}
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  text,
  items,
}: {
  icon: typeof EyeOff;
  title: string;
  text?: string;
  items?: string[];
}) {
  return (
    <div className="flex gap-3">
      <Icon className="size-5 shrink-0 mt-0.5" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold">{title}</span>
        {text ? <p className="leading-relaxed">{text}</p> : null}
        {items ? (
          <ul className="flex flex-col gap-1 leading-relaxed">
            {items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
