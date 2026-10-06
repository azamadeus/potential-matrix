export type ArchetypeId =
  | "ARCH_01"
  | "ARCH_02"
  | "ARCH_03"
  | "ARCH_04"
  | "ARCH_05"
  | "ARCH_06"
  | "ARCH_07"
  | "ARCH_08"
  | "ARCH_09"
  | "ARCH_10"
  | "ARCH_11"
  | "ARCH_12";

export type Zone = "red" | "yellow" | "green";

/** Группа архетипа для определения типа самооценки. */
export type ArchetypeGroup = "logical" | "emotional" | "neutral";

export interface DilemmaPair {
  id: number;
  /** Архетип варианта «А». */
  a: ArchetypeId;
  /** Архетип варианта «Б». */
  b: ArchetypeId;
}

/** Пять утверждений зрелости на карту: три теневых и два опорных. */
export type MaturityKind = "shadow_1" | "shadow_2" | "shadow_3" | "grounded" | "grounded_2";

export const SHADOW_KINDS: MaturityKind[] = ["shadow_1", "shadow_2", "shadow_3"];
export const GROUNDED_KINDS: MaturityKind[] = ["grounded", "grounded_2"];
export const MATURITY_KINDS: MaturityKind[] = [...SHADOW_KINDS, ...GROUNDED_KINDS];

export type LieId = "L1" | "L2" | "L3";

/** Ответ 1–5 по шкале частоты. */
export type Likert = 1 | 2 | 3 | 4 | 5;

/** Вопрос Этапа 2. Тексты берутся из языкового файла по id. */
export type Stage2Item =
  | { type: "maturity"; id: string; archetype: ArchetypeId; kind: MaturityKind }
  | { type: "lie"; id: LieId; index: 0 | 1 | 2 };

export interface TieBreak {
  /** Спорные архетипы, между которыми нужно выбрать. */
  candidates: ArchetypeId[];
}

export interface ArchetypeResult {
  id: ArchetypeId;
  rank: number;
  votes: number;
  answers: Record<MaturityKind, Likert>;
  /** Среднее по теневым утверждениям (1–5). */
  shadowAvg: number;
  /** Среднее по опорным утверждениям (1–5). */
  groundedAvg: number;
  /** MI до применения потолка защиты эго. */
  rawMI: number;
  /** Итоговый MI (с учётом потолка при defense_flag). */
  mi: number;
  zone: Zone;
  capped: boolean;
}

export type SelfEsteemType =
  | "grounded_unconditional"
  | "forming"
  | "logical_conditional"
  | "emotional_conditional"
  | "mixed_conditional";

export interface Validity {
  defenseFlag: boolean;
  /** Количество ответов «Никогда» на контрольные вопросы. */
  neverCount: number;
  /** Все ответы на вопросы зрелости одинаковые. */
  straightLining: boolean;
  /** Слишком много ответов быстрее, чем можно прочитать утверждение. */
  rushed: boolean;
  validityIndex: number;
}

export interface TestResult {
  scores: Record<ArchetypeId, number>;
  top: ArchetypeResult[];
  validity: Validity;
  averageMI: number;
  selfEsteem: SelfEsteemType;
  completedAt: string;
}
