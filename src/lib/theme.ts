/** Цвет «стола», на котором лежат карты. Текст везде чёрный, поэтому все варианты читаются одинаково. */
export const GROUNDS = [
  { id: "vermilion", color: "#ff6a3d" },
  { id: "lime", color: "#b7e36a" },
  { id: "sky", color: "#7ec8f2" },
  { id: "sun", color: "#f6c945" },
] as const;

export type GroundId = (typeof GROUNDS)[number]["id"];

const STORAGE_KEY = "mpz-ground";

export function groundColor(id: GroundId): string {
  return GROUNDS.find((g) => g.id === id)?.color ?? GROUNDS[0].color;
}

export function loadGround(): GroundId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (GROUNDS.some((g) => g.id === saved)) return saved as GroundId;
  } catch {
    // Хранилище недоступно (приватный режим) — остаёмся на цвете по умолчанию.
  }
  return GROUNDS[0].id;
}

export function applyGround(id: GroundId) {
  const color = groundColor(id);
  document.documentElement.style.setProperty("--background", color);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Не сохранится между визитами — не страшно.
  }
}
