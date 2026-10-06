import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLang } from "@/i18n/context";

export function ProgressHeader({
  stageLabel,
  counter,
  progress,
  onBack,
}: {
  stageLabel: string;
  counter?: string;
  progress: number;
  onBack?: () => void;
}) {
  const { c } = useLang();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 min-h-10">
        <div className="flex min-w-0 items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label={c.ui.back}
              className="press flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-ink bg-paper shadow-hard-sm"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : null}
          <span className="truncate font-display text-[15px] font-bold">{stageLabel}</span>
        </div>
        <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums">{counter}</span>
      </div>
      <Progress value={progress} label={c.ui.progress} />
    </div>
  );
}
