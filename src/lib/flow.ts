import { DILEMMAS } from "@/data/questions";
import {
  buildStage2Items,
  computeResult,
  resolveTop,
  tallyVotes,
  type Choice,
} from "./scoring";
import type { ArchetypeId, Likert, Stage2Item, TestResult, TieBreak } from "./types";

export type Phase = "intro" | "stage1" | "tiebreak" | "stage2intro" | "stage2" | "results";

export interface FlowState {
  phase: Phase;
  /** Индекс текущего вопроса внутри этапа. */
  index: number;
  choices: Choice[];
  tiePicks: ArchetypeId[];
  tie: TieBreak | null;
  top: ArchetypeId[];
  items: Stage2Item[];
  answers: Record<string, Likert>;
  /** Время ответа на вопросы Этапа 2 (мс) — для проверки качества ответов. */
  times: Record<string, number>;
  result: TestResult | null;
}

export type FlowAction =
  | { type: "start" }
  | { type: "choose"; choice: Choice }
  | { type: "pickTie"; id: ArchetypeId }
  | { type: "beginStage2" }
  | { type: "answer"; value: Likert; ms: number }
  | { type: "back" }
  | { type: "restart" };

export const initialFlow: FlowState = {
  phase: "intro",
  index: 0,
  choices: [],
  tiePicks: [],
  tie: null,
  top: [],
  items: [],
  answers: {},
  times: {},
  result: null,
};

/** После Этапа 1 (и после каждого tie-break) — либо ещё один динамический вопрос, либо Этап 2. */
function afterStage1(state: FlowState, tiePicks: ArchetypeId[]): FlowState {
  const resolution = resolveTop(tallyVotes(state.choices), tiePicks);
  if (resolution.status === "tie") {
    return { ...state, tiePicks, phase: "tiebreak", tie: resolution.tie };
  }
  return {
    ...state,
    tiePicks,
    tie: null,
    phase: "stage2intro",
    top: resolution.top,
    items: buildStage2Items(resolution.top),
    index: 0,
    answers: {},
    times: {},
  };
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "start":
      return { ...initialFlow, phase: "stage1" };

    case "choose": {
      if (state.phase !== "stage1") return state;
      const choices = [...state.choices.slice(0, state.index), action.choice];
      const next = { ...state, choices };
      if (state.index + 1 < DILEMMAS.length) return { ...next, index: state.index + 1 };
      return afterStage1(next, []);
    }

    case "pickTie":
      if (state.phase !== "tiebreak") return state;
      return afterStage1(state, [...state.tiePicks, action.id]);

    case "beginStage2":
      return state.phase === "stage2intro" ? { ...state, phase: "stage2", index: 0 } : state;

    case "answer": {
      if (state.phase !== "stage2") return state;
      const item = state.items[state.index];
      const answers = { ...state.answers, [item.id]: action.value };
      const times = { ...state.times, [item.id]: action.ms };
      if (state.index + 1 < state.items.length) {
        return { ...state, answers, times, index: state.index + 1 };
      }
      return {
        ...state,
        answers,
        times,
        phase: "results",
        result: computeResult(tallyVotes(state.choices), state.top, answers, times),
      };
    }

    case "back":
      if ((state.phase === "stage1" || state.phase === "stage2") && state.index > 0) {
        return { ...state, index: state.index - 1 };
      }
      return state;

    case "restart":
      return initialFlow;
  }
}

/** Сколько утверждений во втором этапе: 15 про зрелость (по 5 на карту) и 3 контрольных. */
export const STAGE2_ITEMS = 18;
const SECONDS_PER_DILEMMA = 8;
const SECONDS_PER_STATEMENT = 6;

/** Доля первого этапа в общем пути (по времени): остальное занимает второй этап. */
const STAGE1_SHARE = (DILEMMAS.length * SECONDS_PER_DILEMMA) / (DILEMMAS.length * SECONDS_PER_DILEMMA + STAGE2_ITEMS * SECONDS_PER_STATEMENT);

/** Общий прогресс прохождения (0–100). */
export function overallProgress(state: FlowState): number {
  const s1 = STAGE1_SHARE * 100;
  switch (state.phase) {
    case "intro":
      return 0;
    case "stage1":
      return (state.index / DILEMMAS.length) * s1;
    case "tiebreak":
    case "stage2intro":
      return s1;
    case "stage2":
      return s1 + (state.index / state.items.length) * (100 - s1);
    case "results":
      return 100;
  }
}

/** Примерное оставшееся время в секундах. */
export function secondsLeft(state: FlowState): number {
  switch (state.phase) {
    case "stage1":
      return (DILEMMAS.length - state.index) * SECONDS_PER_DILEMMA + STAGE2_ITEMS * SECONDS_PER_STATEMENT;
    case "tiebreak":
    case "stage2intro":
      return STAGE2_ITEMS * SECONDS_PER_STATEMENT;
    case "stage2":
      return (state.items.length - state.index) * SECONDS_PER_STATEMENT;
    default:
      return 0;
  }
}

/** Промежуточный инсайт Этапа 1: лидирующий архетип после 12 и 24 ответов. */
export const INSIGHT_AT = [12, 24];

export function leaderSoFar(state: FlowState): ArchetypeId | null {
  const scores = tallyVotes(state.choices.slice(0, state.index));
  const [best, second] = (Object.entries(scores) as [ArchetypeId, number][]).sort((a, b) => b[1] - a[1]);
  return best[1] > second[1] ? best[0] : null;
}
