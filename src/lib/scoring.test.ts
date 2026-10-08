import { describe, expect, it } from "vitest";
import { DILEMMAS } from "@/data/questions";
import {
  assessValidity,
  buildStage2Items,
  classifySelfEsteem,
  computeResult,
  maturityIndex,
  resolveTop,
  tallyVotes,
  zoneOf,
  type Choice,
} from "./scoring";
import type { ArchetypeId, Likert } from "./types";

const ZERO = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [`ARCH_${String(i + 1).padStart(2, "0")}`, 0]),
) as Record<ArchetypeId, number>;

describe("tallyVotes", () => {
  it("distributes one vote per dilemma", () => {
    const scores = tallyVotes(DILEMMAS.map(() => "a"));
    expect(Object.values(scores).reduce((s, v) => s + v, 0)).toBe(DILEMMAS.length);
  });

  it("gives a card at most six votes, because it appears six times", () => {
    // Всегда выбираем ARCH_12, когда он есть, и первый вариант в остальных вопросах.
    const choices: Choice[] = DILEMMAS.map((d) => (d.b === "ARCH_12" ? "b" : "a"));
    expect(tallyVotes(choices).ARCH_12).toBe(6);
  });
});

describe("resolveTop", () => {
  it("returns top-3 without tie", () => {
    const scores = { ...ZERO, ARCH_01: 5, ARCH_02: 4, ARCH_03: 3, ARCH_04: 2 };
    expect(resolveTop(scores)).toEqual({ status: "resolved", top: ["ARCH_01", "ARCH_02", "ARCH_03"] });
  });

  it("asks a tie-break question at the cutoff and resolves after the pick", () => {
    const scores = { ...ZERO, ARCH_01: 5, ARCH_02: 4, ARCH_05: 3, ARCH_09: 3 };
    const first = resolveTop(scores);
    expect(first).toEqual({ status: "tie", tie: { candidates: ["ARCH_05", "ARCH_09"] } });
    expect(resolveTop(scores, ["ARCH_09"])).toEqual({
      status: "resolved",
      top: ["ARCH_01", "ARCH_02", "ARCH_09"],
    });
  });

  it("needs several picks when the tie spans multiple slots", () => {
    const scores = { ...ZERO, ARCH_01: 5, ARCH_02: 2, ARCH_03: 2, ARCH_04: 2 };
    const r1 = resolveTop(scores);
    expect(r1.status === "tie" && r1.tie.candidates).toEqual(["ARCH_02", "ARCH_03", "ARCH_04"]);
    const r2 = resolveTop(scores, ["ARCH_04"]);
    expect(r2.status === "tie" && r2.tie.candidates).toEqual(["ARCH_02", "ARCH_03"]);
    expect(resolveTop(scores, ["ARCH_04", "ARCH_03"])).toEqual({
      status: "resolved",
      top: ["ARCH_01", "ARCH_04", "ARCH_03"],
    });
  });

  it("does not ask when ties are inside the top-3", () => {
    const scores = { ...ZERO, ARCH_01: 4, ARCH_02: 4, ARCH_03: 4, ARCH_04: 3 };
    expect(resolveTop(scores).status).toBe("resolved");
  });
});

describe("maturity index", () => {
  it("follows the formula", () => {
    // Исходная формула: grounded·2 / ((shadow_1 + shadow_2) + grounded·2) · 100%.
    expect(maturityIndex([1, 1], [5])).toBeCloseTo((10 / 12) * 100);
    expect(maturityIndex([5, 5], [1])).toBeCloseTo((2 / 12) * 100);
    expect(maturityIndex([3, 3], [3])).toBeCloseTo(50);
  });

  it("uses averages when a card has several shadow and grounded statements", () => {
    // 3 теневых и 2 опорных: ḡ / (s̄ + ḡ)
    expect(maturityIndex([2, 2, 2], [4, 4])).toBeCloseTo((4 / 6) * 100);
    expect(maturityIndex([1, 3, 5], [3, 3])).toBeCloseTo(50);
    // Порядок и распределение внутри группы не важны, важны только средние.
    expect(maturityIndex([1, 5, 3], [2, 4])).toBeCloseTo(maturityIndex([3, 3, 3], [3, 3]));
  });

  it("maps zones on boundaries", () => {
    expect(zoneOf(35)).toBe("red");
    expect(zoneOf(36)).toBe("yellow");
    expect(zoneOf(70)).toBe("yellow");
    expect(zoneOf(71)).toBe("green");
  });
});

describe("validity", () => {
  it("flags defense with 2+ 'never' answers", () => {
    expect(assessValidity([1, 1, 3]).defenseFlag).toBe(true);
    expect(assessValidity([1, 1, 3]).validityIndex).toBe(50);
    expect(assessValidity([1, 2, 3]).defenseFlag).toBe(false);
  });

  it("penalizes identical maturity answers and rushing", () => {
    const v = assessValidity([3, 3, 3], Array(15).fill(4), Array(18).fill(800));
    expect(v.straightLining).toBe(true);
    expect(v.rushed).toBe(true);
    expect(v.validityIndex).toBe(55);
    const ok = assessValidity([2, 3, 2], [2, 4, 3, 1, 5, 2, 3, 3, 4, 1, 2, 5, 3, 4, 2], Array(18).fill(4000));
    expect(ok).toMatchObject({ straightLining: false, rushed: false, validityIndex: 100 });
  });

  it("caps MI at 65% when defense flag is raised", () => {
    const top: ArchetypeId[] = ["ARCH_01", "ARCH_02", "ARCH_04"];
    const answers: Record<string, Likert> = { L1: 1, L2: 1, L3: 1 };
    for (const id of top) {
      Object.assign(answers, {
        [`${id}_shadow_1`]: 1,
        [`${id}_shadow_2`]: 1,
        [`${id}_shadow_3`]: 1,
        [`${id}_grounded`]: 5,
        [`${id}_grounded_2`]: 5,
      });
    }
    const r = computeResult({ ...ZERO, ARCH_01: 5, ARCH_02: 4, ARCH_04: 3 }, top, answers);
    expect(r.top.every((t) => t.mi === 65 && t.capped)).toBe(true);
    expect(r.selfEsteem).toBe("forming");
  });
});

describe("self-esteem", () => {
  it("classifies by MI and group dominance", () => {
    const logical = [
      { id: "ARCH_01" as const, votes: 4 },
      { id: "ARCH_12" as const, votes: 4 },
      { id: "ARCH_07" as const, votes: 3 },
    ];
    expect(classifySelfEsteem(logical, 80)).toBe("grounded_unconditional");
    expect(classifySelfEsteem(logical, 65)).toBe("forming");
    expect(classifySelfEsteem(logical, 50)).toBe("logical_conditional");
    const emotional = [
      { id: "ARCH_07" as const, votes: 3 },
      { id: "ARCH_11" as const, votes: 3 },
      { id: "ARCH_03" as const, votes: 3 },
    ];
    expect(classifySelfEsteem(emotional, 40)).toBe("emotional_conditional");
    const neutral = [
      { id: "ARCH_03" as const, votes: 3 },
      { id: "ARCH_10" as const, votes: 3 },
      { id: "ARCH_01" as const, votes: 3 },
    ];
    expect(classifySelfEsteem(neutral, 40)).toBe("mixed_conditional");
  });
});

describe("stage 2", () => {
  it("contains 15 maturity + 3 lie items covering every marker", () => {
    const items = buildStage2Items(["ARCH_01", "ARCH_06", "ARCH_11"]);
    expect(items).toHaveLength(18);
    expect(items.filter((i) => i.type === "lie")).toHaveLength(3);
    expect(items.filter((i) => i.type === "maturity")).toHaveLength(15);
    expect(new Set(items.map((i) => i.id)).size).toBe(18);
    for (const id of ["ARCH_01", "ARCH_06", "ARCH_11"]) {
      const kinds = items.filter((i) => i.type === "maturity" && i.archetype === id).map((i) => i.type === "maturity" && i.kind);
      expect(kinds.sort()).toEqual(["grounded", "grounded_2", "shadow_1", "shadow_2", "shadow_3"]);
    }
  });

  it("never asks two statements of the same card in a row", () => {
    const items = buildStage2Items(["ARCH_03", "ARCH_05", "ARCH_09"]);
    for (let i = 1; i < items.length; i++) {
      const a = items[i - 1];
      const b = items[i];
      if (a.type === "maturity" && b.type === "maturity") expect(a.archetype).not.toBe(b.archetype);
    }
  });
});

describe("dilemmas", () => {
  it("has 36 pairs and shows every card exactly six times", () => {
    expect(DILEMMAS).toHaveLength(36);
    const counts = new Map<string, number>();
    for (const d of DILEMMAS) for (const id of [d.a, d.b]) counts.set(id, (counts.get(id) ?? 0) + 1);
    expect(counts.size).toBe(12);
    expect([...counts.values()].every((n) => n === 6)).toBe(true);
  });

  it("never pairs a card with itself and does not repeat a card in neighbouring questions", () => {
    DILEMMAS.forEach((d, i) => {
      expect(d.a).not.toBe(d.b);
      const next = DILEMMAS[i + 1];
      if (next) expect([d.a, d.b].some((id) => id === next.a || id === next.b)).toBe(false);
    });
  });

  it("computes a full result from five statements per card", () => {
    const top: ArchetypeId[] = ["ARCH_01", "ARCH_02", "ARCH_03"];
    const answers: Record<string, Likert> = { L1: 3, L2: 3, L3: 2 };
    for (const id of top) {
      Object.assign(answers, { [`${id}_shadow_1`]: 2, [`${id}_shadow_2`]: 4, [`${id}_shadow_3`]: 3, [`${id}_grounded`]: 4, [`${id}_grounded_2`]: 5 });
    }
    const r = computeResult({ ...ZERO, ARCH_01: 6, ARCH_02: 6, ARCH_03: 6 }, top, answers);
    expect(r.top[0].shadowAvg).toBe(3);
    expect(r.top[0].groundedAvg).toBe(4.5);
    expect(r.top[0].mi).toBeCloseTo((4.5 / 7.5) * 100);
  });
});
