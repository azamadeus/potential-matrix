import { EyeOff, Siren, Stethoscope } from "lucide-react";
import { ARCHETYPES } from "@/data/archetypes";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import type { ArchetypeResult } from "@/lib/types";

export function DiagnosisSection({ results }: { results: ArchetypeResult[] }) {
  return (
    <div className="grid gap-5">
      {results.map((r) => {
        const a = ARCHETYPES[r.id];
        return (
          <Card key={r.id} className="p-5 sm:p-6 flex flex-col gap-5 print-break">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-ink text-paper">
                <ArchetypeGlyph id={r.id} size={26} />
              </span>
              <div className="flex flex-col">
                <h3 className="font-display text-lg font-extrabold leading-tight">{a.name}</h3>
                <span className="text-sm font-medium text-muted">Тень: {a.shadowPattern}</span>
              </div>
            </div>
            <Row icon={Stethoscope} title="Что происходит сейчас" text={a.diagnosis[r.zone]} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Row icon={EyeOff} title="Слепая зона" text={a.blindSpot} />
              <Row icon={Siren} title="Скрытые риски" text={a.hiddenRisk} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Row({ icon: Icon, title, text }: { icon: typeof EyeOff; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="size-5 shrink-0 mt-0.5" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold">{title}</span>
        <p className="leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
