import { Match, Show, Switch, type JSXElement } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";
import {
  NumberSelectionType,
  type GameOptions,
  ContentTypeKind,
  WordsGenerationCategory,
  type ContentType,
  type Languages,
} from "./GameOptions";
import RadioGroup from "../ui/RadioGroup";

import Lang from "../svgs/lang";
import Quote from "../svgs/quote";
import Text from "../svgs/text";
import Customizer from "../svgs/customizer";
import Stopwatch from "../svgs/stopwatch";
import type { Translator } from "../App";

type GameRandomParamsProps = {
  t: Translator;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  children: JSXElement;
};

const GameTimerParams = (props: GameRandomParamsProps) => {
  css`
    .time-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    h3 {
      margin: 0;
      font-weight: 100;
      font-size: 16px;
      text-transform: uppercase;
    }
    .option {
      display: flex;
      justify-content: space-between;
      opacity: 0.6;
      align-items: center;
      width: 100%;
      transition: opacity 0.15s ease-in-out;
    }
    .option:hover {
      opacity: 1;
    }
  `;

  return (
    <div class="time-params">
      <div class="option">
        <h3>{props.t("content")}</h3>
        <RadioGroup
          name="wordsCategory-timer"
          values={[
            {
              label: props.t("words"),
              value: {
                kind: ContentTypeKind.generation,
                category: WordsGenerationCategory.words1k,
              } as ContentType,
              icon: <Text />,
            },
            {
              label: props.t("quotes"),
              value: {
                kind: ContentTypeKind.generation,
                category: WordsGenerationCategory.quotes,
              } as ContentType,
              icon: <Quote />,
            },
            {
              label: props.t("custom"),
              value: { kind: ContentTypeKind.custom } as ContentType,
              icon: <Customizer />,
            },
          ]}
          compare={(v) => {
            switch (props.gameOptions.contentType.kind) {
              case ContentTypeKind.custom:
                return v.kind === ContentTypeKind.custom;
              case ContentTypeKind.generation:
                return (
                  v.kind === ContentTypeKind.generation &&
                  v.category === props.gameOptions.contentType.category
                );
            }
          }}
          setChecked={(value) => {
            if (value.kind === ContentTypeKind.generation) {
              props.setGameOptions("generation", "category", value.category);
            }
            props.setGameOptions("contentType", value);
          }}
        />
      </div>
      <Show
        when={props.gameOptions.contentType.kind !== ContentTypeKind.custom}
      >
        <div class="option">
          <h3> {props.t("language")} </h3>
          <RadioGroup
            name="languages-timer"
            values={[
              { label: props.t("english"), value: "en" as Languages },
              { label: props.t("french"), value: "fr" as Languages },
            ]}
            compare={(v) => v === props.gameOptions.generation.language}
            setChecked={(l) =>
              props.setGameOptions("generation", "language", l)
            }
          >
            <Lang />
          </RadioGroup>
        </div>
      </Show>
      <Switch>
        <Match
          when={props.gameOptions.contentType.kind === ContentTypeKind.custom}
        >
          {props.children}
        </Match>
      </Switch>
      <div class="option">
        <h3>{props.t("timeLimit")}</h3>
        <RadioGroup
        name="time"
        values={[
          { label: "10s", value: 10 },
          { label: "30s", value: 30 },
          { label: "1m", value: 60 },
          { label: "2m", value: 120 },
        ]}
        compare={(v) => v === props.gameOptions.timer.value}
        setChecked={(time) =>
          props.setGameOptions("timer", {
            type: NumberSelectionType.selected,
            value: time,
          })
        }
      >
        <Stopwatch />
      </RadioGroup></div>
    </div>
  );
};

export default GameTimerParams;
