
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/context";
import { cn } from "@/lib/utils";
import type { Likert, Stage2Item } from "@/lib/types";

/**
 * Все утверждения Этапа 2 (включая контрольные) отвечаются по одной поведенческой шкале частоты:
 * так контрольные вопросы не выделяются, а ответ опирается на конкретный опыт, а не на образ себя.
 */
export function ScaleCard({
  item,
  index,
  previous,
  onAnswer,
}: {
  item: Stage2Item;
  index: number;
  previous?: Likert;
  onAnswer: (value: Likert, ms: number) => void;
}) {
  const { c } = useLang();
  const prompt = c.ui.scalePrompt;
  const text = item.type === "lie" ? c.lie[item.index] : c.markers[item.archetype][item.kind];
  const [selected, setSelected] = useState<Likert | null>(null);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = performance.now();
  }, []);

  const answer = (v: Likert) => {
    if (selected) return;
    setSelected(v);
    const ms = performance.now() - shownAt.current;
    setTimeout(() => onAnswer(v, ms), 240);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 5) answer(n as Likert);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-[22px] border-2 border-ink bg-paper p-5 sm:p-7 shadow-hard flex flex-col gap-3">
        <span className="text-sm font-semibold text-muted">{prompt}</span>
        <h2 className="text-xl sm:text-2xl font-semibold leading-snug">{text}</h2>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3" role="radiogroup" aria-label={prompt}>
        {c.ui.scale.map((label, i) => {
          const v = (i + 1) as Likert;
          const isSelected = selected === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={isSelected || (!selected && previous === v)}
              aria-label={`${v}: ${label}`}
              onClick={() => answer(v)}
              className={cn(
                "press flex flex-col items-center gap-1.5 rounded-[16px] border-2 border-ink px-0.5 py-3 sm:py-4 cursor-pointer",
                "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
                isSelected ? "bg-ink text-paper shadow-[3px_3px_0_var(--paper)]" : "bg-paper shadow-hard-sm",
                !selected && previous === v && "outline-3 outline-offset-2 outline-ink",
                selected && !isSelected && "opacity-40",
              )}
            >
              <span className="font-display text-xl sm:text-2xl font-extrabold tabular-nums">{v}</span>
              <span className={cn("text-[10px] sm:text-xs font-medium leading-tight text-center", isSelected ? "" : "text-muted")}>{label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[15px] font-medium">{c.ui.hints[index % c.ui.hints.length]}</p>
    </div>
  );
}
