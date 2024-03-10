import { For, onCleanup, type JSXElement, createSignal, Show } from "solid-js";
import { css } from "solid-styled";
import type { GameMode, Translator } from "./App";
import ChooseClip from "./ui/choose-clip";
import Bunny from "./ui/bunny";
import { Transition, TransitionGroup } from "solid-transition-group";

type GameModePicto = Record<GameMode, JSXElement>;

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
  modes: Record<GameMode, GameModePreview>;
  selected: GameMode;
  setSelected: (mode: GameMode) => void;
};

const GameModeSelection = (props: GameModeSelectionProps) => {
  css`
    .mode-selection {
      width: 400px;
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }

    .info {
      margin-right: auto;
      margin-left: 1rem;
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
    .main-view {
      width: 100%;
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
  const [labelHovered, setLabelHovered] = createSignal<GameMode | null>(null);

  return (
    <div class="mode-selection">
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
          <Show when={labelHovered() !== null}>
            <p class="title">{props.modes[labelHovered() as GameMode].title}</p>
            <p class="description">
              {props.modes[labelHovered() as GameMode].subtitle}
            </p>
          </Show>
        </TransitionGroup>
      </div>
      <div class="modes">
        <For each={Object.keys(props.modes)}>
          {(modeKey) => (
            <div class={`radio ${modeKey}`}>
              <input
                type="radio"
                name="mode"
                class="select"
                id={modeKey}
                checked={props.selected === modeKey}
                onChange={() => props.setSelected(modeKey as GameMode)}
              />
              <label
                ref={(el) => {
                  labelRef.push(el);
                  el.addEventListener("mouseenter", () => {
                    setLabelHovered(modeKey as GameMode);
                  });
                  el.addEventListener("mouseleave", () => {
                    if (labelHovered() === modeKey) setLabelHovered(null);
                  });
                }}
                for={modeKey}
              >
                <div class="icon"> {pictos[modeKey as GameMode]}</div>
              </label>
            </div>
          )}
        </For>
      </div>
      <ChooseClip></ChooseClip>
    </div>
  );
};

export default GameModeSelection;
