import { Show } from "solid-js";
import { css } from "solid-styled";
import Content from "../content/Content";
import { makeRedoContent } from "../content/TypingGameSource";
import type { Metrics, MetricsResume } from "../metrics/Metrics";
import type { CustomInputRef } from "../ui/CustomInput";
import GameModeDropdown from "../gameMode/GameModeDropdown";
import { ContentGeneration, GameOptions } from "~/gameOptions/gameOptions";
import { PendingMode } from "~/appState/appState";
import { useI18n } from "~/settings/i18nProvider";

type ActionsResumeProps = {
  gameOptions: GameOptions;
  content: PendingMode;
  metrics: Metrics;
  metricsResume: MetricsResume;
  setContentGeneration: (type: ContentGeneration) => void;
  start: (opts: GameOptions, customSource: string) => void;
  redo: (content: PendingMode, metrics: MetricsResume) => void;
};

const ActionsResume = (props: ActionsResumeProps) => {
  const t = useI18n();
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

  const start = () => {
    props.start(props.gameOptions, customRef.ref ? customRef.ref.value : "");
  };

  const customRef: CustomInputRef = {
    ref: undefined,
  };
  css`
    .cursor {
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
    .menu-title {
      display: flex;
      filter: grayscale(20%);
      opacity: 0.8;
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 30px;
      max-height: 40px;
      padding: 8px;
      padding-left: 20px;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .menu-title span {
      font-size: 18px;
      color: var(--text-secondary-color);
    }
    .menu-title.hover,
    menu-title.open {
      filter: none;
      opacity: 1;
    }

    .menu-title.open span {
      font-size: 19px;
      filter: none;
      opacity: 1;
    }

    .actions {
      display: flex;
      align: flex-end;
      gap: 16px;
    }
  `;

  return (
    <div class="actions">
      <GameModeDropdown {...props} reverse={true}>
        {(isOpen, hover) => (
          <div
            class="menu-title"
            classList={{ hover: hover(), open: isOpen() }}
          >
            <span>{`${t("newGame.one")} ${t("newGame.two")}`}</span>
            <Show when={!isOpen()}>
              <span class="cursor">▼</span>
            </Show>
          </div>
        )}
      </GameModeDropdown>
      <button class="secondary" onClick={restart}>
        {t("playAgain")}
      </button>
      <button class="primary" onClick={start}>
        {t("next")}
      </button>
    </div>
  );
};

export default ActionsResume;
