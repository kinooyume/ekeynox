import { For, onCleanup, createSignal, Show } from "solid-js";
import { css } from "solid-styled";
import ChooseClip from "~/svgs/choose-clip";
import { TransitionGroup } from "solid-transition-group";
import { typingModesArray } from "~/typingOptions/typingMode";
import { useI18n } from "~/contexts/i18nProvider";
import { TypingModeKind } from "~/typingOptions/typingModeKind";

type TypingModeSelectionProps = {
  selected: TypingModeKind;
  setSelected: (mode: TypingModeKind) => void;
};

const TypingModeSelection = (props: TypingModeSelectionProps) => {
  const t = useI18n();
  css`
    .mode-selection {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      max-width: 400px;
      max-height: 100px;
      height: 100%;
      width: 100%;
      --label-size: 74px;
      --label-scale-hover: 1.1;
      --label-icon-size: 62px;
      --label-icon-size-hover: 74px;
      --label-icon-top: 14px;
      --label-icon-left: 6px;
      --label-icon-transform-hover: -8px;
      --label-icon-left-hover: 0px;
      --label-gap: 1.4rem;

      --info-padding-top: 18px;
      --info-margin-left: 1rem;
      --info-title-font-size: 1.4rem;
      --info-description-font-size: 1rem;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      margin-right: auto;
      margin-left: var(--info-margin-left);
      padding-top: var(--info-padding-top);
    }

    .info .title {
      font-size: var(--info-title-font-size);
      font-weight: 200;
      margin: 0;
    }

    .info .description {
      margin-top: 4px;
      font-size: var(--info-description-font-size);
      text-transform: capitalize;
      color: var(--text-secondary-color);
    }
    .main-view {
      width: 100%;
    }

    .modes {
      display: flex;
      gap: var(--label-gap);
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
    }

    label {
      position: relative;
      display: block;
      border-radius: 30%;
      height: var(--label-size);
      width: var(--label-size);
      cursor: pointer;
      background-color: var(--background-radiogroup);
      border: 1px solid var(--background-color);
      overflow: hidden;
      transition: all 100ms linear;
    }

    label .overlay {
      display: none;
      position: absolute;
      background-color: var(--background-radiogroup);
      opacity: 0.2;
      height: var(--label-size);
      width: var(--label-size);
    }
    label .icon {
      position: absolute;
      filter: sepia(100%) hue-rotate(4deg) saturate(157.7%) contrast(75.2%);
      filter: sepia(100%) hue-rotate(30deg) saturate(76%) brightness(62%);
      filter: sepia(100%) grayscale(20%);
      left: var(--label-icon-left);
      top: var(--label-icon-top);
      height: var(--label-icon-size);
      width: var(--label-icon-size);
      transition: all 100ms linear;
    }

    input:checked + label {
      background-color: var(--color-primary-400);
    }
    input:checked + label .icon {
      filter: none;
    }

    @media screen and (min-width: 860px) {
      input + label:hover {
        background-color: var(--color-primary-600) !important;
        transform: scale(var(--label-scale-hover));
        overflow: visible;
      }

      label:hover .icon {
        filter: none;
        transform: translateY(var(--label-icon-transform-hover));
        left: var(--label-icon-left-hover);
        height: var(--label-icon-size-hover);
        width: var(--label-icon-size-hover);
      }
    }
    .radio {
    }
    .select {
      display: none;
    }

    @media screen and (max-width: 1280px) {
      .mode-selection {
        --info-margin-left: 2.2rem;
      }
    }

    @media screen and (max-width: 1210px) {
      .mode-selection {
        --label-size: 54px;
        --label-scale-hover: 1.3;
        --label-icon-size: 62px;
        --label-icon-size-hover: 64px;
        --label-icon-top: 6px;
        --label-icon-left: -4px;
        --label-icon-transform-hover: -6px;
        --label-icon-left-hover: -5px;
        --label-gap: 1rem;
        --info-padding-top: 18px;
        --info-title-font-size: 1.2rem;
        --info-description-font-size: 0.8rem;
      }
    }

    @media screen and (max-width: 990px) {
      .mode-selection {
        justify-content: flex-end;
      }
      .info {
        display: none;
      }
    }

    @media screen and (max-width: 860px) {
      .mode-selection {
        align-items: flex-start;
        --label-size: 48px;
        --label-icon-size: 48px;
        --label-icon-top: 8px;
        --label-icon-left: 0px;
        --label-gap: 0.9rem;
      }
      .info {
        display: none;
      }
    }

    @media screen and (max-width: 860px) and (max-height: 680px) {
      .mode-selection {
        --label-size: 42px;
        --label-icon-size: 42px;
        --label-icon-top: 6px;
        --label-icon-left: 0px;
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
  const [labelHovered, setLabelHovered] = createSignal<TypingModeKind | null>(
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
              {t("typingMode")[labelHovered() as TypingModeKind].subtitle}
            </p>
            <p class="description">
              {t("typingMode")[labelHovered() as TypingModeKind].title}
            </p>
          </Show>
        </TransitionGroup>
      </div>
      <fieldset class="modes" aria-label="Game mode selection" role="group">
        <For each={typingModesArray}>
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
                <div class="overlay"></div>
              </label>
            </div>
          )}
        </For>
      </fieldset>
      <ChooseClip></ChooseClip>
    </div>
  );
};

export default TypingModeSelection;
