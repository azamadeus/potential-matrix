import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TestApp } from "@/components/TestApp";
import { LangProvider } from "@/i18n/LangProvider";
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/onest/600.css";
import "@fontsource/onest/700.css";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
// В Unbounded нет казахских букв (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ), поэтому заголовки на казахском набираются Montserrat.
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider>
      <TestApp />
    </LangProvider>
  </StrictMode>,
);
