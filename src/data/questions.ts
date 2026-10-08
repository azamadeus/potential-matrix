import type { DilemmaPair, LieId } from "@/lib/types";

/** Этап 1: 36 попарных дилемм (каждая карта встречается ровно 6 раз). Тексты вариантов лежат в src/i18n (поле dilemmas, тот же порядок). */
export const DILEMMAS: DilemmaPair[] = [
  { id: 1, a: "ARCH_01", b: "ARCH_02" },
  { id: 2, a: "ARCH_04", b: "ARCH_03" },
  { id: 3, a: "ARCH_07", b: "ARCH_02" },
  { id: 4, a: "ARCH_01", b: "ARCH_03" },
  { id: 5, a: "ARCH_02", b: "ARCH_04" },
  { id: 6, a: "ARCH_06", b: "ARCH_05" },
  { id: 7, a: "ARCH_02", b: "ARCH_08" },
  { id: 8, a: "ARCH_05", b: "ARCH_03" },
  { id: 9, a: "ARCH_02", b: "ARCH_11" },
  { id: 10, a: "ARCH_04", b: "ARCH_06" },
  { id: 11, a: "ARCH_03", b: "ARCH_08" },
  { id: 12, a: "ARCH_05", b: "ARCH_12" },
  { id: 13, a: "ARCH_09", b: "ARCH_03" },
  { id: 14, a: "ARCH_04", b: "ARCH_10" },
  { id: 15, a: "ARCH_07", b: "ARCH_09" },
  { id: 16, a: "ARCH_11", b: "ARCH_04" },
  { id: 17, a: "ARCH_08", b: "ARCH_09" },
  { id: 18, a: "ARCH_07", b: "ARCH_12" },
  { id: 19, a: "ARCH_04", b: "ARCH_09" },
  { id: 20, a: "ARCH_07", b: "ARCH_05" },
  { id: 21, a: "ARCH_08", b: "ARCH_10" },
  { id: 22, a: "ARCH_11", b: "ARCH_12" },
  { id: 23, a: "ARCH_08", b: "ARCH_05" },
  { id: 24, a: "ARCH_10", b: "ARCH_11" },
  { id: 25, a: "ARCH_06", b: "ARCH_07" },
  { id: 26, a: "ARCH_11", b: "ARCH_09" },
  { id: 27, a: "ARCH_10", b: "ARCH_06" },
  { id: 28, a: "ARCH_12", b: "ARCH_01" },
  { id: 29, a: "ARCH_10", b: "ARCH_05" },
  { id: 30, a: "ARCH_06", b: "ARCH_12" },
  { id: 31, a: "ARCH_01", b: "ARCH_08" },
  { id: 32, a: "ARCH_07", b: "ARCH_03" },
  { id: 33, a: "ARCH_02", b: "ARCH_06" },
  { id: 34, a: "ARCH_11", b: "ARCH_01" },
  { id: 35, a: "ARCH_10", b: "ARCH_09" },
  { id: 36, a: "ARCH_12", b: "ARCH_01" },
];

/** Контрольные вопросы искренности (шкала социальной желательности). */
export const LIE_IDS: LieId[] = ["L1", "L2", "L3"];
