import { Show, createSignal, For } from "solid-js";
import type { Translator } from "../App";
import { type GameOptions } from "./GameOptions";
import type { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";
import { gameModesArray } from "./GameMode";

// NOTE: Similr to HeaderMode
type GameModeÐropdownProps = {
  t: Translator;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
};

const GameModeDropdown = (props: GameModeÐropdownProps) => {
  css`
    .cursor {
      font-size: 1.5rem;
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
      text-transform: capitalize;
      font-size: 1.4rem;
      font-weight: 200;
      margin: 0;
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
              classList={{ selected: props.gameOptions.modeSelected === modeKind }}
            >
              <input
                type="radio"
                name="mode"
                class="select"
                id={modeKind}
                checked={props.gameOptions.modeSelected === modeKind}
                onChange={() => props.setGameOptions("modeSelected", modeKind)}
              />
              <label for={modeKind} onClick={clickHandler}>
                <div class="icon"> {mode.head()}</div>
                <div class="description">
                  <p class="title">{props.t("gameMode")[modeKind].title}</p>
                  <p class="description">
                    {props.t("gameMode")[modeKind].subtitle}
                  </p>
                </div>
              </label>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default GameModeDropdown;
