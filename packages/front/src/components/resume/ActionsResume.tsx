import { Show } from "solid-js";
import { css } from "solid-styled";

import { useWindowSize } from "@solid-primitives/resize-observer";

import { useI18n } from "~/contexts/i18nProvider";

import {
  type ContentGeneration,
  type TypingOptions,
  deepCopy,
} from "~/typingOptions/typingOptions";
import { TypingGameOptions } from "~/typingOptions/typingGameOptions";

import { makeRedoContent } from "~/typingContent/TypingGameSource";
import Content from "~/typingContent";

import type { TypingStatistics, MetricsResume } from "~/typingStatistics";

import Ghost from "~/svgs/ghost";
import GameModeDropdown from "../typingMode/TypingModeDropdown";
import { clearParagraphs } from "~/typingContent/paragraphs";

type ActionsResumeProps = {
  gameOptions: TypingOptions;
  content: TypingGameOptions;
  metrics: TypingStatistics;
  metricsResume: MetricsResume;
  fetchSourcesGen: (opts: ContentGeneration) => Promise<Array<string>>;
  start: (opts: TypingOptions) => void;
  redo: (
    mode: TypingGameOptions,
    metrics: MetricsResume,
    options: TypingOptions,
  ) => void;
};

const ActionsResume = (props: ActionsResumeProps) => {
  const t = useI18n();

  const restart = (opts: TypingOptions) => {
    const redoContent = {
      ...props.content,
      getContent: makeRedoContent(
        Content.contentDataFromParagraphs(
          clearParagraphs(props.metrics.paragraphs),
          props.metrics.wordsCount,
        ),
        props.content.getContent,
      ),
    };
    props.redo(redoContent, props.metricsResume, deepCopy(opts));
  };

  const start = (opts: TypingOptions) => {
    props.start(deepCopy(opts));
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

    .secondary {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .secondary span {
      color: var(--text-secondary-color);
    }
  `;

  const size = useWindowSize();

  return (
    <div class="actions">
      <Show when={size.width > 740}>
        <GameModeDropdown {...props} start={start} reverse={true}>
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
      </Show>
      <button class="secondary" onClick={() => restart(props.gameOptions)}>
        <Ghost /> <span>{t("playAgain")}</span>
      </button>
      <button class="primary" onClick={() => start(props.gameOptions)}>
        {t("next")}
      </button>
    </div>
  );
};

export default ActionsResume;
