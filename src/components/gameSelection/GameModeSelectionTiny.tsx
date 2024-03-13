import {
  For,
  onCleanup,
  type JSXElement,
  createSignal,
  Switch,
  Match,
} from "solid-js";
import { css } from "solid-styled";
import { GameModeKind, type GameOptions, type Translator } from "../App";
import Bunny from "../svgs/bunny";
import { TransitionGroup } from "solid-transition-group";
import { createStore } from "solid-js/store";
import GameRandomParams from "./GameRandomParams";
import GameTimerParams from "./GameTimerParams";
import CustomInput, { type CustomInputRef } from "../ui/CustomInput";

type GameModePicto = Record<GameModeKind, JSXElement>;

const pictos: GameModePicto = {
  monkey: <Bunny />,
  rabbit: <Bunny />,
};

type GameModePreview = {
  title: string;
  description: string;
  subtitle: string;
};

type GameModeSelectionProps = {
  t: Translator;
  modes: Record<GameModeKind, GameModePreview>;
  gameOptions: GameOptions;
  setGameOptions: (options: GameOptions) => void;
};

const GameModeSelectionTiny = (props: GameModeSelectionProps) => {
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    props.gameOptions,
  );

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

    .info .title {
      text-transform: capitalize;
      font-size: 1.4rem;
      font-weight: 200;
      margin: 0;
    }

    .info .description {
      margin-top: 4px;
      font-size: 1rem;
      color: var(--text-secondary-color);
    }
    .modes {
      display: flex;
      gap: 1rem;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
    }
    label {
      position: relative;
      display: block;
      border-radius: 50%;
      height: 46px;
      width: 46px;
      cursor: pointer;
      background-color: var(--color-surface-300);
      overflow: hidden;
      transition: all 100ms linear;
    }

    label .icon {
      position: absolute;
      bottom: -10px;
      right: -3px;
      width: 50px;
      height: 50px;
      transition: all 100ms linear;
    }

    input:checked + label {
      background-color: var(--color-primary-400);
    }
    input + label:hover {
      background-color: var(--color-primary-100);
      transform: scale(1.2);
      overflow: visible;
    }

    label:hover .icon {
      transform: translateY(-8px);
    }

    .radio {
    }
    .select {
      display: none;
    }
  `;

  onCleanup(() =>
    labelRef.forEach((el) => {
      el.removeEventListener("mouseenter", () => {});
      el.removeEventListener("mouseleave", () => {});
    }),
  );

  let labelRef: Array<HTMLLabelElement> = [];
  const [labelHovered, setLabelHovered] = createSignal<GameModeKind | null>(
    null,
  );

  const customRef: CustomInputRef = {
    ref: undefined,
  };
  return (
    <div class="mode-selection">
      <div class="modes">
        <For each={Object.keys(props.modes) as GameModeKind[]}>
          {(modeKey) => (
            <div class={`radio ${modeKey}`}>
              <input
                type="radio"
                name="mode"
                class="select"
                id={modeKey}
                checked={gameOptions.mode === modeKey}
                onChange={() => setGameOptions("mode", modeKey)}
              />
              <label
                ref={(el) => {
                  labelRef.push(el);
                  el.addEventListener("mouseenter", () => {
                    setLabelHovered(modeKey as GameModeKind);
                  });
                  el.addEventListener("mouseleave", () => {
                    if (labelHovered() === modeKey) setLabelHovered(null);
                  });
                }}
                for={modeKey}
              >
                <div class="icon"> {pictos[modeKey as GameModeKind]}</div>
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="info">
        <TransitionGroup
          onEnter={(el, done) => {
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 160,
            });
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 0,
            });
            a.finished.then(done);
          }}
        >
          <p class="title">
            {props.modes[labelHovered() || gameOptions.mode].title}
          </p>
          <p class="description">
            {props.modes[labelHovered() || gameOptions.mode].subtitle}
          </p>
        </TransitionGroup>
        <Switch>
          <Match when={gameOptions.mode === GameModeKind.monkey}>
            <GameRandomParams
              words={gameOptions.wordNumber}
              language={gameOptions.language}
              wordsCategory={gameOptions.wordsCategory}
              setWords={(words) => setGameOptions("wordNumber", words)}
              setLanguage={(language) => setGameOptions("language", language)}
              setWordsCategory={(wordsCategory) =>
                setGameOptions("wordsCategory", wordsCategory)
              }
              t={props.t}
            >
              <CustomInput
                value={customRef.ref ? customRef?.ref.value : ""}
                customInput={customRef}
              />
            </GameRandomParams>
          </Match>
          <Match when={gameOptions.lastGameMode === GameMode.rabbit}>
            <GameTimerParams
              time={gameOptions.time}
              language={gameOptions.language}
              wordsCategory={gameOptions.wordsCategory}
              setTime={(time) => setGameOptions("time", time)}
              setLanguage={(language) => setGameOptions("language", language)}
              setWordsCategory={(wordsCategory) =>
                setGameOptions("wordsCategory", wordsCategory)
              }
              t={props.t}
            >
              <CustomInput
                value={customRef.ref ? customRef?.ref.value : ""}
                customInput={customRef}
              />
            </GameTimerParams>
          </Match>
        </Switch>
      </div>
      <div class="actions">
        <button class="secondary" onClick={props.onReset}>
          {props.t("playAgain")}
        </button>
        <button class="primary" onClick={props.onReset}>
          {props.t("next")}
        </button>
      </div>
    </div>
  );
};

export default GameModeSelectionTiny;
