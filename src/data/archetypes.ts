import type { ArchetypeGroup, ArchetypeId } from "@/lib/types";

/**
 * Языконезависимые данные архетипов. Все тексты лежат в src/i18n.
 * Группа нужна для определения типа самооценки.
 */
export const ARCHETYPE_GROUP: Record<ArchetypeId, ArchetypeGroup> = {
  ARCH_01: "logical",
  ARCH_02: "logical",
  ARCH_03: "neutral",
  ARCH_04: "logical",
  ARCH_05: "neutral",
  ARCH_06: "neutral",
  ARCH_07: "emotional",
  ARCH_08: "emotional",
  ARCH_09: "emotional",
  ARCH_10: "neutral",
  ARCH_11: "emotional",
  ARCH_12: "logical",
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPE_GROUP) as ArchetypeId[];
