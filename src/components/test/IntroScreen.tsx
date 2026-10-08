import { ArrowRight } from "lucide-react";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/context";
import type { ArchetypeId } from "@/lib/types";

const FAN: { id: ArchetypeId; rotate: string; offset: string; dark?: boolean }[] = [
  { id: "ARCH_05", rotate: "-rotate-12", offset: "translate-y-3" },
  { id: "ARCH_07", rotate: "rotate-0", offset: "-translate-y-2", dark: true },
  { id: "ARCH_10", rotate: "rotate-12", offset: "translate-y-3" },
];

export function IntroScreen({ onStart }: { onStart: () => void }) {
  const { c } = useLang();
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center pt-2" aria-hidden>
        {FAN.map(({ id, rotate, offset, dark }) => (
          <div
            key={id}
            className={`-mx-3 flex h-40 w-28 sm:h-48 sm:w-34 items-center justify-center rounded-[18px] border-2 border-ink shadow-hard ${rotate} ${offset} ${dark ? "bg-ink text-paper z-10" : "bg-paper text-ink"}`}
          >
            <ArchetypeGlyph id={id} size={56} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-display text-[34px] sm:text-6xl font-extrabold leading-[1.02] tracking-[-0.03em] [overflow-wrap:anywhere]">
          {c.ui.appTitle}
        </h1>
        <p className="text-lg sm:text-xl font-medium max-w-xl leading-snug">{c.ui.introLead}</p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {c.ui.introSteps.map(([title, text], i) => (
          <li key={title} className="flex gap-3 rounded-[18px] border-2 border-ink bg-paper p-4">
            <span className="font-display text-2xl font-extrabold leading-none">{i + 1}</span>
            <span className="flex flex-col gap-1">
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-muted leading-snug">{text}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button size="lg" onClick={onStart} className="w-full sm:w-auto">
          {c.ui.start} <ArrowRight className="size-5" />
        </Button>
        <span className="text-sm font-medium">{c.ui.introNote}</span>
      </div>
    </div>
  );
}
