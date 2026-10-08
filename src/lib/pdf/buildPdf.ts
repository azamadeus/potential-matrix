import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { Content, Lang } from "@/i18n/types";
import type { TestResult } from "@/lib/types";

/** Собирает PDF-файл отчёта. Библиотека и шрифты грузятся только при первом нажатии кнопки. */
export async function buildReportPdf(args: { c: Content; lang: Lang; result: TestResult; ground: string }): Promise<Blob> {
  const [{ pdf }, { createElement }, { ReportDocument }, { registerPdfFonts }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
    import("./ReportDocument"),
    import("./fonts"),
  ]);
  registerPdfFonts();
  // ReportDocument возвращает <Document>, но TypeScript этого не видит через createElement.
  return pdf(createElement(ReportDocument, args) as ReactElement<DocumentProps>).toBlob();
}
