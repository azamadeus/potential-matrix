import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { buttonClass } from "@/components/ui/button-variants";
import { useLang } from "@/i18n/context";

export type CheckoutNotice = { kind: "unavailable" } | { kind: "avr"; email: string; mailto: string };

/** Окно после нажатия «Купить», пока оплата не подключена. */
export function CheckoutDialog({ notice, onClose }: { notice: CheckoutNotice | null; onClose: () => void }) {
  const { c } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const t = c.landing.checkout;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (notice && !d.open) d.showModal();
    if (!notice && d.open) d.close();
  }, [notice]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="checkout-title"
      className="m-auto w-[min(92vw,460px)] rounded-[24px] border-2 border-ink bg-paper p-0 text-ink shadow-hard-lg backdrop:bg-ink/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id="checkout-title" className="font-display text-xl font-extrabold leading-tight">
            {notice?.kind === "avr" ? t.avrTitle : t.title}
          </h2>
          <button type="button" onClick={onClose} aria-label={t.close} className="cursor-pointer rounded-full p-1 hover:bg-paper-2">
            <X className="size-5" />
          </button>
        </div>
        <p className="leading-relaxed">{notice?.kind === "avr" ? t.avrText(notice.email) : t.text}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {notice?.kind === "avr" ? (
            <a href={notice.mailto} className={buttonClass("primary")}>
              {t.avrAgain}
            </a>
          ) : null}
          <ButtonLink to="/test" onClick={onClose} variant={notice?.kind === "avr" ? "secondary" : "primary"}>
            {t.testCta}
          </ButtonLink>
        </div>
      </div>
    </dialog>
  );
}
