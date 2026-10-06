import { Circle, Document, G, Line, Page, Path, Polygon, Rect, Svg, Text, View, type Styles } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { ARCHETYPE_IDS } from "@/data/archetypes";
import { GLYPHS, cardNumber } from "@/data/glyphs";
import type { Content, Lang, SphereId } from "@/i18n/types";
import { protocolOrder, protocolSteps } from "@/lib/report";
import type { ArchetypeId, ArchetypeResult, TestResult, Zone } from "@/lib/types";
import { ZONE_LEVEL } from "@/lib/zones";

const INK = "#111111";
const PAPER = "#fff4e2";
const CARD = "#fffaf0";
const MUTED = "#4a453e";
const ZONE: Record<Zone, string> = { red: "#d93a2b", yellow: "#f5b70a", green: "#1f9d55" };
const SPHERES: SphereId[] = ["work", "family", "friends", "self"];

type Style = Styles[string];

interface Ctx {
  c: Content;
  display: string;
  ground: string;
}

/** Знак архетипа (те же фигуры, что на сайте). */
function Glyph({ id, size, color }: { id: ArchetypeId; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {GLYPHS[id].map((s, i) => {
        const fill = s.fill ? color : "none";
        const common = { stroke: color, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", fill } as const;
        if (s.t === "path") return <Path key={i} d={s.d} {...common} />;
        if (s.t === "circle") return <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...common} />;
        return <Rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} {...common} />;
      })}
    </Svg>
  );
}

/** Блок с чёрной обводкой и жёсткой тенью, как карты на сайте. */
function Hard({
  children,
  style,
  radius = 12,
  offset = 4,
  shadow = INK,
  bg = CARD,
  wrap = false,
}: {
  children: ReactNode;
  style?: Style;
  radius?: number;
  offset?: number;
  shadow?: string;
  bg?: string;
  wrap?: boolean;
}) {
  return (
    <View wrap={wrap} style={{ position: "relative", marginRight: offset, marginBottom: offset }}>
      <View
        style={{ position: "absolute", top: offset, left: offset, right: -offset, bottom: -offset, backgroundColor: shadow, borderRadius: radius }}
      />
      <View style={{ backgroundColor: bg, borderWidth: 1.5, borderColor: INK, borderRadius: radius, ...style }}>{children}</View>
    </View>
  );
}

function Segments({ zone, width }: { zone: Zone; width: number }) {
  const level = ZONE_LEVEL[zone];
  const w = (width - 8) / 3;
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3].map((n) => (
        <View
          key={n}
          style={{ width: w, height: 8, borderRadius: 4, borderWidth: 1.2, borderColor: INK, backgroundColor: n <= level ? ZONE[zone] : CARD }}
        />
      ))}
    </View>
  );
}

function Footer({ ctx, dark }: { ctx: Ctx; dark?: boolean }) {
  const color = dark ? PAPER : INK;
  return (
    <View fixed style={{ position: "absolute", left: 40, right: 40, bottom: 22, flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontFamily: "Onest", fontSize: 8, fontWeight: 600, color }}>{ctx.c.ui.appTitle}</Text>
      <Text
        style={{ fontFamily: "Onest", fontSize: 8, fontWeight: 600, color }}
        render={({ pageNumber, totalPages }) => ctx.c.ui.pageOf(pageNumber, totalPages)}
      />
    </View>
  );
}

function H2({ ctx, children }: { ctx: Ctx; children: ReactNode }) {
  return (
    <Text
      minPresenceAhead={60}
      style={{ fontFamily: ctx.display, fontWeight: 800, fontSize: 17, lineHeight: 1.1, marginTop: 18, marginBottom: 8, color: INK }}
    >
      {children}
    </Text>
  );
}

const body: Style = { fontFamily: "Onest", fontSize: 9.5, lineHeight: 1.45, color: INK };
const small: Style = { fontFamily: "Onest", fontSize: 8.5, lineHeight: 1.4, color: MUTED };
const label: Style = { fontFamily: "Onest", fontSize: 8.5, fontWeight: 700, color: INK, marginBottom: 2 };

/** Обложка. */
function Cover({ ctx, result }: { ctx: Ctx; result: TestResult }) {
  const { c, display, ground } = ctx;
  const rotations = [-6, 0, 6];
  return (
    <Page size="A4" style={{ backgroundColor: ground, padding: 40 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontFamily: "Onest", fontSize: 10, fontWeight: 700 }}>{c.ui.appTitle}</Text>
        <Text style={{ fontFamily: "Onest", fontSize: 10, fontWeight: 600 }}>{c.ui.formatDate(new Date(result.completedAt))}</Text>
      </View>
      <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 70, lineHeight: 0.98, marginTop: 56, letterSpacing: -2 }}>
        {c.ui.handTitle}
      </Text>
      <Text style={{ fontFamily: "Onest", fontSize: 13, fontWeight: 500, lineHeight: 1.4, marginTop: 16, maxWidth: 400 }}>
        {c.ui.passport}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 70, paddingHorizontal: 6 }}>
        {result.top.map((r, i) => {
          const dark = i === 1;
          return (
            <View key={r.id} style={{ width: 158, transform: `rotate(${rotations[i]}deg)`, marginTop: dark ? -14 : 8 }}>
              <Hard
                radius={16}
                offset={6}
                bg={dark ? INK : CARD}
                shadow={dark ? PAPER : INK}
                style={{ height: 232, padding: 12, justifyContent: "space-between" }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 10, color: dark ? PAPER : INK }}>{cardNumber(r.id)}</Text>
                  <Text style={{ fontFamily: "Onest", fontWeight: 600, fontSize: 7.5, color: dark ? PAPER : INK }}>{c.ui.cardOf(r.rank)}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Glyph id={r.id} size={74} color={dark ? PAPER : INK} />
                </View>
                <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 11.5, lineHeight: 1.15, color: dark ? PAPER : INK }}>
                  {c.archetypes[r.id].name}
                </Text>
              </Hard>
            </View>
          );
        })}
      </View>

      <View style={{ position: "absolute", left: 40, right: 40, bottom: 44 }}>
        <Hard radius={16} offset={6} bg={INK} shadow={PAPER} style={{ padding: 18 }}>
          <Text style={{ fontFamily: "Onest", fontSize: 9, fontWeight: 600, color: PAPER, marginBottom: 4 }}>{c.ui.selfEsteem}</Text>
          <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 17, lineHeight: 1.1, color: PAPER }}>
            {c.selfEsteem[result.selfEsteem].title}
          </Text>
        </Hard>
      </View>
    </Page>
  );
}

/** Вторая страница: три карты и тип самооценки. */
function Overview({ ctx, result }: { ctx: Ctx; result: TestResult }) {
  const { c, display, ground } = ctx;
  const se = c.selfEsteem[result.selfEsteem];
  return (
    <Page size="A4" style={{ backgroundColor: PAPER, padding: 40, paddingBottom: 56 }}>
      <Text style={{ fontFamily: "Onest", fontSize: 9, fontWeight: 700, marginBottom: 6 }}>{c.ui.passport}</Text>
      <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.05, marginBottom: 16 }}>{c.ui.pdfCardsTitle}</Text>

      <View style={{ gap: 12 }}>
        {result.top.map((r) => {
          const a = c.archetypes[r.id];
          const shadow = (r.answers.shadow_1 + r.answers.shadow_2) / 2;
          return (
            <Hard key={r.id} style={{ padding: 12, flexDirection: "row", gap: 12 }}>
              <View style={{ width: 66, height: 66, borderRadius: 10, backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
                <Glyph id={r.id} size={40} color={PAPER} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 13.5, lineHeight: 1.1 }}>{a.name}</Text>
                <Text style={{ ...small, marginTop: 2 }}>{a.traits.join(" · ")}</Text>
                <Text style={{ ...body, marginTop: 5 }}>{a.essence}</Text>
              </View>
              <View style={{ width: 96 }}>
                <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 26, lineHeight: 1 }}>{Math.round(r.mi)}</Text>
                <Text style={{ ...small, marginBottom: 5 }}>
                  /100 · {c.zones[r.zone].level}
                </Text>
                <Segments zone={r.zone} width={96} />
                <Text style={{ ...small, marginTop: 6 }}>
                  {c.ui.shadow} {String(Math.round(shadow * 10) / 10).replace(".", ",")}/5
                </Text>
                <Text style={small}>
                  {c.ui.grounded} {r.answers.grounded}/5
                </Text>
              </View>
            </Hard>
          );
        })}
      </View>

      <View style={{ marginTop: 22 }}>
        <Hard radius={16} offset={5} bg={ground} style={{ padding: 16 }}>
          <Text style={{ fontFamily: "Onest", fontSize: 8.5, fontWeight: 700, marginBottom: 4 }}>{c.ui.selfEsteem}</Text>
          <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 18, lineHeight: 1.1, marginBottom: 6 }}>{se.title}</Text>
          <Text style={{ fontFamily: "Onest", fontSize: 11, fontWeight: 600, lineHeight: 1.35, marginBottom: 8 }}>{se.formula}</Text>
          <Text style={body}>{se.description}</Text>
        </Hard>
        <View style={{ marginTop: 10 }}>
          <Hard radius={12} offset={4} bg={INK} shadow={ground} style={{ padding: 12 }}>
            <Text style={{ fontFamily: "Onest", fontSize: 8.5, fontWeight: 700, color: PAPER, marginBottom: 2 }}>{c.ui.growTo}</Text>
            <Text style={{ ...body, color: PAPER }}>{se.vector}</Text>
          </Hard>
        </View>
      </View>
      <Footer ctx={ctx} />
    </Page>
  );
}

/** Радар по 12 картам. */
function Radar({ scores, top, ctx }: { scores: Record<ArchetypeId, number>; top: ArchetypeId[]; ctx: Ctx }) {
  const W = 523;
  const H = 250;
  const cx = W / 2;
  const cy = H / 2;
  const R = 82;
  const max = Math.max(4, ...Object.values(scores));
  const pt = (i: number, v: number, extra = 0) => {
    const ang = (Math.PI * 2 * i) / ARCHETYPE_IDS.length - Math.PI / 2;
    const r = (v / max) * R + extra;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), ang };
  };
  const ring = (v: number) => ARCHETYPE_IDS.map((_, i) => pt(i, v)).map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {Array.from({ length: max }, (_, i) => (
        <Polygon key={i} points={ring(i + 1)} stroke={INK} strokeOpacity={0.18} strokeWidth={0.8} fill="none" />
      ))}
      {ARCHETYPE_IDS.map((id, i) => {
        const e = pt(i, max);
        return <Line key={id} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke={INK} strokeOpacity={0.18} strokeWidth={0.8} />;
      })}
      <Polygon
        points={ARCHETYPE_IDS.map((id, i) => pt(i, scores[id]))
          .map((p) => `${p.x},${p.y}`)
          .join(" ")}
        fill={INK}
        fillOpacity={0.12}
        stroke={INK}
        strokeWidth={1.6}
      />
      {ARCHETYPE_IDS.map((id, i) => {
        const p = pt(i, scores[id]);
        const l = pt(i, max, 22);
        const isTop = top.includes(id);
        const anchor = Math.abs(Math.cos(l.ang)) < 0.2 ? "middle" : Math.cos(l.ang) > 0 ? "start" : "end";
        return (
          <G key={id}>
            <Circle cx={p.x} cy={p.y} r={isTop ? 3.6 : 2.4} fill={isTop ? INK : CARD} stroke={INK} strokeWidth={1.2} />
            <Text
              x={l.x}
              y={l.y + 3}
              textAnchor={anchor}
              style={{ fontFamily: "Onest", fontSize: 8.5, fontWeight: isTop ? 700 : 500 }}
              fill={INK}
            >
              {ctx.c.archetypes[id].short}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

function DeckPage({ ctx, result }: { ctx: Ctx; result: TestResult }) {
  const { c, display } = ctx;
  const notes: [string, string][] = [];
  if (result.validity.defenseFlag) notes.push([c.ui.defenseTitle, c.ui.defenseText]);
  if (result.validity.straightLining) notes.push([c.ui.straightTitle, c.ui.straightText]);
  if (result.validity.rushed) notes.push([c.ui.rushedTitle, c.ui.rushedText]);
  return (
    <Page size="A4" style={{ backgroundColor: PAPER, padding: 40, paddingBottom: 56 }}>
      <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 24, lineHeight: 1.05, marginBottom: 4 }}>{c.ui.deck}</Text>
      <Text style={{ ...body, marginBottom: 6 }}>{c.ui.deckLead}</Text>
      <Radar scores={result.scores} top={result.top.map((t) => t.id)} ctx={ctx} />

      {notes.length ? (
        <Hard bg="#f5b70a" style={{ padding: 12, marginBottom: 6 }}>
          {notes.map(([t, text]) => (
            <View key={t} style={{ marginBottom: 6 }}>
              <Text style={{ fontFamily: display, fontWeight: 700, fontSize: 10, marginBottom: 2 }}>{t}</Text>
              <Text style={body}>{text}</Text>
            </View>
          ))}
          <Text style={{ ...label, marginBottom: 0 }}>{c.ui.validityIndex(result.validity.validityIndex)}</Text>
        </Hard>
      ) : null}

      <H2 ctx={ctx}>{c.ui.nextTitle}</H2>
      <Text style={{ ...body, marginBottom: 10 }}>{c.ui.nextLead}</Text>
      <Hard radius={16} offset={5} bg={INK} shadow={ctx.ground} style={{ padding: 16, gap: 12 }}>
        {c.ui.nextItems.map((item, i) => (
          <View key={item.title} style={{ flexDirection: "row", gap: 12 }}>
            <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 20, lineHeight: 1, color: PAPER, width: 18 }}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Onest", fontSize: 10, fontWeight: 700, color: PAPER, marginBottom: 2 }}>{item.title}</Text>
              <Text style={{ ...body, color: PAPER }}>{item.text}</Text>
            </View>
          </View>
        ))}
      </Hard>
      <Footer ctx={ctx} />
    </Page>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View style={{ gap: 3 }}>
      {items.map((t) => (
        <View key={t} style={{ flexDirection: "row", gap: 6 }}>
          <Text style={{ ...body, width: 6 }}>•</Text>
          <Text style={{ ...body, flex: 1 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

/** Разбор карты, страница 1: суперсилы, состояние, сферы жизни. */
function ArchetypeMain({ ctx, r }: { ctx: Ctx; r: ArchetypeResult }) {
  const { c, display, ground } = ctx;
  const a = c.archetypes[r.id];
  const x = c.extras[r.id];
  return (
    <Page size="A4" wrap style={{ backgroundColor: PAPER, padding: 40, paddingBottom: 60 }}>
      <Hard radius={16} offset={5} bg={ground} style={{ padding: 16, flexDirection: "row", gap: 14, alignItems: "center" }}>
        <View style={{ width: 76, height: 76, borderRadius: 12, backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
          <Glyph id={r.id} size={48} color={PAPER} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Onest", fontSize: 8.5, fontWeight: 700 }}>
            {c.ui.forTalent} {cardNumber(r.id)} · {c.ui.cardOf(r.rank)}
          </Text>
          <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 24, lineHeight: 1.05, marginTop: 2 }}>{a.name}</Text>
          <Text style={{ fontFamily: "Onest", fontSize: 10, fontWeight: 500, marginTop: 3 }}>{a.tagline}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{Math.round(r.mi)}</Text>
          <Text style={{ fontFamily: "Onest", fontSize: 8, fontWeight: 600, marginBottom: 4 }}>{c.zones[r.zone].level}</Text>
          <Segments zone={r.zone} width={64} />
        </View>
      </Hard>

      <H2 ctx={ctx}>{c.ui.superTitle}</H2>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {x.superpowers.map((s) => (
          <View key={s.title} style={{ flex: 1 }}>
            <Hard style={{ padding: 10 }}>
              <Text style={{ fontFamily: "Onest", fontSize: 10, fontWeight: 700, marginBottom: 3 }}>{s.title}</Text>
              <Text style={small}>{s.text}</Text>
            </Hard>
          </View>
        ))}
      </View>

      <H2 ctx={ctx}>{c.ui.nowTitle}</H2>
      <Text style={{ ...body, marginBottom: 8 }}>{a.diagnosis[r.zone]}</Text>
      <View style={{ flexDirection: "row", gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Text style={label}>{c.ui.blindSpot}</Text>
          <Text style={body}>{a.blindSpot}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={label}>{c.ui.hiddenRisk}</Text>
          <Text style={body}>{a.hiddenRisk}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 14, marginTop: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={label}>{c.ui.needs}</Text>
          <Bullets items={a.needs} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={label}>{c.ui.drains}</Text>
          <Bullets items={a.drains} />
        </View>
      </View>

      <H2 ctx={ctx}>{c.ui.spheresTitle}</H2>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {SPHERES.map((id) => (
          <View key={id} style={{ width: "48.6%" }} wrap={false}>
            <Hard radius={10} offset={3} style={{ padding: 9 }}>
              <Text style={label}>{c.ui.sphereNames[id]}</Text>
              <Text style={small}>{x.spheres[id]}</Text>
            </Hard>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 14, marginTop: 6 }} wrap={false}>
        <View style={{ flex: 1 }}>
          <Text style={label}>{c.ui.inTeam}</Text>
          <Text style={body}>{a.inTeam}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={label}>{c.ui.inConflict}</Text>
          <Text style={body}>{a.inConflict}</Text>
        </View>
      </View>

      <Footer ctx={ctx} />
    </Page>
  );
}

/** Разбор карты, страница 2: откуда это взялось, шаги и инструменты. */
function ArchetypeHow({ ctx, r }: { ctx: Ctx; r: ArchetypeResult }) {
  const { c, display, ground } = ctx;
  const a = c.archetypes[r.id];
  const [s1, s2] = protocolSteps(c, r);
  return (
    <Page size="A4" style={{ backgroundColor: PAPER, padding: 40, paddingBottom: 60 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: ground, borderWidth: 1.5, borderColor: INK, alignItems: "center", justifyContent: "center" }}>
          <Glyph id={r.id} size={28} color={INK} />
        </View>
        <View>
          <Text style={{ fontFamily: "Onest", fontSize: 8.5, fontWeight: 700 }}>{a.name}</Text>
          <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 22, lineHeight: 1.05 }}>{c.ui.levelUpTitle}</Text>
        </View>
      </View>

      <View style={{ marginTop: 18 }}>
        <Hard radius={16} offset={5} bg={INK} shadow={ground} style={{ padding: 18, gap: 14 }}>
          {[s1, s2].map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 12 }}>
              <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 26, lineHeight: 1, color: PAPER, width: 24 }}>{i + 1}</Text>
              <Text style={{ fontFamily: "Onest", fontSize: 11.5, fontWeight: 500, lineHeight: 1.45, color: PAPER, flex: 1 }}>{step}</Text>
            </View>
          ))}
        </Hard>
      </View>

      <H2 ctx={ctx}>{c.ui.tools}</H2>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {a.tools.map((t) => (
          <View key={t.name} style={{ flex: 1 }}>
            <Hard style={{ padding: 11 }}>
              <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 10, lineHeight: 1.15, marginBottom: 5 }}>{t.name}</Text>
              <Text style={body}>{t.how}</Text>
            </Hard>
          </View>
        ))}
      </View>

      <H2 ctx={ctx}>{c.ui.roots}</H2>
      <Text style={{ ...small, marginBottom: 6 }}>{c.ui.rootsNote}</Text>
      <Hard bg={ground} style={{ padding: 14, gap: 6 }}>
        {a.roots.map((t) => (
          <View key={t} style={{ flexDirection: "row", gap: 7 }}>
            <Text style={{ ...body, width: 6 }}>•</Text>
            <Text style={{ ...body, flex: 1 }}>{t}</Text>
          </View>
        ))}
      </Hard>
      <Footer ctx={ctx} />
    </Page>
  );
}

/** Последняя страница: план на 30 дней и книги. */
function PlanPage({ ctx, result }: { ctx: Ctx; result: TestResult }) {
  const { c, display, ground } = ctx;
  const order = protocolOrder(result);
  return (
    <Page size="A4" wrap style={{ backgroundColor: PAPER, padding: 40, paddingBottom: 60 }}>
      <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.05 }}>{c.ui.planTitle}</Text>
      <Text style={{ ...body, marginTop: 6, marginBottom: 12 }}>{c.ui.planLead}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {[0, 1, 2, 3].map((w) => (
          <View key={w} style={{ width: "48.8%" }} wrap={false}>
            <Hard radius={14} offset={4} style={{ padding: 12 }} bg={w % 2 === 0 ? CARD : "#ffffff"}>
              <View style={{ alignSelf: "flex-start", backgroundColor: ground, borderWidth: 1.2, borderColor: INK, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 8 }}>
                <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 9 }}>{c.ui.week(w + 1)}</Text>
              </View>
              <View style={{ gap: 7 }}>
                {order.map((r) => (
                  <View key={r.id} style={{ flexDirection: "row", gap: 7 }}>
                    <View style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
                      <Glyph id={r.id} size={11} color={PAPER} />
                    </View>
                    <Text style={{ ...body, fontSize: 9, flex: 1 }}>{c.extras[r.id].plan[w]}</Text>
                  </View>
                ))}
              </View>
            </Hard>
          </View>
        ))}
      </View>

      <H2 ctx={ctx}>{c.ui.booksTitle}</H2>
      <Text style={{ ...body, marginBottom: 8 }}>{c.ui.booksLead}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {order.map((r) => (
          <View key={r.id} style={{ flex: 1 }} wrap={false}>
            <Hard radius={12} offset={3} style={{ padding: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Glyph id={r.id} size={16} color={INK} />
                <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 9.5, flex: 1 }}>{c.archetypes[r.id].name}</Text>
              </View>
              <View style={{ gap: 6 }}>
                {c.extras[r.id].books.map((b) => (
                  <View key={b.title}>
                    <Text style={{ fontFamily: "Onest", fontSize: 8.8, fontWeight: 700, lineHeight: 1.3 }}>{b.title}</Text>
                    <Text style={small}>{b.author}</Text>
                  </View>
                ))}
              </View>
            </Hard>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 22 }} wrap={false}>
        <Hard radius={16} offset={5} bg={ground} style={{ padding: 16 }}>
          <Text style={{ fontFamily: display, fontWeight: 800, fontSize: 15, lineHeight: 1.15, marginBottom: 4 }}>{c.ui.nextItems[3].title}</Text>
          <Text style={body}>{c.ui.nextItems[3].text}</Text>
        </Hard>
      </View>
      <Text style={{ ...small, marginTop: 14 }}>{c.ui.disclaimer}</Text>
      <Footer ctx={ctx} />
    </Page>
  );
}

export function ReportDocument({ c, lang, result, ground }: { c: Content; lang: Lang; result: TestResult; ground: string }) {
  const ctx: Ctx = { c, ground, display: lang === "kk" ? "DisplayKk" : "DisplayRu" };
  return (
    <Document title={`${c.ui.passport} · ${c.ui.appTitle}`} author={c.ui.appTitle} language={lang}>
      <Cover ctx={ctx} result={result} />
      <Overview ctx={ctx} result={result} />
      <DeckPage ctx={ctx} result={result} />
      {result.top.flatMap((r) => [<ArchetypeMain key={`${r.id}-a`} ctx={ctx} r={r} />, <ArchetypeHow key={`${r.id}-b`} ctx={ctx} r={r} />])}
      <PlanPage ctx={ctx} result={result} />
    </Document>
  );
}
