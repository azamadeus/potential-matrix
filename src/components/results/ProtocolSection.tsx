import { ARCHETYPES } from "@/data/archetypes";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import { protocolOrder, protocolSteps } from "@/lib/report";
import type { TestResult } from "@/lib/types";

/** Протокол трансформации: 2 шага на карту, начиная с наименее зрелой. */
export function ProtocolSection({ result }: { result: TestResult }) {
  const [focus, ...rest] = protocolOrder(result);
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[24px] border-2 border-ink bg-ink p-5 sm:p-7 text-paper shadow-[8px_8px_0_var(--paper)] print-break">
        <div className="flex items-center gap-3 mb-6">
          <ArchetypeGlyph id={focus.id} size={40} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Начните с этой карты</span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold leading-tight">{ARCHETYPES[focus.id].name}</h3>
          </div>
        </div>
        <Steps steps={protocolSteps(focus)} large />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {rest.map((r) => (
          <Card key={r.id} className="p-5 print-break">
            <div className="flex items-center gap-2 mb-4">
              <ArchetypeGlyph id={r.id} size={24} />
              <h4 className="font-display font-bold leading-tight">{ARCHETYPES[r.id].name}</h4>
            </div>
            <Steps steps={protocolSteps(r)} />
          </Card>
        ))}
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
