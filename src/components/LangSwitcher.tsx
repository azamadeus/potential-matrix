import { useLang } from "@/i18n/context";
import type { Lang } from "@/i18n/types";
import { cn } from "@/lib/utils";

const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: "ru", label: "RU", name: "Русский" },
  { id: "kk", label: "ҚАЗ", name: "Қазақша" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div role="radiogroup" aria-label="Язык / Тіл" className="flex rounded-full border-2 border-ink bg-paper p-0.5 no-print">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={lang === l.id}
          aria-label={l.name}
          lang={l.id}
          onClick={() => setLang(l.id)}
          className={cn(
            "h-8 min-w-11 cursor-pointer rounded-full px-2.5 text-xs font-bold transition-colors",
            lang === l.id ? "bg-ink text-paper" : "text-ink hover:bg-paper-2",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
