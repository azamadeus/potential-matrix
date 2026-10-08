
import { useEffect, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Choice } from "@/lib/scoring";
import { useLang } from "@/i18n/context";

/** Сколько секунд на ответ. Таймер только подсказывает и ничего не пропускает. */
const TIME_LIMIT = 21;
const SWIPE_DISTANCE = 80;

/** Постоянные «масти» сторон: не зависят от архетипа, чтобы не подсказывать ответ. */
function Suit({ side }: { side: Choice }) {
  return side === "a" ? (
    <svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M22 40V24M22 24L8 8M22 24L36 8M22 24V4" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="36" cy="8" r="3" />
      <circle cx="22" cy="4" r="3" />
    </svg>
  ) : (
    <svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" aria-hidden>
      <path d="M22 3L41 22L22 41L3 22Z" />
      <path d="M22 12L32 22L22 32L12 22Z" />
    </svg>
  );
}

export function DilemmaCard({
  texts,
  previous,
  onChoose,
}: {
  texts: { a: string; b: string };
  previous?: Choice;
  onChoose: (choice: Choice) => void;
}) {
  const { c } = useLang();
  const [selected, setSelected] = useState<Choice | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const t = setInterval(() => setElapsed((Date.now() - started) / 1000), 100);
    return () => clearInterval(t);
  }, []);

  const choose = (c: Choice) => {
    if (selected) return;
    setSelected(c);
    setTimeout(() => onChoose(c), 300);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "a" || k === "ф" || e.key === "ArrowLeft" || k === "1") choose("a");
      if (k === "b" || k === "и" || e.key === "ArrowRight" || k === "2") choose("b");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE) choose("a");
    else if (info.offset.x > SWIPE_DISTANCE) choose("b");
  };

  const remaining = Math.max(0, TIME_LIMIT - elapsed);
  const overtime = elapsed >= TIME_LIMIT;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-[28px] sm:text-4xl font-extrabold leading-[1.05] tracking-[-0.02em]">
          {c.ui.dilemmaTitle}
        </h2>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/15" aria-hidden>
            <div className="h-full rounded-full bg-ink transition-[width] duration-100 ease-linear" style={{ width: `${(remaining / TIME_LIMIT) * 100}%` }} />
          </div>
          <span className="w-32 text-right text-sm font-semibold tabular-nums">
            {overtime ? c.ui.timerOver : c.ui.seconds(Math.ceil(remaining))}
          </span>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragEnd={onDragEnd}
        className="grid gap-5 sm:grid-cols-2 sm:gap-6 touch-pan-y"
      >
        {(["a", "b"] as const).map((key) => {
          const isSelected = selected === key;
          const dark = key === "b";
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => choose(key)}
              animate={
                isSelected
                  ? { rotate: 0, scale: 1.03, y: -6 }
                  : selected
                    ? { opacity: 0.35, scale: 0.96, rotate: key === "a" ? -6 : 6 }
                    : { rotate: key === "a" ? -2 : 1.5 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className={cn(
                "press flex min-h-48 cursor-pointer flex-col gap-5 rounded-[22px] border-2 border-ink p-5 sm:p-6 text-left",
                dark ? "bg-ink text-paper shadow-[6px_6px_0_var(--paper)]" : "bg-paper text-ink shadow-hard",
                !selected && previous === key && "outline-3 outline-offset-4 outline-ink",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="font-display text-2xl font-extrabold">{key === "a" ? c.ui.optionA : c.ui.optionB}</span>
                <Suit side={key} />
              </span>
              <span className="text-lg sm:text-xl font-medium leading-snug">{texts[key]}</span>
            </motion.button>
          );
        })}
      </motion.div>
      <p className="text-sm font-semibold text-center sm:text-left">
        <span className="sm:hidden">{c.ui.swipeHint}</span>
        <span className="hidden sm:inline">{c.ui.keysHint}</span>
      </p>
    </div>
  );
}
