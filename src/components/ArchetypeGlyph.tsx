import { GLYPHS } from "@/data/glyphs";
import type { ArchetypeId } from "@/lib/types";

export function ArchetypeGlyph({ id, size = 48, className }: { id: ArchetypeId; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {GLYPHS[id].map((s, i) => {
        const fill = s.fill ? "currentColor" : undefined;
        if (s.t === "path") return <path key={i} d={s.d} fill={fill} />;
        if (s.t === "circle") return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={fill} />;
        return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={fill} />;
      })}
    </svg>
  );
}
