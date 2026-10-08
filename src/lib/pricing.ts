import { SITE } from "@/config/site";

export interface Quote {
  qty: number;
  discount: number;
  /** Цена за человека со скидкой (округлена до тенге). */
  unit: number;
  /** Итог: считается от точной суммы, потом округляется. */
  total: number;
  /** Сколько сэкономлено относительно полной цены. */
  savings: number;
}

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(SITE.maxQty, Math.max(1, Math.round(qty)));
}

export function discountFor(qty: number): number {
  return SITE.tiers.find((t) => qty >= t.min && qty <= t.max)?.discount ?? 0;
}

export function quote(qty: number): Quote {
  const q = clampQty(qty);
  const discount = discountFor(q);
  const full = SITE.pricePerPerson * q;
  const total = Math.round(full * (1 - discount));
  return { qty: q, discount, unit: Math.round(SITE.pricePerPerson * (1 - discount)), total, savings: full - total };
}

/** «4 990 ₸». Разряды разделяются пробелом вручную: не все браузеры знают казахский формат чисел. */
export function formatTenge(amount: number): string {
  const digits = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${digits}\u00a0₸`;
}

/** Казахстанский БИН: ровно 12 цифр. */
export const isValidBin = (bin: string) => /^\d{12}$/.test(bin.replace(/\s/g, ""));

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
