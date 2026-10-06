import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { buttonClass } from "@/components/ui/button-variants";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/config/site";
import { useLang } from "@/i18n/context";

/** Окно на случай, когда оплата ещё не подключена. */
export function CheckoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { c } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const t = c.landing.checkout;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="checkout-title"
      className="m-auto w-[min(92vw,440px)] rounded-[24px] border-2 border-ink bg-paper p-0 text-ink shadow-hard-lg backdrop:bg-ink/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id="checkout-title" className="font-display text-xl font-extrabold leading-tight">
            {t.title}
          </h2>
          <button type="button" onClick={onClose} aria-label={t.close} className="cursor-pointer rounded-full p-1 hover:bg-paper-2">
            <X className="size-5" />
          </button>
        </div>
        <p className="leading-relaxed">{t.text}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/test" onClick={onClose}>
            {t.testCta}
          </ButtonLink>
          {SITE.contactUrl ? (
            <a href={SITE.contactUrl} target="_blank" rel="noreferrer" className={buttonClass("secondary")}>
              {t.contactCta}
            </a>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
