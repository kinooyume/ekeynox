import { Match, Show, Switch, type JSXElement } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";
import {
  NumberSelectionType,
  type Translator,
  type GameOptions,
  ContentTypeKind,
  WordsGenerationCategory,
  type ContentType,
  type Languages,
} from "../App";
import RadioGroup from "../ui/RadioGroup";

import Lang from "../svgs/lang";
import Quote from "../svgs/quote";
import Text from "../svgs/text";
import Customizer from "../svgs/customizer";
import Stopwatch from "../svgs/stopwatch";

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
  `;

  return (
    <div class="time-params">
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
      </RadioGroup>
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
      <Show
        when={props.gameOptions.contentType.kind !== ContentTypeKind.custom}
      >
        <RadioGroup
          name="languages-timer"
          values={[
            { label: props.t("english"), value: "en" as Languages },
            { label: props.t("french"), value: "fr" as Languages },
          ]}
          compare={(v) => v === props.gameOptions.generation.language}
          setChecked={(l) => props.setGameOptions("generation", "language", l)}
        >
          <Lang />
        </RadioGroup>
      </Show>
      <Switch>
        <Match
          when={props.gameOptions.contentType.kind === ContentTypeKind.custom}
        >
          {props.children}
        </Match>
      </Switch>
    </div>
  );
};

export default GameTimerParams;
