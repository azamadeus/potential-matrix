
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ARCHETYPES } from "@/data/archetypes";
import { ArchetypeGlyph } from "@/components/ArchetypeGlyph";
import { cardNumber } from "@/data/glyphs";
import { Button } from "@/components/ui/button";
import type { ArchetypeId } from "@/lib/types";

export function Stage2Intro({ top, onContinue }: { top: ArchetypeId[]; onContinue: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Первый этап позади</span>
        <h2 className="font-display text-[30px] sm:text-5xl font-extrabold leading-[1.02] tracking-[-0.03em]">Вам выпали эти карты</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3" style={{ perspective: 1000 }}>
        {top.map((id, i) => {
          const a = ARCHETYPES[id];
          return (
            <motion.div
              key={id}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.25, duration: 0.45, ease: "easeOut" }}
              className="flex items-center gap-4 rounded-[22px] border-2 border-ink bg-paper p-4 shadow-hard sm:flex-col sm:items-stretch"
            >
              <div className="relative flex size-20 shrink-0 items-center justify-center rounded-[14px] bg-ink text-paper sm:h-36 sm:w-auto">
                <ArchetypeGlyph id={id} size={44} className="sm:size-16" />
                <span className="absolute left-2 top-1.5 font-display text-[11px] font-extrabold">{cardNumber(id)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg font-extrabold leading-tight">{a.name}</h3>
                <p className="text-sm text-muted leading-snug">{a.tagline}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-lg font-medium max-w-2xl leading-snug">
        Теперь проверим, как каждая карта играет сейчас. Будет 12 утверждений. Отметьте, как часто это бывает с вами в
        последние недели.
      </p>
      <Button size="lg" onClick={onContinue} className="w-full sm:w-auto self-start">
        Проверить зрелость <ArrowRight className="size-5" />
      </Button>
    </div>
  );
}
