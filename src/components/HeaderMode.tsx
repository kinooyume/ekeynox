import { createSignal, Show, For, createEffect, on } from "solid-js";
import type { Translator } from "./App";
import type { ContentGeneration, GameOptions } from "./gameMode/GameOptions";
import { css } from "solid-styled";
import { createStore, type SetStoreFunction } from "solid-js/store";
import type { CustomInputRef } from "./ui/CustomInput";
import GameOptionsRecap from "./gameMode/GameOptionsRecap";
import type { GameModeContent } from "./content/TypingGameSource";
import { gameModesArray } from "./gameMode/GameMode";

type HeaderModeProps = {
  t: Translator;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  setContentGeneration: (type: ContentGeneration) => void;
  content: GameModeContent;
};

const HeaderMode = (props: HeaderModeProps) => {
  css`
    .cursor {
      font-size: 1.5rem;
      opacity: 0;
      corsor: pointer;
      position: absolute;
      right: 16px;
      top: 16px;
      pointer-events: none;
      color: var(--background-color);
      z-index: 206;
    }

    .dropdown-wrapper {
      position: relative;
      z-index: 200;
      height: 72px;
      filter: grayscale(60%);
      opacity: 0.4;
      transition: all 0.2s ease-in-out;
    }
    .dropdown-wrapper:hover {
      opacity: 1;
      filter: none;
    }

    .dropdown-wrapper:hover .cursor {
      opacity: 1;
    }

    .dropdown-wrapper.open {
    }

    .dropdown-wrapper.open .dropdown {
      max-height: 200px;

      border: 1px solid var(--background-color);
      transition: all 0.2s ease-in-out;
      box-shadow:
        0.6px 1.8px 2.2px rgba(0, 0, 0, 0.02),
        1.5px 4.3px 5.3px rgba(0, 0, 0, 0.028),
        2.9px 8px 10px rgba(0, 0, 0, 0.035),
        5.1px 14.3px 17.9px rgba(0, 0, 0, 0.042),
        9.6px 26.7px 33.4px rgba(0, 0, 0, 0.05),
        23px 64px 80px rgba(0, 0, 0, 0.07);
    }

    .dropdown-wrapper.open .dropdown label {
      background-color: var(--color-surface-100);
    }
    .dropdown-wrapper.open .dropdown label:hover {
      background-color: var(--background-color);
    }

    .dropdown {
      max-height: 68px;

      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      border: 1px solid transparent;

      border-radius: 12px;
    }

    .dropdown:hover {
      border: 1px solid var(--background-color);
    }

    .select {
      display: none;
    }

    .radio {
      order: 1;
    }

    .radio.selected {
      order: 0;
    }

    label {
      width: 300px;
      display: flex;
      align-items: center;
      gap: 1rem;
      user-select: none;

      cursor: pointer;
    }

    .title {
      font-size: 20px;
      font-weight: 200;
      margin: 0 0 4px;
    }

    .description {
      margin: 0;
      font-size: 1rem;
      color: var(--text-secondary-color);
    }

    .icon {
      display: flex;
      border-radius: 50%;
      height: 60px;
      width: 60px;
      padding: 8px;
      cursor: pointer;
      transition: all 100ms linear;
    }
  `;

  enum DropdownState {
    none = "",
    open = "open",
    selected = "selected",
  }

  // NOTE: convert it to type variant, and make an article about making it

  const [downState, setDownState] = createSignal<DropdownState>(
    DropdownState.none,
  );

  const clickHandler = () => {
    if (downState() === DropdownState.open) {
      setDownState(DropdownState.selected);
    } else {
      setDownState(DropdownState.open);
    }
  };

  /* doublon, manage temporal gameOptions */

  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    props.gameOptions,
  );

  createEffect(
    on(
      () => gameOptions,
      () => {
        props.setContentGeneration({
          language: gameOptions.generation.language,
          category: gameOptions.generation.category,
          infinite: gameOptions.generation.infinite,
        });
      },
      { defer: true },
    ),
  );

  const customRef: CustomInputRef = {
    ref: undefined,
  };

  /* *** */

  return (
    <div class={`dropdown-wrapper ${downState()}`}>
      <div
        class="dropdown"
        ref={(el) => {
          el.addEventListener("mouseleave", () =>
            setDownState(DropdownState.none),
          );
        }}
      >
        <Show when={downState() !== DropdownState.open}>
          <span class="cursor">▼</span>
        </Show>
        <For each={gameModesArray}>
          {([modeKind, mode]) => (
            <div
              class={`radio ${modeKind}`}
              classList={{ selected: props.gameOptions.mode === modeKind }}
            >
              <input
                type="radio"
                name="mode"
                class="select"
                id={modeKind}
                checked={props.gameOptions.mode === modeKind}
                onChange={() => props.setGameOptions("mode", modeKind)}
              />
              <label for={modeKind} onClick={clickHandler}>
                <div class="icon"> {mode.head()}</div>
                <div class="description">
                  <p class="title">{props.t("gameMode")[modeKind].subtitle}</p>
                  <GameOptionsRecap gameOptions={gameOptions} t={props.t} />
                </div>
              </label>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default HeaderMode;
