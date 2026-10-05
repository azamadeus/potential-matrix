import { ARCHETYPES } from "@/data/archetypes";
import { SELF_ESTEEM, ZONE_META } from "@/data/selfEsteem";
import type { ArchetypeResult, TestResult } from "./types";

export const formatPercent = (v: number) => `${Math.round(v)}%`;

/** Шаги протокола: для красной/жёлтой зоны — восстановление, для зелёной — рост. */
export function protocolSteps(r: ArchetypeResult): [string, string] {
  const a = ARCHETYPES[r.id];
  return r.zone === "green" ? a.protocol.growth : a.protocol.repair;
}

/** Порядок работы: сначала архетип с самым низким MI. */
export function protocolOrder(result: TestResult): ArchetypeResult[] {
  return [...result.top].sort((x, y) => x.mi - y.mi);
}

export function buildTextReport(result: TestResult): string {
  const se = SELF_ESTEEM[result.selfEsteem];
  const date = new Date(result.completedAt).toLocaleDateString("ru-RU");
  const lines: string[] = [
    "ПАСПОРТ ПОТЕНЦИАЛА И ЗРЕЛОСТИ",
    `Дата прохождения: ${date}`,
    "",
    `ТИП САМООЦЕНКИ: ${se.title}`,
    se.formula,
    se.description,
    `Куда расти: ${se.vector}`,
    "",
    `Средний индекс зрелости: ${formatPercent(result.averageMI)}`,
    `Индекс валидности: ${result.validity.validityIndex}%`,
  ];

  if (result.validity.defenseFlag) {
    lines.push(
      "⚠ Обнаружена защита эго: ответы на контрольные вопросы указывают на стремление выглядеть социально желательно. MI ограничен потолком 65%.",
    );
  }
  if (result.validity.straightLining) {
    lines.push("⚠ На все утверждения о зрелости дан одинаковый ответ, поэтому индексы могут быть неточными.");
  }
  if (result.validity.rushed) {
    lines.push("⚠ Половина утверждений второго этапа отвечена слишком быстро. Результат стоит перепроверить.");
  }

  lines.push("", "ТОП-3 АРХЕТИПА");
  for (const r of result.top) {
    const a = ARCHETYPES[r.id];
    lines.push(
      "",
      `${r.rank}. ${a.name} (${a.themes.join(" + ")})`,
      `   Голосов в Этапе 1: ${r.votes}`,
      `   Индекс зрелости: ${formatPercent(r.mi)}, ${ZONE_META[r.zone].label.toLowerCase()} (${ZONE_META[r.zone].short})${r.capped ? " [потолок защиты]" : ""}`,
      `   Дар: ${a.essence}`,
      `   Диагноз: ${a.diagnosis[r.zone]}`,
      `   Теневая стратегия: ${a.shadowPattern}`,
      `   Слепая зона: ${a.blindSpot}`,
      `   Скрытые риски: ${a.hiddenRisk}`,
    );
  }

  lines.push("", "КАК ПРОКАЧАТЬ");
  protocolOrder(result).forEach((r) => {
    const [s1, s2] = protocolSteps(r);
    lines.push("", `${ARCHETYPES[r.id].name}:`, `   Шаг 1. ${s1}`, `   Шаг 2. ${s2}`);
  });

  lines.push(
    "",
    "Профиль голосов Этапа 1:",
    ...Object.entries(result.scores)
      .sort((x, y) => y[1] - x[1])
      .map(([id, v]) => `   ${ARCHETYPES[id as keyof typeof ARCHETYPES].name}: ${v}`),
    "",
    "Матрица Потенциала и Зрелости: авторская методика. Результат не является клиническим диагнозом.",
  );

  return lines.join("\n");
}
