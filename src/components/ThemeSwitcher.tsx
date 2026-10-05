
import { useEffect, useState } from "react";
import { GROUNDS, applyGround, loadGround, type GroundId } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const [ground, setGround] = useState<GroundId>(GROUNDS[0].id);

  useEffect(() => {
    const saved = loadGround();
    applyGround(saved);
    // Синхронизация с localStorage после гидратации.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGround(saved);
  }, []);

  const pick = (id: GroundId) => {
    setGround(id);
    applyGround(id);
  };

  return (
    <div role="radiogroup" aria-label="Цвет фона" className="flex items-center gap-2 no-print">
      {GROUNDS.map((g) => (
        <button
          key={g.id}
          type="button"
          role="radio"
          aria-checked={ground === g.id}
          aria-label={g.label}
          title={g.label}
          onClick={() => pick(g.id)}
          className={cn(
            "size-8 cursor-pointer rounded-full border-2 border-ink transition-transform",
            ground === g.id ? "scale-110 shadow-hard-sm" : "hover:scale-105",
          )}
          style={{ background: g.color }}
        />
      ))}
    </div>
  );
}
