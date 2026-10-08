import { useId, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";
import { useLang } from "@/i18n/context";
import { avrMailto, bigGroupMailto, startCheckout } from "@/lib/checkout";
import { clampQty, formatTenge, isValidBin, isValidEmail, quote } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { CheckoutNotice } from "./CheckoutDialog";

type Errors = Partial<Record<"company" | "bin" | "email", string>>;

/** Калькулятор цены: количество, скидка за объём, АВР и кнопка оплаты. */
export function PricingSection({ onNotice }: { onNotice: (n: CheckoutNotice) => void }) {
  const { c, lang } = useLang();
  const t = c.landing.pricing;
  const id = useId();
  const [qty, setQty] = useState(1);
  const [avr, setAvr] = useState(false);
  const [company, setCompany] = useState("");
  const [bin, setBin] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const q = quote(qty);
  const money = (v: number) => formatTenge(v);

  /** Ошибка поля пропадает, как только его начали исправлять. */
  const edit = (field: keyof Errors, value: string, set: (v: string) => void) => {
    set(value);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const buy = async () => {
    if (avr) {
      const next: Errors = {};
      if (!company.trim()) next.company = t.companyError;
      if (!isValidBin(bin)) next.bin = t.binError;
      if (!isValidEmail(email)) next.email = t.emailError;
      setErrors(next);
      if (Object.keys(next).length) return;
    }
    const order = { quote: q, avr: avr ? { company: company.trim(), bin, email: email.trim() } : null };
    const res = await startCheckout(order);
    if (res.status === "redirect") {
      window.location.assign(res.url);
      return;
    }
    if (order.avr) {
      // Пока нет сервера, заявку на АВР отправляет сам покупатель из своей почты.
      const mailto = avrMailto(order, lang);
      onNotice({ kind: "avr", email: order.avr.email, mailto });
      window.location.assign(mailto);
    } else {
      onNotice({ kind: "unavailable" });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col gap-6 rounded-[24px] border-2 border-ink bg-paper p-6 shadow-hard-lg sm:p-8">
        <div className="flex flex-col gap-3">
          <label htmlFor={`${id}-qty`} className="font-semibold">
            {t.qtyLabel}
          </label>
          <div className="flex items-center gap-3">
            <StepButton label={t.decrease} onClick={() => setQty((v) => clampQty(v - 1))} disabled={qty <= 1}>
              <Minus className="size-5" />
            </StepButton>
            <input
              id={`${id}-qty`}
              type="number"
              inputMode="numeric"
              min={1}
              max={SITE.maxQty}
              value={qty}
              onChange={(e) => setQty(clampQty(Number(e.target.value)))}
              className="h-14 w-24 rounded-[14px] border-2 border-ink bg-background/10 text-center font-display text-2xl font-extrabold tabular-nums"
            />
            <StepButton label={t.increase} onClick={() => setQty((v) => clampQty(v + 1))} disabled={qty >= SITE.maxQty}>
              <Plus className="size-5" />
            </StepButton>
            <span className="font-medium whitespace-nowrap">{t.people(qty)}</span>
          </div>
          <input
            type="range"
            min={1}
            max={SITE.maxQty}
            value={qty}
            onChange={(e) => setQty(clampQty(Number(e.target.value)))}
            aria-label={t.qtyLabel}
            className="w-full accent-ink"
          />
        </div>

        <ul className="grid gap-2 sm:grid-cols-3">
          {SITE.tiers.map((tier) => {
            const active = qty >= tier.min && qty <= tier.max;
            return (
              <li key={tier.min}>
                <button
                  type="button"
                  onClick={() => setQty(tier.min)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col items-start rounded-[14px] border-2 border-ink px-3 py-2 text-left",
                    active ? "bg-ink text-paper" : "hover:bg-paper-2",
                  )}
                  aria-pressed={active}
                >
                  <span className="text-sm font-semibold">
                    {tier.min}–{tier.max}
                  </span>
                  <span className="text-xs font-medium">
                    {tier.discount ? t.tierDiscount(Math.round(tier.discount * 100)) : t.tierNone}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3">
          <span className="font-semibold">{t.includedTitle}</span>
          <ul className="flex flex-col gap-2">
            {t.features.map((f) => (
              <li key={f} className="flex gap-2 leading-snug">
                <Check className="mt-0.5 size-5 shrink-0" aria-hidden /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-[24px] border-2 border-ink bg-ink p-6 text-paper shadow-[8px_8px_0_var(--paper)] sm:p-8">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold opacity-80">
            {money(q.unit)} {t.perPerson}
            {q.discount ? ` · ${t.tierDiscount(Math.round(q.discount * 100))}` : ""}
          </span>
          <span className="text-sm font-semibold">{t.total}</span>
          <span className="font-display text-5xl font-extrabold tabular-nums" aria-live="polite">
            {money(q.total)}
          </span>
          {q.savings ? <span className="text-sm font-semibold text-zone-yellow">{t.savings(money(q.savings))}</span> : null}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border-2 border-paper/30 p-3">
          <input type="checkbox" checked={avr} onChange={(e) => setAvr(e.target.checked)} className="mt-1 size-5 accent-paper" />
          <span className="flex flex-col gap-0.5">
            <span className="font-semibold">{t.avrToggle}</span>
            <span className="text-sm opacity-80">{t.avrHint}</span>
          </span>
        </label>

        {avr ? (
          <div className="flex flex-col gap-3">
            <Field id={`${id}-company`} label={t.company} value={company} onChange={(v) => edit("company", v, setCompany)} error={errors.company} autoComplete="organization" />
            <Field id={`${id}-bin`} label={t.bin} value={bin} onChange={(v) => edit("bin", v, setBin)} error={errors.bin} inputMode="numeric" maxLength={14} />
            <Field id={`${id}-email`} label={t.email} value={email} onChange={(v) => edit("email", v, setEmail)} error={errors.email} type="email" autoComplete="email" />
          </div>
        ) : null}

        <Button variant="secondary" size="lg" className="mt-auto" onClick={buy}>
          {t.buy(q.qty)}
        </Button>
        <p className="text-sm opacity-80">{t.note}</p>
        <p className="text-sm">
          {t.bigGroup(SITE.maxQty)}{" "}
          <a href={bigGroupMailto()} className="font-semibold underline">
            {t.writeUs}
          </a>
        </p>
      </div>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="press flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-ink bg-paper shadow-hard-sm disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id">) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-12 rounded-[12px] border-2 bg-paper px-3 text-ink",
          error ? "border-zone-red" : "border-paper",
        )}
        {...rest}
      />
      {error ? (
        <span id={`${id}-error`} className="text-sm font-semibold text-zone-yellow">
          {error}
        </span>
      ) : null}
    </div>
  );
}
