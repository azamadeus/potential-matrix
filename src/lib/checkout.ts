import { SITE } from "@/config/site";

export type Plan = "personal" | "company";

export type CheckoutResult =
  /** Оплата ещё не подключена: показываем окно с альтернативами. */
  | { status: "unavailable" }
  /** Платёжная страница готова: переходим по ссылке. */
  | { status: "redirect"; url: string };

/**
 * Точка подключения оплаты (Kaspi).
 * Сейчас оплата не подключена, и функция всегда возвращает «unavailable».
 * Когда будет API: здесь создаётся счёт или ссылка на оплату и возвращается { status: "redirect", url }.
 */
export async function startCheckout(plan: Plan): Promise<CheckoutResult> {
  void plan;
  void SITE;
  return { status: "unavailable" };
}

export function formatPrice(price: number | null, locale: string): string | null {
  if (price === null) return null;
  return `${new Intl.NumberFormat(locale).format(price)} ₸`;
}
