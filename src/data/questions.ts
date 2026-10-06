import type { DilemmaPair, LieId } from "@/lib/types";

/** Этап 1: 20 попарных дилемм. Тексты вариантов лежат в src/i18n (поле dilemmas, тот же порядок). */
export const DILEMMAS: DilemmaPair[] = [
  { id: 1, a: "ARCH_01", b: "ARCH_02" },
  { id: 2, a: "ARCH_04", b: "ARCH_03" },
  { id: 3, a: "ARCH_01", b: "ARCH_03" },
  { id: 4, a: "ARCH_02", b: "ARCH_08" },
  { id: 5, a: "ARCH_06", b: "ARCH_05" },
  { id: 6, a: "ARCH_04", b: "ARCH_06" },
  { id: 7, a: "ARCH_05", b: "ARCH_12" },
  { id: 8, a: "ARCH_04", b: "ARCH_10" },
  { id: 9, a: "ARCH_07", b: "ARCH_09" },
  { id: 10, a: "ARCH_08", b: "ARCH_09" },
  { id: 11, a: "ARCH_07", b: "ARCH_12" },
  { id: 12, a: "ARCH_08", b: "ARCH_10" },
  { id: 13, a: "ARCH_10", b: "ARCH_11" },
  { id: 14, a: "ARCH_11", b: "ARCH_12" },
  { id: 15, a: "ARCH_11", b: "ARCH_09" },
  { id: 16, a: "ARCH_12", b: "ARCH_01" },
  { id: 17, a: "ARCH_10", b: "ARCH_05" },
  { id: 18, a: "ARCH_07", b: "ARCH_03" },
  { id: 19, a: "ARCH_02", b: "ARCH_06" },
  { id: 20, a: "ARCH_12", b: "ARCH_01" },
];

/** Контрольные вопросы искренности (шкала социальной желательности). */
export const LIE_IDS: LieId[] = ["L1", "L2", "L3"];
