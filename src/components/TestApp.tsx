
import { useEffect, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DILEMMAS } from "@/data/questions";
import {
  INSIGHT_AT,
  flowReducer,
  initialFlow,
  leaderSoFar,
  overallProgress,
  secondsLeft,
  type FlowState,
} from "@/lib/flow";
import { useLang } from "@/i18n/context";
import { InsightBanner } from "./test/InsightBanner";
import { LangSwitcher } from "./LangSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { DilemmaCard } from "./test/DilemmaCard";
import { IntroScreen } from "./test/IntroScreen";
import { ProgressHeader } from "./test/ProgressHeader";
import { ScaleCard } from "./test/ScaleCard";
import { Stage2Intro } from "./test/Stage2Intro";
import { TieBreakCard } from "./test/TieBreakCard";
import { ResultsView } from "./results/ResultsView";

/** Уникальный ключ экрана — для анимации смены карточек. */
function screenKey(s: FlowState): string {
  if (s.phase === "stage1" || s.phase === "stage2") return `${s.phase}-${s.index}`;
  if (s.phase === "tiebreak") return `tie-${s.tiePicks.length}`;
  return s.phase;
}

export function TestApp() {
  const { c } = useLang();
  const [state, dispatch] = useReducer(flowReducer, initialFlow);
  const key = screenKey(state);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.phase]);

  const timeLeft = c.ui.timeLeft(secondsLeft(state));
  // Инсайт держится на двух карточках после контрольной точки.
  const insightPoint = INSIGHT_AT.find((at) => state.index === at || state.index === at + 1);
  const showInsight = state.phase === "stage1" && insightPoint !== undefined;

  const header = (() => {
    const progress = overallProgress(state);
    switch (state.phase) {
      case "stage1":
        return (
          <ProgressHeader
            stageLabel={c.ui.stage1}
            counter={`${state.index + 1} / ${DILEMMAS.length} · ${timeLeft}`}
            progress={progress}
            onBack={state.index > 0 ? () => dispatch({ type: "back" }) : undefined}
          />
        );
      case "tiebreak":
        return <ProgressHeader stageLabel={c.ui.stage1Tie} progress={progress} />;
      case "stage2intro":
        return <ProgressHeader stageLabel={c.ui.stage2} progress={progress} />;
      case "stage2":
        return (
          <ProgressHeader
            stageLabel={c.ui.stage2}
            counter={`${state.index + 1} / ${state.items.length} · ${timeLeft}`}
            progress={progress}
            onBack={state.index > 0 ? () => dispatch({ type: "back" }) : undefined}
          />
        );
      default:
        return null;
    }
  })();

  const screen = (() => {
    switch (state.phase) {
      case "intro":
        return <IntroScreen onStart={() => dispatch({ type: "start" })} />;
      case "stage1":
        return (
          <DilemmaCard
            texts={c.dilemmas[state.index]}
            previous={state.choices[state.index]}
            onChoose={(choice) => dispatch({ type: "choose", choice })}
          />
        );
      case "tiebreak":
        return state.tie ? (
          <TieBreakCard tie={state.tie} onPick={(id) => dispatch({ type: "pickTie", id })} />
        ) : null;
      case "stage2intro":
        return <Stage2Intro top={state.top} onContinue={() => dispatch({ type: "beginStage2" })} />;
      case "stage2": {
        const item = state.items[state.index];
        return (
          <ScaleCard
            item={item}
            index={state.index}
            previous={state.answers[item.id]}
            onAnswer={(value, ms) => dispatch({ type: "answer", value, ms })}
          />
        );
      }
      case "results":
        return state.result ? (
          <ResultsView result={state.result} onRestart={() => dispatch({ type: "restart" })} />
        ) : null;
    }
  })();

  const wide = state.phase === "results";

  return (
    <main className={`mx-auto w-full px-4 sm:px-6 py-8 sm:py-14 flex flex-col gap-8 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
      {state.phase === "intro" || state.phase === "results" ? (
        <div className="flex items-center justify-between gap-3 no-print">
          <span className="font-display text-sm font-extrabold">{c.ui.appShort}</span>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <LangSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      ) : null}
      {header ? <div className="no-print">{header}</div> : null}
      <AnimatePresence>
        {showInsight ? (
          <InsightBanner key={`insight-${insightPoint}`} leader={leaderSoFar(state)} answered={insightPoint!} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {screen}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
