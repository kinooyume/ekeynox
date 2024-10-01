import { For, onCleanup, createSignal, Show } from "solid-js";
import { css } from "solid-styled";
import ChooseClip from "../svgs/choose-clip";
import { TransitionGroup } from "solid-transition-group";
import { gameModesArray } from "./GameMode";
import { useI18n } from "~/contexts/i18nProvider";
import { GameModeKind } from "~/gameOptions/gameModeKind";

type GameModeSelectionProps = {
  selected: GameModeKind;
  setSelected: (mode: GameModeKind) => void;
};

const GameModeSelection = (props: GameModeSelectionProps) => {
  const t = useI18n();
  css`
    .mode-selection {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      max-width: 400px;
      max-height: 100px;
      height: 100%;
      width: 100%;
    }

    .info {
      margin-right: auto;
      margin-left: 1rem;
    }

    .info .title {
      font-size: 1.4rem;
      font-weight: 200;
      margin: 0;
    }

    .info .description {
      margin-top: 4px;
      font-size: 1rem;
      text-transform: capitalize;
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
      filter: grayscale(50%);
      display: block;
      border-radius: 50%;
      height: 54px;
      width: 54px;
      cursor: pointer;
      background-color: var(--text-secondary-color);
      overflow: hidden;
      transition: all 100ms linear;
    }

    label .icon {
      position: absolute;
      left: -4px;
      top: 6px;
      width: 62px;
      height: 62px;
      transition: all 100ms linear;
    }

    input:checked + label {
      background-color: var(--color-primary-400);
      filter: none;
    }
    @media screen and (min-width: 860px) {
      input + label:hover {
        filter: none;
        background-color: var(--color-primary-100);
        transform: scale(1.3);
        overflow: visible;
      }

      label:hover .icon {
        transform: translateY(-6px);
        left: -5px;
        height: 64px;
        width: 64px;
      }
    }
    .radio {
    }
    .select {
      display: none;
    }
    @media screen and (max-width: 860px) {
      .mode-selection {
        align-items: flex-start;
      }
      .info {
        display: none;
      }
    }
  `;

  // TODO: better handler mobile stuff (don't show .info)
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
            <p class="title">
              {t("gameMode")[labelHovered() as GameModeKind].subtitle}
            </p>
            <p class="description">
              {t("gameMode")[labelHovered() as GameModeKind].title}
            </p>
          </Show>
        </TransitionGroup>
      </div>
      <div class="modes">
        <For each={gameModesArray}>
          {([modeKind, mode]) => (
            <div class={`radio ${modeKind}`}>
              <input
                type="radio"
                name={modeKind}
                class="select"
                id={modeKind}
                checked={props.selected === modeKind}
                onChange={() => props.setSelected(modeKind)}
              />
              <label
                ref={(el) => {
                  labelRef.push(el);
                  el.addEventListener("mouseenter", () => {
                    setLabelHovered(modeKind);
                  });
                  el.addEventListener("mouseleave", () => {
                    if (labelHovered() === modeKind) setLabelHovered(null);
                  });
                }}
                for={modeKind}
              >
                <div class="icon"> {mode.head()}</div>
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
