import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import type { TestResult, Validity } from "@/lib/types";
import { SELF_ESTEEM_TONE, ZONE_FILL } from "@/lib/zones";

export function SelfEsteemBadge({ result }: { result: TestResult }) {
  const { c } = useLang();
  const se = c.selfEsteem[result.selfEsteem];
  const toneZone = SELF_ESTEEM_TONE[result.selfEsteem];
  const tone = toneZone === "yellow" ? "text-ink" : "text-paper";
  return (
    <Card className="p-5 sm:p-7 print-break">
      <div className="flex flex-col gap-4">
        <span
          className={`inline-flex self-start rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold ${ZONE_FILL[toneZone]} ${tone}`}
        >
          {c.ui.selfEsteem}
        </span>
        <h2 className="font-display text-[26px] sm:text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] [overflow-wrap:anywhere]">
          {se.title}
        </h2>
        <p className="text-lg sm:text-xl font-semibold leading-snug">{se.formula}</p>
        <p className="leading-relaxed text-muted">{se.description}</p>
        <div className="rounded-[14px] bg-ink p-4 text-paper">
          <span className="text-sm font-semibold">{c.ui.growTo}</span>
          <p className="mt-1 leading-relaxed">{se.vector}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <Stat label={c.ui.avgMaturity} value={`${Math.round(result.averageMI)}`} />
          <Stat label={c.ui.validity} value={`${result.validity.validityIndex}%`} />
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border-2 border-ink px-3 py-2">
      <div className="text-xs font-semibold text-muted">{label}</div>
      <div className="font-display text-2xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

export function ValidityWarnings({ validity }: { validity: Validity }) {
  const { c } = useLang();
  const notes: { title: string; text: string }[] = [];
  if (validity.defenseFlag) notes.push({ title: c.ui.defenseTitle, text: c.ui.defenseText });
  if (validity.straightLining) notes.push({ title: c.ui.straightTitle, text: c.ui.straightText });
  if (validity.rushed) notes.push({ title: c.ui.rushedTitle, text: c.ui.rushedText });
  if (notes.length === 0) return null;
  return (
    <div className="flex gap-3 rounded-[22px] border-2 border-ink bg-zone-yellow p-4 sm:p-5 shadow-hard print-break" role="alert">
      <ShieldAlert className="size-6 shrink-0 mt-0.5" aria-hidden />
      <div className="flex flex-col gap-3">
        {notes.map((n) => (
          <div key={n.title} className="flex flex-col gap-1">
            <span className="font-display font-bold">{n.title}</span>
            <p className="leading-relaxed">{n.text}</p>
          </div>
        ))}
        <p className="text-sm font-semibold">{c.ui.validityIndex(validity.validityIndex)}</p>
      </div>
    </div>
  );
}
