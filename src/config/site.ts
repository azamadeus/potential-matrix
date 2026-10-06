/**
 * Настройки сайта, которые меняются без правки кода компонентов.
 * Цены в тенге. null значит «цена ещё не задана»: на сайте показывается заглушка.
 */
export const SITE = {
  prices: {
    personal: null as number | null,
    /** Цена за одного сотрудника. */
    company: null as number | null,
  },
  /** Ссылка для заявок от компаний: WhatsApp (https://wa.me/7XXXXXXXXXX), Telegram или mailto:. Пусто: кнопка скрыта. */
  contactUrl: "",
  /** Как показывать контакт в подвале, например «+7 700 000 00 00» или почта. */
  contactLabel: "",
};
