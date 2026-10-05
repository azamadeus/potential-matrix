
import { useState } from "react";
import { Check, Copy, Download, Image as ImageIcon, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildTextReport } from "@/lib/report";
import { renderStoryImage } from "@/lib/storyImage";
import type { TestResult } from "@/lib/types";

export function ExportActions({ result, onRestart }: { result: TestResult; onRestart: () => void }) {
  const [copied, setCopied] = useState(false);
  const [storyBusy, setStoryBusy] = useState(false);
  const text = () => buildTextReport(result);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
    } catch {
      const area = document.createElement("textarea");
      area.value = text();
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([text()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `passport-potentsiala-${result.completedAt.slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /** На телефоне — системное меню «Поделиться» (сразу в сторис), иначе — скачивание PNG. */
  const story = async () => {
    setStoryBusy(true);
    try {
      const blob = await renderStoryImage(result);
      const file = new File([blob], "moya-ruka.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Моя рука. Матрица Потенциала" });
          return;
        } catch (e) {
          if ((e as Error).name === "AbortError") return;
        }
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setStoryBusy(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 no-print">
      <Button onClick={story} disabled={storyBusy}>
        <ImageIcon className="size-4" /> {storyBusy ? "Рисуем…" : "Картинка для сторис"}
      </Button>
      <Button variant="secondary" onClick={download}>
        <Download className="size-4" /> Скачать отчёт
      </Button>
      <Button variant="secondary" onClick={() => window.print()}>
        <Printer className="size-4" /> Сохранить в PDF
      </Button>
      <Button variant="secondary" onClick={copy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Скопировано" : "Скопировать результат"}
      </Button>
      <Button variant="ghost" onClick={onRestart}>
        <RotateCcw className="size-4" /> Пройти заново
      </Button>
    </div>
  );
}
