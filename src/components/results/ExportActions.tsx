
import { useState } from "react";
import { Check, Copy, Download, Image as ImageIcon, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildTextReport } from "@/lib/report";
import { useLang } from "@/i18n/context";
import { renderStoryImage } from "@/lib/storyImage";
import type { TestResult } from "@/lib/types";

export function ExportActions({ result, onRestart }: { result: TestResult; onRestart: () => void }) {
  const { c, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const [storyBusy, setStoryBusy] = useState(false);
  const text = () => buildTextReport(c, result);

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
    link.download = `passport-${lang}-${result.completedAt.slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /** На телефоне открывается системное меню «Поделиться» (сразу в сторис), иначе скачивается PNG. */
  const story = async () => {
    setStoryBusy(true);
    try {
      const blob = await renderStoryImage(c, result);
      const file = new File([blob], `story-${lang}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: c.ui.storyTitle });
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
        <ImageIcon className="size-4" /> {storyBusy ? c.ui.storyBusy : c.ui.story}
      </Button>
      <Button variant="secondary" onClick={download}>
        <Download className="size-4" /> {c.ui.download}
      </Button>
      <Button variant="secondary" onClick={() => window.print()}>
        <Printer className="size-4" /> {c.ui.pdf}
      </Button>
      <Button variant="secondary" onClick={copy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? c.ui.copied : c.ui.copy}
      </Button>
      <Button variant="ghost" onClick={onRestart}>
        <RotateCcw className="size-4" /> {c.ui.restart}
      </Button>
    </div>
  );
}
