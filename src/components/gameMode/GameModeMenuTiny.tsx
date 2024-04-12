import {
  onCleanup,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import { css } from "solid-styled";
import { type Translator } from "../App";
import { createStore } from "solid-js/store";
import RandomParamsCompact from "./RandomParamsCompact";
import TimerParamsCompact from "./TimerParamsCompact";
import CustomInput, { type CustomInputRef } from "../ui/CustomInput";
import {
  type ContentGeneration,
  type GameOptions,
} from "./GameOptions";
import GameModeDropdown from "./GameModeDropdown";
import type { GameModeContent } from "../content/TypingGameSource";
import { GameModeKind } from "./GameMode";

type GameModeSelectionProps = {
  t: Translator;
  gameOptions: GameOptions;
  content: GameModeContent;
  setContentGeneration: (type: ContentGeneration) => void;
  start: (opts: GameOptions, customSource: string) => void;
  launch: (content: GameModeContent) => void;
};

const GameModeSelectionTiny = (props: GameModeSelectionProps) => {
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    props.gameOptions,
  );

  createEffect(() => {
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
      <GameModeDropdown
        t={props.t}
        gameOptions={gameOptions}
        setGameOptions={setGameOptions}
      />
      <div class="info">
        <Switch>
          <Match when={gameOptions.mode === GameModeKind.random}>
            <RandomParamsCompact
              t={props.t}
              gameOptions={gameOptions}
              setGameOptions={setGameOptions}
            >
              <CustomInput
                value={customRef.ref ? customRef?.ref.value : ""}
                customInput={customRef}
              />
            </RandomParamsCompact>
          </Match>
          <Match when={gameOptions.mode === GameModeKind.timer}>
            <TimerParamsCompact
              t={props.t}
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
        <button class="secondary" onClick={() => props.launch(props.content)}>
          {props.t("playAgain")}
        </button>
        <button class="primary" onClick={start}>
          {props.t("next")}
        </button>
      </div>
    </div>
  );
};

export default GameModeSelectionTiny;
