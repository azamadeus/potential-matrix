import { Wrench } from "lucide-react";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import { protocolOrder, protocolSteps } from "@/lib/report";
import type { TestResult } from "@/lib/types";

/** Протокол трансформации: 2 шага и инструменты на карту, начиная с наименее зрелой. */
export function ProtocolSection({ result }: { result: TestResult }) {
  const { c } = useLang();
  const [focus, ...rest] = protocolOrder(result);
  const focusText = c.archetypes[focus.id];
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[24px] border-2 border-ink bg-ink p-5 sm:p-7 text-paper shadow-[8px_8px_0_var(--paper)] print-break">
        <div className="flex items-center gap-3 mb-6">
          <ArchetypeGlyph id={focus.id} size={40} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{c.ui.startHere}</span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold leading-tight">{focusText.name}</h3>
          </div>
        </div>
        <Steps steps={protocolSteps(c, focus)} large />
        <Tools title={c.ui.tools} tools={focusText.tools} dark />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {rest.map((r) => {
          const a = c.archetypes[r.id];
          return (
            <Card key={r.id} className="p-5 print-break">
              <div className="flex items-center gap-2 mb-4">
                <ArchetypeGlyph id={r.id} size={24} />
                <h4 className="font-display font-bold leading-tight">{a.name}</h4>
              </div>
              <Steps steps={protocolSteps(c, r)} />
              <Tools title={c.ui.tools} tools={a.tools} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Steps({ steps, large }: { steps: [string, string]; large?: boolean }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span
            className={`flex shrink-0 items-center justify-center rounded-full border-2 font-display font-extrabold tabular-nums ${large ? "size-9 border-paper text-sm" : "size-7 border-ink text-xs"}`}
          >
            {i + 1}
          </span>
          <p className={`leading-relaxed ${large ? "text-lg" : ""}`}>{s}</p>
        </li>
      ))}
    </ol>
  );
}

function Tools({ title, tools, dark }: { title: string; tools: { name: string; how: string }[]; dark?: boolean }) {
  return (
    <div className={`mt-6 border-t-2 pt-4 ${dark ? "border-paper/25" : "border-ink/15"}`}>
      <span className="flex items-center gap-2 text-sm font-bold">
        <Wrench className="size-4" aria-hidden /> {title}
      </span>
      <ul className="mt-3 flex flex-col gap-2.5">
        {tools.map((t) => (
          <li key={t.name} className="leading-relaxed">
            <span className="font-bold">{t.name}.</span> {t.how}
          </li>
        ))}
      </ul>
    </div>
  );
}
