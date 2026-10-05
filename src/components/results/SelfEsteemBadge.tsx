import { ShieldAlert } from "lucide-react";
import { SELF_ESTEEM } from "@/data/selfEsteem";
import { Card } from "@/components/ui/card";
import type { TestResult, Validity } from "@/lib/types";
import { ZONE_FILL } from "@/lib/zones";

export function SelfEsteemBadge({ result }: { result: TestResult }) {
  const se = SELF_ESTEEM[result.selfEsteem];
  const tone = se.tone === "yellow" ? "text-ink" : "text-paper";
  return (
    <Card className="p-5 sm:p-7 print-break">
      <div className="flex flex-col gap-4">
        <span className={`inline-flex self-start rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold ${ZONE_FILL[se.tone]} ${tone}`}>
          Тип самооценки
        </span>
        <h2 className="font-display text-[26px] sm:text-4xl font-extrabold leading-[1.05] tracking-[-0.02em]">{se.title}</h2>
        <p className="text-lg sm:text-xl font-semibold leading-snug">{se.formula}</p>
        <p className="leading-relaxed text-muted">{se.description}</p>
        <div className="rounded-[14px] bg-ink p-4 text-paper">
          <span className="text-sm font-semibold">Куда расти</span>
          <p className="mt-1 leading-relaxed">{se.vector}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <Stat label="Средняя зрелость" value={`${Math.round(result.averageMI)}`} />
          <Stat label="Валидность" value={`${result.validity.validityIndex}%`} />
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
  const notes: { title: string; text: string }[] = [];
  if (validity.defenseFlag) {
    notes.push({
      title: "Сработала защита эго",
      text: "На контрольные вопросы вы как минимум дважды ответили «Никогда». С такими ситуациями сталкивается почти каждый, так что, скорее всего, вам хотелось выглядеть лучше, чем есть. Индекс зрелости ограничен потолком 65%.",
    });
  }
  if (validity.straightLining) {
    notes.push({
      title: "Одинаковые ответы",
      text: "На все утверждения о зрелости дан один и тот же ответ. Так бывает, когда отвечают «на автомате», поэтому индексы зрелости могут быть неточными.",
    });
  }
  if (validity.rushed) {
    notes.push({
      title: "Слишком быстрые ответы",
      text: "Половина утверждений второго этапа отвечена быстрее, чем их можно прочитать. Результат стоит перепроверить, пройдя тест в спокойном темпе.",
    });
  }
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
        <p className="text-sm font-semibold">Индекс валидности: {validity.validityIndex}%</p>
      </div>
    </div>
  );
}
