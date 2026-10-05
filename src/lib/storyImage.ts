import { ARCHETYPES } from "@/data/archetypes";
import { SELF_ESTEEM } from "@/data/selfEsteem";
import { GLYPHS } from "@/data/glyphs";
import type { ArchetypeId, TestResult, Zone } from "./types";

/** Картинка для сторис 1080×1920: «рука» из трёх карт и тип самооценки. Рисуется на canvas в браузере. */
const W = 1080;
const H = 1920;
const INK = "#111111";
const PAPER = "#fff4e2";
const ZONE_COLOR: Record<Zone, string> = { red: "#d93a2b", yellow: "#f5b70a", green: "#1f9d55" };
const LEVEL: Record<Zone, number> = { red: 1, yellow: 2, green: 3 };
const LEVEL_NAME: Record<Zone, string> = { red: "тень", yellow: "функционально", green: "опора" };

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawGlyph(ctx: CanvasRenderingContext2D, id: ArchetypeId, x: number, y: number, size: number, color: string) {
  const k = size / 48;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const s of GLYPHS[id]) {
    const p = new Path2D();
    if (s.t === "path") p.addPath(new Path2D(s.d));
    else if (s.t === "circle") p.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
    else p.rect(s.x, s.y, s.w, s.h);
    if (s.fill) ctx.fill(p);
    ctx.stroke(p);
  }
  ctx.restore();
}

/** Карта с жёсткой тенью: сначала тень, потом сама карта. */
function hardCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, shadow: string) {
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.roundRect(x + 16, y + 16, w, h, r);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.stroke();
}

export async function renderStoryImage(result: TestResult): Promise<Blob> {
  const display = cssVar("--font-unbounded", "sans-serif");
  const body = cssVar("--font-onest", "sans-serif");
  // Google Fonts отдаёт шрифт кусками (латиница, кириллица); canvas сам их не подгружает.
  const sample = "Моя рука 0123456789 /·:. Aa";
  await Promise.all([
    document.fonts.load(`800 40px ${display}`, sample),
    document.fonts.load(`700 40px ${display}`, sample),
    document.fonts.load(`600 40px ${body}`, sample),
  ]).catch(() => undefined);
  await document.fonts.ready;
  const ground = cssVar("--background", "#ff6a3d");

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = INK;
  ctx.font = `600 34px ${body}`;
  ctx.fillText("Матрица Потенциала и Зрелости", 80, 130);
  ctx.font = `800 132px ${display}`;
  ctx.fillText("Моя рука", 74, 270);

  const tilts = [-1.6, 1.2, -0.8];
  result.top.forEach((r, i) => {
    const a = ARCHETYPES[r.id];
    const x = 80;
    const y = 360 + i * 400;
    const w = 904;
    const h = 340;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((tilts[i] * Math.PI) / 180);
    ctx.translate(-(x + w / 2), -(y + h / 2));

    hardCard(ctx, x, y, w, h, 36, PAPER, INK);

    // Чёрное «окно» со знаком.
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.roundRect(x + 24, y + 24, 292, h - 48, 22);
    ctx.fill();
    drawGlyph(ctx, r.id, x + 24 + 66, y + 24 + 66, 160, PAPER);
    ctx.fillStyle = PAPER;
    ctx.font = `800 26px ${display}`;
    ctx.fillText(r.id.slice(-2), x + 48, y + 72);

    // Текст карты.
    const tx = x + 350;
    const tw = w - 350 - 36;
    ctx.fillStyle = INK;
    ctx.font = `800 46px ${display}`;
    const nameLines = wrap(ctx, a.name, tw).slice(0, 2);
    nameLines.forEach((line, li) => ctx.fillText(line, tx, y + 84 + li * 54));

    const zoneY = y + 84 + nameLines.length * 54 + 22;
    ctx.font = `700 64px ${display}`;
    const mi = String(Math.round(r.mi));
    ctx.fillText(mi, tx, zoneY + 44);
    const miW = ctx.measureText(mi).width;
    ctx.font = `600 28px ${body}`;
    ctx.fillText(`/100 · ${LEVEL_NAME[r.zone]}`, tx + miW + 10, zoneY + 44);

    // Уровень зрелости: 3 сегмента.
    const segY = zoneY + 74;
    const segW = (tw - 24) / 3;
    for (let s = 0; s < 3; s++) {
      ctx.beginPath();
      ctx.roundRect(tx + s * (segW + 12), segY, segW, 28, 14);
      ctx.fillStyle = s < LEVEL[r.zone] ? ZONE_COLOR[r.zone] : PAPER;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    ctx.restore();
  });

  // Тип самооценки.
  const se = SELF_ESTEEM[result.selfEsteem];
  const by = 1580;
  hardCard(ctx, 80, by, 904, 210, 36, INK, PAPER);
  ctx.fillStyle = PAPER;
  ctx.font = `600 30px ${body}`;
  ctx.fillText("Тип самооценки", 124, by + 64);
  ctx.font = `800 44px ${display}`;
  wrap(ctx, se.title, 816)
    .slice(0, 2)
    .forEach((line, li) => ctx.fillText(line, 124, by + 124 + li * 52));

  ctx.fillStyle = INK;
  ctx.font = `600 30px ${body}`;
  ctx.fillText(`Пройди тест: ${location.host}`, 80, 1876);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas.toBlob failed"))), "image/png"),
  );
}
