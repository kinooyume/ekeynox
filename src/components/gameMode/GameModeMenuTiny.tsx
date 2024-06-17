import {
  onCleanup,
  Switch,
  Match,
  createComputed,
} from "solid-js";
import { css } from "solid-styled";
import { createStore } from "solid-js/store";
import SpeedParamsCompact from "./SpeedParamsCompact";
import TimerParamsCompact from "./TimerParamsCompact";
import CustomInput, { type CustomInputRef } from "../ui/CustomInput";
// import GameModeDropdown from "./GameModeDropdown";
import {
  makeRedoContent,
} from "../content/TypingGameSource";
import Content from "../content/Content";
import type { Metrics, MetricsResume } from "../metrics/Metrics";
import { ContentGeneration, GameOptions, deepCopy } from "~/gameOptions/gameOptions";
import { PendingMode } from "~/appState/appState";
import { GameModeKind } from "~/gameOptions/gameModeKind";
import { useI18n } from "~/settings/i18nProvider";

type GameModeSelectionProps = {
  gameOptions: GameOptions;
  content: PendingMode;
  metrics: Metrics;
  metricsResume: MetricsResume;
  setContentGeneration: (type: ContentGeneration) => void;
  start: (opts: GameOptions, customSource: string) => void;
  redo: (content: PendingMode, metrics: MetricsResume) => void;
};

const GameModeSelectionTiny = (props: GameModeSelectionProps) => {
  const t = useI18n();
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  const restart = () => {
    const redoContent = {
      ...props.content,
      getContent: makeRedoContent(
        Content.contentDataFromParagraphs(
          Content.deepCloneReset(props.metrics.paragraphs),
          props.metrics.wordsCount,
        ),
        props.content.getContent,
      ),
    };
    props.redo(redoContent, props.metricsResume);
  };
  // was createEffect
  createComputed(() => {
    props.setContentGeneration({
      language: gameOptions.generation.language,
      category: gameOptions.generation.category,
    });
  });
  css`
    .mode-selection {
      width: 400px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .info {
      margin-bottom: 1rem;
    }
  `;

  onCleanup(() =>
    labelRef.forEach((el) => {
      el.removeEventListener("mouseenter", () => {});
      el.removeEventListener("mouseleave", () => {});
    }),
  );

  let labelRef: Array<HTMLLabelElement> = [];

  const start = () => {
    props.start(gameOptions, customRef.ref ? customRef.ref.value : "");
  };

  const customRef: CustomInputRef = {
    ref: undefined,
  };
  return (
    <div class="mode-selection">
      {/* <GameModeDropdown */}
      {/*   t={t} */}
      {/*   gameOptions={gameOptions} */}
      {/*   setGameOptions={setGameOptions} */}
      {/* /> */}
      <div class="info">
        <Switch>
          <Match when={gameOptions.modeSelected === GameModeKind.speed}>
            <SpeedParamsCompact
              gameOptions={gameOptions}
              setGameOptions={setGameOptions}
            >
              <CustomInput
                value={customRef.ref ? customRef?.ref.value : ""}
                customInput={customRef}
              />
            </SpeedParamsCompact>
          </Match>
          <Match when={gameOptions.modeSelected === GameModeKind.timer}>
            <TimerParamsCompact
              gameOptions={gameOptions}
              setGameOptions={setGameOptions}
            >
              <CustomInput
                value={customRef.ref ? customRef?.ref.value : ""}
                customInput={customRef}
              />
            </TimerParamsCompact>
          </Match>
        </Switch>
      </div>
      <div class="actions">
        <button class="secondary" onClick={restart}>
          {t("playAgain")}
        </button>
        <button class="primary" onClick={start}>
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default GameModeSelectionTiny;
