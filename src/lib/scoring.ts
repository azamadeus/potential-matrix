import { ARCHETYPES, ARCHETYPE_IDS } from "@/data/archetypes";
import { DILEMMAS, LIE_QUESTIONS, MATURITY_QUESTIONS } from "@/data/questions";
import type {
  ArchetypeId,
  ArchetypeResult,
  Likert,
  SelfEsteemType,
  Stage2Item,
  TestResult,
  TieBreak,
  Validity,
  Zone,
} from "./types";

export const TOP_N = 3;
export const DEFENSE_MI_CAP = 65;
export const DEFENSE_VALIDITY = 50;
export const STRAIGHT_LINING_PENALTY = 25;
export const RUSHED_PENALTY = 20;
/** Ответ быстрее этого порога (мс) считается «не прочитанным». */
export const RUSHED_MS = 1500;

export type Choice = "a" | "b";

/** Подсчёт голосов Этапа 1. */
export function tallyVotes(choices: Choice[]): Record<ArchetypeId, number> {
  const scores = Object.fromEntries(ARCHETYPE_IDS.map((id) => [id, 0])) as Record<
    ArchetypeId,
    number
  >;
  choices.forEach((choice, i) => {
    const dilemma = DILEMMAS[i];
    if (dilemma) scores[dilemma[choice].archetype] += 1;
  });
  return scores;
}

export type TopResolution =
  | { status: "resolved"; top: ArchetypeId[] }
  | { status: "tie"; tie: TieBreak };

/**
 * Определяет ТОП-3 по голосам. Если на границе отсечения есть ничья,
 * возвращает спорных кандидатов для динамического вопроса.
 * `tiePicks` — архетипы, выбранные в предыдущих tie-break вопросах (по порядку).
 */
export function resolveTop(
  scores: Record<ArchetypeId, number>,
  tiePicks: ArchetypeId[] = [],
): TopResolution {
  const pickRank = (id: ArchetypeId) => {
    const i = tiePicks.indexOf(id);
    return i === -1 ? Infinity : i;
  };
  const sorted = [...ARCHETYPE_IDS].sort(
    (x, y) =>
      scores[y] - scores[x] ||
      pickRank(x) - pickRank(y) ||
      ARCHETYPE_IDS.indexOf(x) - ARCHETYPE_IDS.indexOf(y),
  );

  const cutoff = scores[sorted[TOP_N - 1]];
  const above = sorted.filter((id) => scores[id] > cutoff);
  const boundary = sorted.filter((id) => scores[id] === cutoff);
  const slots = TOP_N - above.length;
  const picked = boundary.filter((id) => tiePicks.includes(id));
  const open = boundary.filter((id) => !tiePicks.includes(id));
  const openSlots = slots - picked.length;

  if (openSlots > 0 && open.length > openSlots) {
    return { status: "tie", tie: { candidates: open } };
  }
  return { status: "resolved", top: sorted.slice(0, TOP_N) };
}

/** MI = grounded·2 / ((shadow_1 + shadow_2) + grounded·2) · 100% */
export function maturityIndex(shadow1: number, shadow2: number, grounded: number): number {
  return ((grounded * 2) / (shadow1 + shadow2 + grounded * 2)) * 100;
}

export function zoneOf(mi: number): Zone {
  const v = Math.round(mi);
  if (v <= 35) return "red";
  if (v <= 70) return "yellow";
  return "green";
}

/**
 * Валидность: шкала лжи (по методике) + проверки качества ответов —
 * одинаковые ответы на все вопросы зрелости и ответы «не читая» (быстрее 1,5 с в половине вопросов).
 */
export function assessValidity(
  lieAnswers: Likert[],
  maturityAnswers: Likert[] = [],
  timesMs: number[] = [],
): Validity {
  const neverCount = lieAnswers.filter((a) => a === 1).length;
  const defenseFlag = neverCount >= 2;
  const straightLining =
    maturityAnswers.length > 1 && maturityAnswers.every((a) => a === maturityAnswers[0]);
  const rushed =
    timesMs.length > 0 && timesMs.filter((t) => t < RUSHED_MS).length >= timesMs.length / 2;

  let validityIndex = defenseFlag ? DEFENSE_VALIDITY : 100;
  if (straightLining) validityIndex -= STRAIGHT_LINING_PENALTY;
  if (rushed) validityIndex -= RUSHED_PENALTY;

  return { defenseFlag, neverCount, straightLining, rushed, validityIndex: Math.max(validityIndex, 10) };
}

export function classifySelfEsteem(
  top: Pick<ArchetypeResult, "id" | "votes">[],
  averageMI: number,
): SelfEsteemType {
  const avg = Math.round(averageMI);
  if (avg >= 71) return "grounded_unconditional";
  if (avg > 60) return "forming";

  // Доминирование группы — по сумме голосов Этапа 1 среди ТОП-3.
  let logical = 0;
  let emotional = 0;
  for (const { id, votes } of top) {
    const group = ARCHETYPES[id].group;
    if (group === "logical") logical += votes;
    if (group === "emotional") emotional += votes;
  }
  const neutral = top.reduce((s, t) => s + t.votes, 0) - logical - emotional;
  if (logical > emotional && logical > neutral) return "logical_conditional";
  if (emotional > logical && emotional > neutral) return "emotional_conditional";
  return "mixed_conditional";
}

/**
 * Этап 2: 9 вопросов зрелости для ТОП-3 + 3 скрытых контрольных вопроса.
 * Вопросы одного архетипа и контрольные вопросы перемешаны, чтобы не считывалась структура.
 */
export function buildStage2Items(top: ArchetypeId[]): Stage2Item[] {
  const q = (id: ArchetypeId, kind: "shadow_1" | "shadow_2" | "grounded"): Stage2Item => ({
    type: "maturity",
    question: MATURITY_QUESTIONS.find((m) => m.archetype === id && m.kind === kind)!,
  });
  const lie = (i: number): Stage2Item => ({ type: "lie", question: LIE_QUESTIONS[i] });
  const [a, b, c] = top;
  return [
    q(a, "shadow_1"),
    q(b, "grounded"),
    q(c, "shadow_1"),
    lie(0),
    q(a, "grounded"),
    q(b, "shadow_1"),
    q(c, "shadow_2"),
    lie(1),
    q(b, "shadow_2"),
    q(a, "shadow_2"),
    q(c, "grounded"),
    lie(2),
  ];
}

export function computeResult(
  scores: Record<ArchetypeId, number>,
  top: ArchetypeId[],
  answers: Record<string, Likert>,
  timesMs: Record<string, number> = {},
): TestResult {
  const maturityAnswers = top.flatMap((id) =>
    (["shadow_1", "shadow_2", "grounded"] as const).map((k) => answers[`${id}_${k}`]),
  );
  const validity = assessValidity(
    LIE_QUESTIONS.map((l) => answers[l.id]),
    maturityAnswers,
    Object.values(timesMs),
  );

  const results: ArchetypeResult[] = top.map((id, i) => {
    const s1 = answers[`${id}_shadow_1`];
    const s2 = answers[`${id}_shadow_2`];
    const g = answers[`${id}_grounded`];
    const rawMI = maturityIndex(s1, s2, g);
    const capped = validity.defenseFlag && rawMI > DEFENSE_MI_CAP;
    const mi = capped ? DEFENSE_MI_CAP : rawMI;
    return {
      id,
      rank: i + 1,
      votes: scores[id],
      answers: { shadow_1: s1, shadow_2: s2, grounded: g },
      rawMI,
      mi,
      zone: zoneOf(mi),
      capped,
    };
  });

  const averageMI = results.reduce((s, r) => s + r.mi, 0) / results.length;

  return {
    scores,
    top: results,
    validity,
    averageMI,
    selfEsteem: classifySelfEsteem(results, averageMI),
    completedAt: new Date().toISOString(),
  };
}
