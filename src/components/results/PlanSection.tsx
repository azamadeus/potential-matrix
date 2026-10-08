import { BookOpen } from "lucide-react";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import { protocolOrder } from "@/lib/report";
import type { TestResult } from "@/lib/types";

/** План на 30 дней (по неделям) и книги. Порядок карт: сначала самая незрелая. */
export function PlanSection({ result }: { result: TestResult }) {
  const { c } = useLang();
  const order = protocolOrder(result);
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((w) => (
          <Card key={w} className="flex flex-col gap-4 p-5 sm:p-6 print-break">
            <h3 className="font-display text-xl font-extrabold">{c.ui.week(w + 1)}</h3>
            <ul className="flex flex-col gap-3">
              {order.map((r) => (
                <li key={r.id} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-ink text-paper">
                    <ArchetypeGlyph id={r.id} size={18} />
                  </span>
                  <p className="leading-relaxed">{c.extras[r.id].plan[w]}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-2xl font-extrabold">{c.ui.booksTitle}</h3>
        <p className="font-medium">{c.ui.booksLead}</p>
        <div className="grid gap-5 md:grid-cols-3">
          {order.map((r) => (
            <Card key={r.id} className="flex flex-col gap-4 p-5 print-break">
              <div className="flex items-center gap-2">
                <ArchetypeGlyph id={r.id} size={24} />
                <h4 className="font-display font-bold leading-tight">{c.archetypes[r.id].name}</h4>
              </div>
              <ul className="flex flex-col gap-3">
                {c.extras[r.id].books.map((b) => (
                  <li key={b.title} className="flex gap-2.5">
                    <BookOpen className="mt-0.5 size-5 shrink-0" aria-hidden />
                    <span className="leading-snug">
                      <span className="font-bold">{b.title}</span>
                      <br />
                      <span className="text-sm text-muted">{b.author}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
