import { describe, expect, it } from "vitest";
import { ARCHETYPE_IDS } from "@/data/archetypes";
import { DILEMMAS } from "@/data/questions";
import { kk } from "./kk";
import { ru } from "./ru";
import type { Content } from "./types";

const LANGS: [string, Content][] = [
  ["ru", ru],
  ["kk", kk],
];

/** Все строки контента, включая вложенные. Функции вызываются с тестовыми аргументами. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") {
    const fn = value as (...a: unknown[]) => unknown;
    // formatDate ждёт дату, остальные функции число и строку.
    return strings(fn.length === 1 && fn.toString().includes("getDate") ? fn(new Date(2026, 9, 6)) : fn(7, "X"));
  }
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe.each(LANGS)("content %s", (_, c) => {
  it("covers every dilemma, archetype and marker", () => {
    expect(c.dilemmas).toHaveLength(DILEMMAS.length);
    for (const id of ARCHETYPE_IDS) {
      const a = c.archetypes[id];
      expect(a.traits.length).toBeGreaterThanOrEqual(3);
      expect(a.needs).toHaveLength(2);
      expect(a.drains).toHaveLength(2);
      expect(a.roots).toHaveLength(3);
      expect(a.tools).toHaveLength(3);
      expect(Object.keys(c.markers[id]).sort()).toEqual(["grounded", "grounded_2", "shadow_1", "shadow_2", "shadow_3"]);
      const x = c.extras[id];
      expect(x.superpowers).toHaveLength(3);
      expect(Object.keys(x.spheres).sort()).toEqual(["family", "friends", "self", "work"]);
      expect(x.books).toHaveLength(3);
      expect(x.plan).toHaveLength(4);
    }
    expect(c.ui.scale).toHaveLength(5);
  });

  it("formats dates in its own language", () => {
    const d = c.ui.formatDate(new Date(2026, 9, 6));
    expect(d).toContain("2026");
    expect(d).toMatch(c === kk ? /қазан/ : /октября/);
  });

  it("has no empty strings", () => {
    expect(strings(c).filter((s) => s.trim() === "")).toEqual([]);
  });

  it("never mentions Gallup or its theme names", () => {
    const banned = /gallup|clifton|strengthsfinder|achiever|maximizer|woo\b|intellection|ideation|includer|relator/i;
    expect(strings(c).filter((s) => banned.test(s))).toEqual([]);
  });

  it("uses no em dashes", () => {
    expect(strings(c).filter((s) => s.includes("—"))).toEqual([]);
  });
});

it("intro and landing mention the real number of questions", () => {
  for (const c of [ru, kk]) {
    expect(c.ui.introSteps[0][0]).toContain(String(DILEMMAS.length));
    expect(c.ui.introSteps[0][1]).toContain("21");
    expect(c.ui.introSteps[1][0]).toContain("18");
    expect(c.landing.hero.lead).toContain(String(DILEMMAS.length));
  }
});

it("Kazakh differs from Russian everywhere it should", () => {
  const same = ARCHETYPE_IDS.filter((id) => kk.archetypes[id].essence === ru.archetypes[id].essence);
  expect(same).toEqual([]);
});
