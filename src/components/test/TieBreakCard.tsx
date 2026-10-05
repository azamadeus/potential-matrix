
import { useState } from "react";
import { ARCHETYPES } from "@/data/archetypes";
import { cn } from "@/lib/utils";
import type { ArchetypeId, TieBreak } from "@/lib/types";

export function TieBreakCard({ tie, onPick }: { tie: TieBreak; onPick: (id: ArchetypeId) => void }) {
  const [selected, setSelected] = useState<ArchetypeId | null>(null);

  const pick = (id: ArchetypeId) => {
    if (selected) return;
    setSelected(id);
    setTimeout(() => onPick(id), 280);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="inline-flex self-start rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-semibold">
          Ничья в колоде
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight tracking-[-0.02em]">
          Несколько карт набрали поровну. Какая точнее про вас?
        </h2>
      </div>
      <div className="grid gap-4">
        {tie.candidates.map((id) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              className={cn(
                "press cursor-pointer rounded-[18px] border-2 border-ink p-5 text-left text-lg font-medium leading-snug",
                isSelected ? "bg-ink text-paper shadow-[4px_4px_0_var(--paper)]" : "bg-paper shadow-hard-sm",
                selected && !isSelected && "opacity-40",
              )}
            >
              {ARCHETYPES[id].tieStatement}
            </button>
          );
        })}
      </div>
    </div>
  );
}
