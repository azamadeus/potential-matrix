import { Zap } from "lucide-react";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import type { ArchetypeResult } from "@/lib/types";

/** Суперсилы каждой из трёх карт: то, на что стоит опираться. */
export function SuperpowersSection({ results }: { results: ArchetypeResult[] }) {
  const { c } = useLang();
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {results.map((r) => {
        const a = c.archetypes[r.id];
        return (
          <Card key={r.id} className="flex flex-col gap-5 p-5 sm:p-6 print-break">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-ink text-paper">
                <ArchetypeGlyph id={r.id} size={26} />
              </span>
              <h3 className="font-display text-lg font-extrabold leading-tight break-words">{a.name}</h3>
            </div>
            <ul className="flex flex-col gap-4">
              {c.extras[r.id].superpowers.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <Zap className="mt-0.5 size-5 shrink-0" aria-hidden />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold">{s.title}</span>
                    <p className="leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
