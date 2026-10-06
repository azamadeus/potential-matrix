
import { useState } from "react";
import { ARCHETYPE_IDS } from "@/data/archetypes";
import { useLang } from "@/i18n/context";
import type { ArchetypeId } from "@/lib/types";

const W = 580;
const H = 440;
const CX = W / 2;
const CY = H / 2;
const R = 140;

function point(i: number, value: number, max: number) {
  const angle = (Math.PI * 2 * i) / ARCHETYPE_IDS.length - Math.PI / 2;
  const r = (value / max) * R;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle), angle };
}

/** Радар 12 архетипов по голосам Этапа 1; ТОП-3 выделен. */
export function RadarChart({ scores, top }: { scores: Record<ArchetypeId, number>; top: ArchetypeId[] }) {
  const { c } = useLang();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(4, ...Object.values(scores));
  const rings = Array.from({ length: max }, (_, i) => i + 1);
  const polygon = ARCHETYPE_IDS.map((id, i) => point(i, scores[id], max))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto max-w-[580px] mx-auto block"
        role="img"
        aria-label={c.ui.deckAria}
      >
        {rings.map((r) => (
          <polygon
            key={r}
            points={ARCHETYPE_IDS.map((_, i) => point(i, r, max))
              .map((p) => `${p.x},${p.y}`)
              .join(" ")}
            fill="none"
            stroke="var(--ink)" strokeOpacity={0.16}
            strokeWidth={1}
          />
        ))}
        {ARCHETYPE_IDS.map((id, i) => {
          const end = point(i, max, max);
          return <line key={id} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="var(--ink)" strokeOpacity={0.16} strokeWidth={1} />;
        })}
        <polygon
          points={polygon}
          fill="var(--ink)"
          fillOpacity={0.12}
          stroke="var(--ink)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {ARCHETYPE_IDS.map((id, i) => {
          const p = point(i, scores[id], max);
          const label = point(i, max * 1.14, max);
          const isTop = top.includes(id);
          const anchor = Math.abs(Math.cos(label.angle)) < 0.2 ? "middle" : Math.cos(label.angle) > 0 ? "start" : "end";
          return (
            <g
              key={id}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setHover(hover === i ? null : i)}
              className="cursor-pointer"
            >
              {/* увеличенная зона наведения */}
              <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isTop ? 6 : 4}
                fill={isTop ? "var(--ink)" : "var(--paper)"}
                stroke="var(--ink)"
                strokeWidth={2}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={15}
                fontWeight={isTop ? 800 : 500}
                fill={isTop ? "var(--ink)" : "var(--muted)"}
              >
                {c.archetypes[id].short}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null ? (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-[12px] border-2 border-ink bg-ink px-3 py-2 text-sm text-paper">
          <div className="font-semibold">{c.archetypes[ARCHETYPE_IDS[hover]].name}</div>
          <div className="tabular-nums">{c.ui.pickedInDilemmas(scores[ARCHETYPE_IDS[hover]])}</div>
        </div>
      ) : null}
      <details className="mt-3 text-sm no-print">
        <summary className="cursor-pointer font-semibold underline decoration-2 underline-offset-4">{c.ui.showTable}</summary>
        <table className="mt-2 w-full text-left">
          <tbody>
            {[...ARCHETYPE_IDS]
              .sort((a, b) => scores[b] - scores[a])
              .map((id) => (
                <tr key={id} className="border-t border-ink/20">
                  <td className="py-1.5 pr-2">{c.archetypes[id].name}</td>
                  <td className="py-1.5 text-right tabular-nums text-muted">{scores[id]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
