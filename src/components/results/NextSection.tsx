import { useLang } from "@/i18n/context";

/** «Зачем это и что дальше»: как пользоваться результатом. */
export function NextSection() {
  const { c } = useLang();
  return (
    <div className="grid gap-4 rounded-[24px] border-2 border-ink bg-ink p-5 text-paper shadow-[8px_8px_0_var(--paper)] sm:grid-cols-2 sm:p-8 print-break">
      {c.ui.nextItems.map((item, i) => (
        <div key={item.title} className="flex gap-4">
          <span className="font-display text-3xl font-extrabold leading-none">{i + 1}</span>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">{item.title}</h3>
            <p className="leading-relaxed opacity-90">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
