import { ARCHETYPE_GROUP, ARCHETYPE_IDS } from "@/data/archetypes";
import { DILEMMAS, LIE_IDS } from "@/data/questions";
import { GROUNDED_KINDS, MATURITY_KINDS, SHADOW_KINDS } from "./types";
import type {
  ArchetypeId,
  ArchetypeResult,
  Likert,
  MaturityKind,
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
    if (dilemma) scores[dilemma[choice]] += 1;
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

export const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

/**
 * Индекс зрелости: MI = grounded·2 / ((shadow_1 + shadow_2) + grounded·2) · 100%.
 * Для нескольких утверждений вместо суммы берутся средние: MI = ḡ / (s̄ + ḡ) · 100%.
 * Для набора «два теневых, одно опорное» это ровно исходная формула.
 */
export function maturityIndex(shadow: number[], grounded: number[]): number {
  const s = mean(shadow);
  const g = mean(grounded);
  return (g / (s + g)) * 100;
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
    const group = ARCHETYPE_GROUP[id];
    if (group === "logical") logical += votes;
    if (group === "emotional") emotional += votes;
  }
  const neutral = top.reduce((s, t) => s + t.votes, 0) - logical - emotional;
  if (logical > emotional && logical > neutral) return "logical_conditional";
  if (emotional > logical && emotional > neutral) return "emotional_conditional";
  return "mixed_conditional";
}

/**
 * Этап 2: 15 утверждений зрелости (по 5 на каждую из ТОП-3) + 3 скрытых контрольных вопроса.
 * Утверждения одной карты не идут подряд, а контрольные вопросы стоят среди остальных,
 * чтобы не считывалась структура.
 */
export function buildStage2Items(top: ArchetypeId[]): Stage2Item[] {
  const q = (id: ArchetypeId, kind: MaturityKind): Stage2Item => ({
    type: "maturity",
    id: `${id}_${kind}`,
    archetype: id,
    kind,
  });
  const lie = (i: 0 | 1 | 2): Stage2Item => ({ type: "lie", id: LIE_IDS[i], index: i });
  const [a, b, c] = top;
  return [
    q(a, "shadow_1"),
    q(b, "grounded"),
    q(c, "shadow_1"),
    q(a, "shadow_2"),
    q(b, "shadow_1"),
    lie(0),
    q(c, "grounded"),
    q(a, "shadow_3"),
    q(b, "shadow_2"),
    q(c, "shadow_2"),
    q(a, "grounded"),
    lie(1),
    q(b, "shadow_3"),
    q(c, "shadow_3"),
    q(a, "grounded_2"),
    lie(2),
    q(b, "grounded_2"),
    q(c, "grounded_2"),
  ];
}

export function computeResult(
  scores: Record<ArchetypeId, number>,
  top: ArchetypeId[],
  answers: Record<string, Likert>,
  timesMs: Record<string, number> = {},
): TestResult {
  const maturityAnswers = top.flatMap((id) => MATURITY_KINDS.map((k) => answers[`${id}_${k}`]));
  const validity = assessValidity(
    LIE_IDS.map((l) => answers[l]),
    maturityAnswers,
    Object.values(timesMs),
  );

  const results: ArchetypeResult[] = top.map((id, i) => {
    const own = Object.fromEntries(MATURITY_KINDS.map((k) => [k, answers[`${id}_${k}`]])) as Record<MaturityKind, Likert>;
    const shadowAvg = mean(SHADOW_KINDS.map((k) => own[k]));
    const groundedAvg = mean(GROUNDED_KINDS.map((k) => own[k]));
    const rawMI = maturityIndex(
      SHADOW_KINDS.map((k) => own[k]),
      GROUNDED_KINDS.map((k) => own[k]),
    );
    const capped = validity.defenseFlag && rawMI > DEFENSE_MI_CAP;
    const mi = capped ? DEFENSE_MI_CAP : rawMI;
    return {
      id,
      rank: i + 1,
      votes: scores[id],
      answers: own,
      shadowAvg,
      groundedAvg,
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
