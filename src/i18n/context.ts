import { createContext, useContext } from "react";
import type { Content, Lang } from "./types";
import { ru } from "./ru";

export interface LangState {
  lang: Lang;
  c: Content;
  setLang: (lang: Lang) => void;
}

export const LangContext = createContext<LangState>({ lang: "ru", c: ru, setLang: () => {} });

/** Тексты текущего языка и переключатель. */
export const useLang = () => useContext(LangContext);
