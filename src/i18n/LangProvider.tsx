import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LangContext } from "./context";
import { kk } from "./kk";
import { ru } from "./ru";
import type { Lang } from "./types";

const STORAGE_KEY = "mpz-lang";
const CONTENT = { ru, kk };

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "kk") return saved;
  } catch {
    // Хранилище недоступно: берём язык браузера.
  }
  return navigator.language?.toLowerCase().startsWith("kk") ? "kk" : "ru";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = CONTENT[lang].ui.appTitle;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Не сохранится между визитами, не страшно.
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, c: CONTENT[lang], setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
