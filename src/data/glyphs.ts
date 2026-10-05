import type { ArchetypeId } from "@/lib/types";

/**
 * Знак архетипа на «карте колоды»: фигуры в поле 48×48.
 * Хранится как данные, чтобы рисовать его и в SVG, и на canvas (картинка для сторис).
 */
export type GlyphShape =
  | { t: "path"; d: string; fill?: boolean }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: boolean }
  | { t: "rect"; x: number; y: number; w: number; h: number; fill?: boolean };

const grid: GlyphShape[] = [6, 19, 32].flatMap((y) =>
  [6, 19, 32].map((x) => ({ t: "rect" as const, x, y, w: 10, h: 10, fill: x === 19 && y === 19 })),
);

export const GLYPHS: Record<ArchetypeId, GlyphShape[]> = {
  ARCH_01: [
    { t: "path", d: "M5 40L18 22l8 9L42 9" },
    { t: "path", d: "M32 9h10v10" },
  ],
  ARCH_02: grid,
  ARCH_03: [
    { t: "path", d: "M24 4l16 6v12c0 11-7 18-16 22C15 40 8 33 8 22V10z" },
    { t: "path", d: "M17 24l5 5 9-10" },
  ],
  ARCH_04: [
    { t: "path", d: "M24 12C19 8 12 7 5 8v30c7-1 14 0 19 4 5-4 12-5 19-4V8c-7-1-14 0-19 4z" },
    { t: "path", d: "M24 12v30" },
  ],
  ARCH_05: [
    { t: "circle", cx: 24, cy: 24, r: 19 },
    { t: "path", d: "M24 9l5 15-5 15-5-15z" },
    { t: "circle", cx: 24, cy: 24, r: 2, fill: true },
  ],
  ARCH_06: [
    { t: "path", d: "M8 34a16 16 0 0132 0" },
    { t: "path", d: "M4 40h40M24 6v6M10 12l4 4M38 12l-4 4" },
  ],
  ARCH_07: [
    { t: "circle", cx: 18, cy: 24, r: 12 },
    { t: "circle", cx: 30, cy: 24, r: 12 },
    { t: "circle", cx: 24, cy: 24, r: 2.5, fill: true },
  ],
  ARCH_08: [
    { t: "circle", cx: 24, cy: 16, r: 10 },
    { t: "circle", cx: 16, cy: 30, r: 10 },
    { t: "circle", cx: 32, cy: 30, r: 10 },
  ],
  ARCH_09: [
    { t: "path", d: "M24 44V20" },
    { t: "path", d: "M24 28c-10 0-14-6-14-14 9 0 14 5 14 14zM24 22c0-9 5-15 14-15 0 9-5 15-14 15z" },
  ],
  ARCH_10: [{ t: "path", d: "M28 3L9 27h13l-3 18 20-25H26z" }],
  ARCH_11: [{ t: "path", d: "M24 3c2 12 9 19 21 21-12 2-19 9-21 21-2-12-9-19-21-21 12-2 19-9 21-21z" }],
  ARCH_12: [
    { t: "path", d: "M24 3l21 21-21 21L3 24z" },
    { t: "path", d: "M24 13l11 11-11 11-11-11z" },
  ],
};

/** Порядковый номер архетипа для угла карты («07»). */
export const cardNumber = (id: ArchetypeId) => id.slice(-2);
