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

export interface Archetype {
  id: ArchetypeId;
  name: string;
  /** Короткая подпись для оси диаграммы. */
  short: string;
  /** Исходные темы Gallup CliftonStrengths, из которых собран архетип. */
  themes: string[];
  group: ArchetypeGroup;
  tagline: string;
  /** Дар архетипа в зрелом состоянии. */
  essence: string;
  /** Название теневой (гиперкомпенсаторной) стратегии. */
  shadowPattern: string;
  blindSpot: string;
  hiddenRisk: string;
  /** Утверждение для динамического вопроса при ничьей. */
  tieStatement: string;
  /** Диагноз текущего состояния по зонам зрелости. */
  diagnosis: Record<Zone, string>;
  /** 2 шага трансформации: repair — для красной/жёлтой зоны, growth — для зелёной. */
  protocol: { repair: [string, string]; growth: [string, string] };
}

export interface DilemmaOption {
  archetype: ArchetypeId;
  text: string;
}

export interface Dilemma {
  id: number;
  a: DilemmaOption;
  b: DilemmaOption;
}

export type MaturityKind = "shadow_1" | "shadow_2" | "grounded";

export interface MaturityQuestion {
  id: string;
  archetype: ArchetypeId;
  kind: MaturityKind;
  text: string;
}

export interface LieQuestion {
  id: "L1" | "L2" | "L3";
  text: string;
}

/** Ответ 1–5 по шкале Ликерта. */
export type Likert = 1 | 2 | 3 | 4 | 5;

export type Stage2Item =
  | { type: "maturity"; question: MaturityQuestion }
  | { type: "lie"; question: LieQuestion };

export interface TieBreak {
  /** Спорные архетипы, между которыми нужно выбрать. */
  candidates: ArchetypeId[];
}

export interface ArchetypeResult {
  id: ArchetypeId;
  rank: number;
  votes: number;
  answers: { shadow_1: Likert; shadow_2: Likert; grounded: Likert };
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
