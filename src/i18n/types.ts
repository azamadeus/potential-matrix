import type { ArchetypeId, MaturityKind, SelfEsteemType, Zone } from "@/lib/types";

export type Lang = "ru" | "kk";

/** Все тексты одного архетипа. */
export interface ArchetypeText {
  name: string;
  /** Короткая подпись для оси диаграммы. */
  short: string;
  /** 3–4 ключевых слова таланта: показываются на карте. */
  traits: string[];
  tagline: string;
  /** Дар архетипа в зрелом состоянии. */
  essence: string;
  /** Название теневой (гиперкомпенсаторной) стратегии. */
  shadowPattern: string;
  blindSpot: string;
  hiddenRisk: string;
  /** Утверждение для уточняющего вопроса при ничьей. */
  tieStatement: string;
  /** Что человеку нужно, чтобы талант работал. */
  needs: string[];
  /** Что выматывает. */
  drains: string[];
  /** Роль в команде. */
  inTeam: string;
  /** Поведение в конфликте. */
  inConflict: string;
  /** Откуда это могло взяться: гипотезы о детском опыте. */
  roots: string[];
  /** Практики и инструменты: название и одна строка «как». */
  tools: { name: string; how: string }[];
  diagnosis: Record<Zone, string>;
  /** 2 шага: repair — для красной/жёлтой зоны, growth — для зелёной. */
  protocol: { repair: [string, string]; growth: [string, string] };
}

export interface SelfEsteemText {
  title: string;
  formula: string;
  description: string;
  vector: string;
}

export interface ZoneText {
  label: string;
  short: string;
  /** Уровень на шкале из трёх: «Тень», «Функционально», «Опора». */
  level: string;
  description: string;
}

export interface UiText {
  appTitle: string;
  appShort: string;
  locale: string;
  /** Дата словами. Своя функция, потому что не все браузеры умеют форматировать даты на казахском. */
  formatDate: (d: Date) => string;
  langName: string;
  ground: string;
  groundNames: Record<"vermilion" | "lime" | "sky" | "sun", string>;
  // Старт
  introLead: string;
  introSteps: [string, string][];
  start: string;
  introNote: string;
  // Шапка теста
  stage1: string;
  stage1Tie: string;
  stage2: string;
  back: string;
  progress: string;
  timeLeft: (seconds: number) => string;
  // Дилеммы
  dilemmaTitle: string;
  timerOver: string;
  seconds: (n: number) => string;
  swipeHint: string;
  keysHint: string;
  optionA: string;
  optionB: string;
  insightLeader: (answered: number, name: string) => string;
  insightEven: (answered: number) => string;
  // Ничья
  tieBadge: string;
  tieTitle: string;
  // Переход ко второму этапу
  stage2Done: string;
  stage2Title: string;
  stage2Lead: string;
  stage2Start: string;
  // Шкала
  scalePrompt: string;
  scale: [string, string, string, string, string];
  hints: string[];
  // Результаты
  passport: string;
  handTitle: string;
  handLead: (names: string) => string;
  cardOf: (n: number) => string;
  shadow: string;
  grounded: string;
  maturity: string;
  maturityLevel: (level: number) => string;
  capped: string;
  pickedTimes: (votes: number) => string;
  selfEsteem: string;
  growTo: string;
  avgMaturity: string;
  validity: string;
  deck: string;
  deckLead: string;
  deckAria: string;
  pickedInDilemmas: (votes: number) => string;
  showTable: string;
  nowTitle: string;
  nowLead: string;
  shadowLabel: string;
  happeningNow: string;
  blindSpot: string;
  hiddenRisk: string;
  needs: string;
  drains: string;
  inTeam: string;
  inConflict: string;
  roots: string;
  rootsNote: string;
  levelUpTitle: string;
  levelUpLead: string;
  startHere: string;
  tools: string;
  disclaimer: string;
  // Валидность
  defenseTitle: string;
  defenseText: string;
  straightTitle: string;
  straightText: string;
  rushedTitle: string;
  rushedText: string;
  validityIndex: (v: number) => string;
  // Экспорт
  story: string;
  storyBusy: string;
  storyTitle: string;
  storyHeading: string;
  storyCta: (host: string) => string;
  download: string;
  pdf: string;
  copy: string;
  copied: string;
  restart: string;
  // Текстовый отчёт
  report: {
    title: string;
    date: string;
    selfEsteem: string;
    growTo: string;
    avgMaturity: string;
    validity: string;
    defense: string;
    straight: string;
    rushed: string;
    top: string;
    votes: string;
    maturity: string;
    cappedNote: string;
    essence: string;
    diagnosis: string;
    shadow: string;
    blindSpot: string;
    hiddenRisk: string;
    needs: string;
    drains: string;
    roots: string;
    levelUp: string;
    step: (n: number) => string;
    tools: string;
    profile: string;
    disclaimer: string;
  };
}

export interface LandingText {
  nav: { about: string; deck: string; example: string; pricing: string; faq: string; start: string };
  hero: { kicker: string; title: string; lead: string; cta: string; ctaSecondary: string; note: string };
  why: { title: string; items: { title: string; text: string }[] };
  how: { title: string };
  deck: { title: string; lead: string };
  example: { title: string; lead: string; note: string };
  pricing: {
    title: string;
    lead: string;
    qtyLabel: string;
    decrease: string;
    increase: string;
    people: (n: number) => string;
    tierNone: string;
    tierDiscount: (pct: number) => string;
    perPerson: string;
    total: string;
    savings: (amount: string) => string;
    includedTitle: string;
    features: string[];
    buy: (qty: number) => string;
    avrToggle: string;
    avrHint: string;
    company: string;
    bin: string;
    binError: string;
    email: string;
    emailError: string;
    companyError: string;
    bigGroup: (max: number) => string;
    writeUs: string;
    note: string;
  };
  checkout: {
    title: string;
    text: string;
    testCta: string;
    close: string;
    avrTitle: string;
    avrText: (email: string) => string;
    avrAgain: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  final: { title: string; lead: string; cta: string };
  footer: { contacts: string; home: string };
}

export interface Content {
  ui: UiText;
  landing: LandingText;
  archetypes: Record<ArchetypeId, ArchetypeText>;
  /** Тексты 20 дилемм в том же порядке, что и DILEMMAS. */
  dilemmas: { a: string; b: string }[];
  markers: Record<ArchetypeId, Record<MaturityKind, string>>;
  /** Контрольные вопросы L1–L3. */
  lie: [string, string, string];
  selfEsteem: Record<SelfEsteemType, SelfEsteemText>;
  zones: Record<Zone, ZoneText>;
}
