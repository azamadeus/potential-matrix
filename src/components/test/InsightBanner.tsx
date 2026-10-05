
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ARCHETYPES } from "@/data/archetypes";
import type { ArchetypeId } from "@/lib/types";

/** Промежуточная «подсказка» Этапа 1 — подогревает интерес к результату. */
export function InsightBanner({ leader, answered }: { leader: ArchetypeId | null; answered: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 rounded-[18px] border-2 border-ink bg-ink text-paper px-4 py-3 text-[15px] no-print"
      role="status"
    >
      <Sparkles className="size-5 shrink-0 mt-0.5" aria-hidden />
      <span>
        {leader ? (
          <>
            После {answered} ответов лидирует <b>{ARCHETYPES[leader].name}</b>. Посмотрим,
            удержит ли позицию.
          </>
        ) : (
          <>После {answered} ответов несколько карт идут вровень.</>
        )}
      </span>
    </motion.div>
  );
}
