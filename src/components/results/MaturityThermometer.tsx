import { useLang } from "@/i18n/context";
import type { Zone } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ZONE_FILL, ZONE_LEVEL } from "@/lib/zones";

const ZONES: Zone[] = ["red", "yellow", "green"];

/** Шкала зрелости карты: точный MI и уровень 1–3 (Red / Yellow / Green). */
export function MaturityThermometer({ mi, zone, capped }: { mi: number; zone: Zone; capped?: boolean }) {
  const { c } = useLang();
  const v = Math.round(mi);
  const level = ZONE_LEVEL[zone];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm font-semibold">{c.ui.maturity}</span>
        <span className="text-sm font-semibold tabular-nums">
          <span className="font-display text-2xl font-extrabold">{v}</span>/100 · {c.ui.maturityLevel(level)}
        </span>
      </div>
      <div
        className="grid grid-cols-3 gap-1"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        aria-label={`${c.ui.maturity} ${v}%, ${c.zones[zone].label}`}
      >
        {[1, 2, 3].map((n) => (
          <div key={n} className={cn("h-3.5 rounded-full border-2 border-ink", n <= level ? ZONE_FILL[zone] : "bg-paper")} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 text-[11px] font-medium text-muted">
        {ZONES.map((z, i) => (
          <span key={z} className={cn(i === 1 && "text-center", i === 2 && "text-right", i + 1 === level && "font-bold text-ink")}>
            {c.zones[z].level}
          </span>
        ))}
      </div>
      {capped ? <span className="text-xs font-medium text-muted">{c.ui.capped}</span> : null}
    </div>
  );
}
