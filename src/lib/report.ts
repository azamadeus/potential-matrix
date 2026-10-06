import type { Content } from "@/i18n/types";
import type { ArchetypeId, ArchetypeResult, TestResult } from "./types";

export const formatPercent = (v: number) => `${Math.round(v)}%`;

/** Шаги протокола: для красной/жёлтой зоны восстановление, для зелёной рост. */
export function protocolSteps(c: Content, r: ArchetypeResult): [string, string] {
  const a = c.archetypes[r.id];
  return r.zone === "green" ? a.protocol.growth : a.protocol.repair;
}

/** Порядок работы: сначала архетип с самым низким MI. */
export function protocolOrder(result: TestResult): ArchetypeResult[] {
  return [...result.top].sort((x, y) => x.mi - y.mi);
}

export function buildTextReport(c: Content, result: TestResult): string {
  const t = c.ui.report;
  const se = c.selfEsteem[result.selfEsteem];
  const date = c.ui.formatDate(new Date(result.completedAt));
  const lines: string[] = [
    t.title,
    `${t.date}: ${date}`,
    "",
    `${t.selfEsteem}: ${se.title}`,
    se.formula,
    se.description,
    `${t.growTo}: ${se.vector}`,
    "",
    `${t.avgMaturity}: ${formatPercent(result.averageMI)}`,
    `${t.validity}: ${result.validity.validityIndex}%`,
  ];

  if (result.validity.defenseFlag) lines.push(t.defense);
  if (result.validity.straightLining) lines.push(t.straight);
  if (result.validity.rushed) lines.push(t.rushed);

  lines.push("", t.top);
  for (const r of result.top) {
    const a = c.archetypes[r.id];
    const zone = c.zones[r.zone];
    lines.push(
      "",
      `${r.rank}. ${a.name} (${a.traits.join(", ")})`,
      `   ${t.votes}: ${r.votes}`,
      `   ${t.maturity}: ${formatPercent(r.mi)}, ${zone.label} (${zone.short})${r.capped ? ` [${t.cappedNote}]` : ""}`,
      `   ${t.essence}: ${a.essence}`,
      `   ${t.diagnosis}: ${a.diagnosis[r.zone]}`,
      `   ${t.shadow}: ${a.shadowPattern}`,
      `   ${t.blindSpot}: ${a.blindSpot}`,
      `   ${t.hiddenRisk}: ${a.hiddenRisk}`,
      `   ${t.needs}: ${a.needs.join(" ")}`,
      `   ${t.drains}: ${a.drains.join(" ")}`,
      `   ${t.roots}: ${a.roots.join(" ")}`,
    );
  }

  lines.push("", t.levelUp);
  protocolOrder(result).forEach((r) => {
    const a = c.archetypes[r.id];
    const [s1, s2] = protocolSteps(c, r);
    lines.push("", `${a.name}:`, `   ${t.step(1)}. ${s1}`, `   ${t.step(2)}. ${s2}`, `   ${t.tools}:`);
    a.tools.forEach((tool) => lines.push(`   · ${tool.name}: ${tool.how}`));
  });

  lines.push(
    "",
    `${t.profile}:`,
    ...(Object.entries(result.scores) as [ArchetypeId, number][])
      .sort((x, y) => y[1] - x[1])
      .map(([id, v]) => `   ${c.archetypes[id].name}: ${v}`),
    "",
    t.disclaimer,
  );

  return lines.join("\n");
}
