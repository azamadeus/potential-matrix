import { SITE } from "@/config/site";
import { formatTenge, type Quote } from "./pricing";

export interface AvrDetails {
  company: string;
  bin: string;
  email: string;
}

export interface Order {
  quote: Quote;
  /** Данные для АВР, если покупателю нужен акт. */
  avr: AvrDetails | null;
}

export type CheckoutResult =
  /** Оплата ещё не подключена. */
  | { status: "unavailable" }
  /** Платёжная страница готова: переходим по ссылке. */
  | { status: "redirect"; url: string };

/**
 * Точка подключения оплаты (Kaspi).
 * Сейчас оплата не подключена, и функция всегда возвращает «unavailable».
 * Когда будет сервер: здесь создаётся заказ (количество, сумма, данные АВР), сервер выставляет счёт в Kaspi
 * и возвращает ссылку на оплату: { status: "redirect", url }. Письмо с АВР тогда отправляет сервер.
 */
export async function startCheckout(order: Order): Promise<CheckoutResult> {
  void order;
  return { status: "unavailable" };
}

/** Письмо команде с заказом и реквизитами для АВР. Всегда на русском: его читает бухгалтерия. */
export function avrMailto(order: Order, lang: string): string {
  const { quote: q, avr } = order;
  const subject = `Заявка на АВР: тест на ${q.qty} чел., ${formatTenge(q.total)}`;
  const body = [
    "Здравствуйте! Прошу выставить счёт и АВР.",
    "",
    `Количество человек: ${q.qty}`,
    `Цена за человека: ${formatTenge(q.unit)}${q.discount ? ` (скидка ${Math.round(q.discount * 100)}%)` : ""}`,
    `Итого: ${formatTenge(q.total)}`,
    "",
    `Компания: ${avr?.company ?? ""}`,
    `БИН: ${avr?.bin.replace(/\s/g, "") ?? ""}`,
    `Почта для АВР: ${avr?.email.trim() ?? ""}`,
    `Язык сайта: ${lang}`,
  ].join("\n");
  return `mailto:${SITE.ordersEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Письмо для групп больше максимального размера. */
export function bigGroupMailto(): string {
  const subject = `Тест для группы больше ${SITE.maxQty} человек`;
  const body = "Здравствуйте! Нас больше " + SITE.maxQty + " человек. Сколько нас: \nКомпания: \nКонтакт: ";
  return `mailto:${SITE.ordersEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
