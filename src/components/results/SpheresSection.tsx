import { Briefcase, House, User, Users } from "lucide-react";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { Card } from "@/components/ui/card";
import { useLang } from "@/i18n/context";
import type { SphereId } from "@/i18n/types";
import type { ArchetypeResult } from "@/lib/types";

const SPHERES: { id: SphereId; icon: typeof Briefcase }[] = [
  { id: "work", icon: Briefcase },
  { id: "family", icon: House },
  { id: "friends", icon: Users },
  { id: "self", icon: User },
];

/** Как карта проявляется в работе, семье, дружбе и в отношении к себе. */
export function SpheresSection({ results }: { results: ArchetypeResult[] }) {
  const { c } = useLang();
  return (
    <div className="grid gap-5">
      {results.map((r) => (
        <Card key={r.id} className="flex flex-col gap-5 p-5 sm:p-6 print-break">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-ink text-paper">
              <ArchetypeGlyph id={r.id} size={26} />
            </span>
            <h3 className="font-display text-lg font-extrabold leading-tight">{c.archetypes[r.id].name}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SPHERES.map(({ id, icon: Icon }) => (
              <div key={id} className="flex gap-3 rounded-[14px] border-2 border-ink/15 p-4">
                <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">{c.ui.sphereNames[id]}</span>
                  <p className="leading-relaxed">{c.extras[r.id].spheres[id]}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
