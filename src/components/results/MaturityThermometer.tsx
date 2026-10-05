import { ZONE_META } from "@/data/selfEsteem";
import { cn } from "@/lib/utils";
import type { Zone } from "@/lib/types";
import { ZONE_FILL } from "@/lib/zones";

const LEVEL: Record<Zone, number> = { red: 1, yellow: 2, green: 3 };
const LEVEL_NAMES = ["Тень", "Функционально", "Опора"];

/** Шкала зрелости карты: точный MI + уровень 1–3 (Red / Yellow / Green). */
export function MaturityThermometer({ mi, zone, capped }: { mi: number; zone: Zone; capped?: boolean }) {
  const v = Math.round(mi);
  const level = LEVEL[zone];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm font-semibold">Зрелость</span>
        <span className="text-sm font-semibold tabular-nums">
          <span className="font-display text-2xl font-extrabold">{v}</span>/100 · уровень {level} из 3
        </span>
      </div>
      <div
        className="grid grid-cols-3 gap-1"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        aria-label={`Индекс зрелости ${v}%, ${ZONE_META[zone].label}`}
      >
        {[1, 2, 3].map((n) => (
          <div key={n} className={cn("h-3.5 rounded-full border-2 border-ink", n <= level ? ZONE_FILL[zone] : "bg-paper")} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 text-[11px] font-medium text-muted">
        {LEVEL_NAMES.map((name, i) => (
          <span key={name} className={cn(i === 1 && "text-center", i === 2 && "text-right", i + 1 === level && "font-bold text-ink")}>
            {name}
          </span>
        ))}
      </div>
      {capped ? <span className="text-xs font-medium text-muted">Ограничено потолком 65 из-за защиты эго</span> : null}
    </div>
  );
}
