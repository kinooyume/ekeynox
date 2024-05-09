import {
  createSignal,
  Show,
  For,
  Switch,
  Match,
  createComputed,
  createEffect,
  on,
  onMount,
} from "solid-js";
import type { Translator } from "../App";
import {
  deepCopy,
  type ContentGeneration,
  type GameOptions,
} from "../gameMode/GameOptions";
import { css } from "solid-styled";
import { createStore } from "solid-js/store";
import type { CustomInputRef } from "../ui/CustomInput";
import GameOptionsRecap from "../gameMode/GameOptionsRecap";
import { GameModeKind, gameModesArray } from "../gameMode/GameMode";
import SpeedParamsMedium from "../gameMode/SpeedParamsMedium";
import TimerParamsMedium from "../gameMode/TimerParamsMedium";
import CustomInput from "../ui/CustomInput";
import anime from "animejs";

type HeaderNavLeftProps = {
  t: Translator;
  gameOptions: GameOptions;
  start: (opts: GameOptions, customSource: string) => void;
  setContentGeneration: (type: ContentGeneration) => void;
};

const HeaderNavLeft = (props: HeaderNavLeftProps) => {
  css`
    .cursor {
      opacity: 0;
      corsor: pointer;

      position: absolute;
      right: 16px;
      top: 14px;
      pointer-events: none;
      color: var(--background-color);
      color: var(--text-secondary-color);
      transition: all 0.2s ease-in-out;
      z-index: 206;
    }

    .header-mode {
      height: 48px;
      display: flex;
      gap: 18px;
    }

    .options-recap {
      display: flex;
    }

    .dropdown-wrapper {
      position: relative;
      margin-left: 12px;
      width: 200px;
      display: block;
      min-width: 200px;
      z-index: 205;
      height: 48px;
    }

    .dropdown-wrapper:hover .cursor {
      opacity: 1;
    }

    .dropdown {
      overflow: hidden;
      position: absolute;
      width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      border: 1px solid transparent;
      background-color: var(--color-surface-100);
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0.48, 1.08, 0.5, 0.63);
      transition-property: opacity, transform;
    }

    .dropdown:hover {
      border-radius: 12px;
      border: 1px solid var(--background-color);
    }
    .dropdown-wrapper.open .dropdown {
      width: 800px;
      border-radius: 12px;
      height: unset;
      padding: 8px 26px 26px;
      top: -8px;
      border: 1px solid var(--background-color);
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

    .modes {
      list-style-type: none;
      width: 180px;
      padding: 0;
      padding-left: 12px;
      margin: 8px 0;
      margin-right: 12px;
    }

    .modes li {
      display: flex;
      padding: 0;
      margin: 0;
    }

    .modes .selected label:before {
      max-width: 20px;

      opacity: 1;
    }
    .select {
      display: none;
    }

    label {
      width: 100%;
      height: 24px;
      border-radius: 12px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      user-select: none;
      transition: all 0.2s ease-in-out;

      cursor: pointer;
    }

    .selected label .title {
      font-weight: 800;
    }

    .title {
      font-size: 14px;
      font-weight: 400;
      margin: 0;
      margin-left: 16px;
      color: var(--text-color);
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
      padding: 4px;
      width: 70px;
      margin: 8px;
      cursor: pointer;
      transition: all 100ms linear;
    }

    .dropdown-label {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60px;
    }

    .menu-title {
      display: flex;
      font-size: 18px;
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 30px;
      max-height: 40px;
      padding: 8px;
      padding-left: 20px;
      align-items: center;
      cursor: pointer;
      content: attr(data-passive);
    }

    .menu-title:before {
      position: absolute;
      color: var(--text-color);

      color: var(--text-secondary-color);
      content: attr(data-passive);
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.2s ease;
    }
    .menu-title:after {
      position: absolute;
      color: var(--text-color);
      color: var(--text-secondary-color);
      top: 150px;
      content: attr(data-active);
      transition: all 0.3s ease;
    }

    .open .menu-title {
      font-size: 19px;
    }
    .open menu-title:before {
      display: none;
    }
    .dropdown-wrapper.open .menu-title:before,
    .dropdown-wrapper:hover .menu-title:before {
      top: -50%;
      transform: rotate(5deg);
    }
    .dropdown-wrapper.open .menu-title:after,
    .dropdown-wrapper:hover .menu-title:after {
      top: 50%;
      transform: translateY(-50%);
    }

    .bullet-wrapper {
      position: absolute;
      overflow: hidden;
      width: 14px;
      height: 14px;
    }

    .bullet-wrapper::after {
      content: "";
      display: flex;
      justify-self: center;
      border-radius: 50%;
      position: relative;
      background-color: var(--text-color);
      width: calc(100% / 2);
      height: calc(100% / 2);
      top: var(--y, 100%);

      transition: top 0.3s cubic-bezier(0.48, 1.97, 0.5, 0.63);
    }

    .selected .bullet-wrapper:after {
      --y: 18%;
      opacity: 1;
      animation: stretch-animate 0.3s ease-out 0.17s;
    }

    .selected + li .bullet-wrapper:after {
      --y: -100%;
    }
    .dropdown-content {
      display: flex;
    }
    .options-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-left: 1px solid var(--border-color);
      padding: 0 26px 26px;
      margin-bottom: 26px;
      width: 500px;
    }
  `;

  enum DropdownState {
    none = "",
    open = "open",
    selected = "selected",
  }

  const [downState, setDownState] = createSignal<DropdownState>(
    DropdownState.none,
  );

  const [pendingAnimation, setPendingAnimation] = createSignal(false);
  const [mouseHover, setMouseHover] = createSignal(false);

  const clickHandler = () => {
    if (downState() === DropdownState.open) {
      setDownState(DropdownState.none);
    } else {
      setDownState(DropdownState.open);
    }
  };

  /* Animation */
  let dropdown: HTMLDivElement;
  let dropContent: HTMLDivElement;
  let optionsWrapper: HTMLDivElement;
  let optionsElem: HTMLDivElement;
  let menuTitle: HTMLDivElement;
  let modesElem: HTMLUListElement;

  let openAnimation: anime.AnimeInstance;
  let closeAnimation: anime.AnimeInstance;
  onMount(() => {
    closeAnimation = anime
      .timeline({
        easing: "easeOutCubic",
        autoplay: false,
        reverse: true,
      })
      .add({
        targets: dropdown,
        padding: ["8px 26px 26px", "0"],
        top: ["-8px", "0"],
        width: ["800px", "200px"],
        duration: 250,
      })
      .add(
        {
          targets: dropContent,
          height: [280, 0],
          duration: 250,
        },
        "-=150",
      )
      .add(
        {
          targets: [...modesElem.children, ...optionsWrapper.children],
          translateY: [0, 20],
          opacity: [1, 0],
          duration: 160,
          delay: (el, i, l) => i * 120,
        },
        "-=600",
      );

    openAnimation = anime
      .timeline({
        easing: "easeOutElastic(3, 0.8)",
        autoplay: false,
      })
      .add({
        targets: dropdown,
        easing: "easeOutElastic(6, 0.7)",
        padding: ["0", "8px 26px 26px"],
        top: ["0", "-8px"],
        width: ["200px", "800px"],
        duration: 750,
      })
      .add(
        {
          targets: dropContent,
          easing: "easeOutElastic(2, 0.7)",
          height: [0, 280],
          duration: 850,
        },
        "-=650",
      )
      .add(
        {
          targets: [...modesElem.children, ...optionsWrapper.children],
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 300,
          delay: (el, i, l) => i * 120,
        },
        "-=725",
      );
  });

  createEffect(
    on(
      downState,
      (state) => {
        switch (state) {
          case DropdownState.open:
            openAnimation.finished.then(() => {
              setPendingAnimation(false);
              if (!mouseHover()) setDownState(DropdownState.none);
            });
            setPendingAnimation(true);
            openAnimation.play();
            break;
          case DropdownState.none:
            closeAnimation.finished.then(() => {
              setPendingAnimation(false);
            });
            setPendingAnimation(true);
            closeAnimation.play();
            break;
        }
      },
      { defer: true },
    ),
  );

  /*
   * HOVER
   */

  /* *** */
  /* doublon, manage temporal gameOptions */

  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  createComputed(
    () => {
      props.setContentGeneration({
        language: gameOptions.generation.language,
        category: gameOptions.generation.category,
      });
    },
    { defer: true },
  );

  const customRef: CustomInputRef = {
    ref: undefined,
  };

  createEffect(
    on(mouseHover, (hover) => {
      if (pendingAnimation() || hover) return;
      setDownState(DropdownState.none);
    }),
  );

  /* *** */

  const start = () => {
    setDownState(DropdownState.none);
    props.start(gameOptions, customRef.ref ? customRef.ref.value : "");
  };

  return (
    <div class="header-mode">
      <div
        ref={(el) => {
          el.addEventListener("mouseleave", () => setMouseHover(false));
          el.addEventListener("mouseenter", () => setMouseHover(true));
        }}
        class={`dropdown-wrapper ${downState()}`}
      >
        <div class="dropdown" ref={dropdown!}>
          <div class="dropdown-label">
            <div
              class="menu-title"
              ref={menuTitle!}
              onClick={clickHandler}
              data-passive={`${props.t("gameMode")[gameOptions.modeSelected].subtitle}`}
              data-active={`${props.t("newGame.one")} ${props.t("newGame.two")}`}
            >
              <Show when={downState() !== DropdownState.open}>
                <span class="cursor">▼</span>
              </Show>
            </div>
          </div>
          <div ref={dropContent!} class="dropdown-content">
            <ul ref={modesElem!} class="modes">
              <For each={gameModesArray}>
                {([modeKind, mode]) => (
                  <li
                    class={`radio ${modeKind}`}
                    classList={{
                      selected: gameOptions.modeSelected === modeKind,
                    }}
                  >
                    <input
                      type="radio"
                      name="mode"
                      class="select"
                      id={modeKind}
                      checked={gameOptions.modeSelected === modeKind}
                      onChange={() => setGameOptions("modeSelected", modeKind)}
                    />
                    <label for={modeKind}>
                      {/* <div class="icon"> {mode.head()}</div> */}
                      {/* <div class="description"> */}

                      <div class="bullet-wrapper"></div>
                      <p class="title">
                        {props.t("gameMode")[modeKind].subtitle}
                      </p>
                      {/* </div> */}
                    </label>
                  </li>
                )}
              </For>
            </ul>
            <div ref={optionsWrapper!} class="options-wrapper">
              <div ref={optionsElem!} class="options">
                <Switch>
                  <Match when={gameOptions.modeSelected === GameModeKind.speed}>
                    <SpeedParamsMedium
                      t={props.t}
                      gameOptions={gameOptions}
                      setGameOptions={setGameOptions}
                    >
                      <CustomInput
                        value={customRef.ref ? customRef?.ref.value : ""}
                        customInput={customRef}
                      />
                    </SpeedParamsMedium>
                  </Match>
                  <Match when={gameOptions.modeSelected === GameModeKind.timer}>
                    <TimerParamsMedium
                      t={props.t}
                      gameOptions={gameOptions}
                      setGameOptions={setGameOptions}
                    >
                      <CustomInput
                        value={customRef.ref ? customRef?.ref.value : ""}
                        customInput={customRef}
                      />
                    </TimerParamsMedium>
                  </Match>
                </Switch>
              </div>
              <div class="actions">
                <button onClick={start} class="primary">
                  {props.t("letsGo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="options-recap">
        <GameOptionsRecap gameOptions={props.gameOptions} t={props.t} />
      </div>
    </div>
  );
};

export default HeaderNavLeft;
