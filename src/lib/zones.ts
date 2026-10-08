import type { SelfEsteemType, Zone } from "./types";

/** Tailwind-класс заливки цветом зоны зрелости. */
export const ZONE_FILL: Record<Zone, string> = { red: "bg-zone-red", yellow: "bg-zone-yellow", green: "bg-zone-green" };

/** Уровень зрелости на шкале из трёх. */
export const ZONE_LEVEL: Record<Zone, number> = { red: 1, yellow: 2, green: 3 };

/** Цвет бейджа типа самооценки. */
export const SELF_ESTEEM_TONE: Record<SelfEsteemType, Zone> = {
  grounded_unconditional: "green",
  forming: "yellow",
  logical_conditional: "red",
  emotional_conditional: "red",
  mixed_conditional: "red",
};
