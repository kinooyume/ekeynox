import { Match, Show, Switch } from "solid-js";
import { css } from "solid-styled";
import {
  CategoryKind,
  WordsGenerationCategory,
  type Category,
  type Languages,
} from "./GameOptions";
import RadioGroup from "../ui/RadioGroup";

import Lang from "../svgs/lang";
import Quote from "../svgs/quote";
import Text from "../svgs/text";
import Customizer from "../svgs/customizer";
import Stopwatch from "../svgs/stopwatch";
import type { GameParams } from "./GameParams";

const TimerParamsCompact = (props: GameParams) => {
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
        name="wordsCategory-timer"
        values={[
          {
            label: props.t("words"),
            value: {
              kind: CategoryKind.generation,
              category: WordsGenerationCategory.words1k,
            } as Category,
            icon: <Text />,
          },
          {
            label: props.t("quotes"),
            value: {
              kind: CategoryKind.generation,
              category: WordsGenerationCategory.quotes,
            } as Category,
            icon: <Quote />,
          },
          {
            label: props.t("custom"),
            value: { kind: CategoryKind.custom } as Category,
            icon: <Customizer />,
          },
        ]}
        compare={(v) => {
          switch (props.gameOptions.categorySelected.kind) {
            case CategoryKind.custom:
              return v.kind === CategoryKind.custom;
            case CategoryKind.generation:
              return (
                v.kind === CategoryKind.generation &&
                v.category === props.gameOptions.categorySelected.category
              );
          }
        }}
        setChecked={(value) => {
          if (value.kind === CategoryKind.generation) {
            props.setGameOptions("generation", "category", value.category);
          }
          props.setGameOptions("categorySelected", value);
        }}
      />
      <Show
        when={props.gameOptions.categorySelected.kind !== CategoryKind.custom}
      >
        <RadioGroup
          name="languages-timer"
          values={[
            { label: props.t("en"), value: "en" as Languages },
            { label: props.t("fr"), value: "fr" as Languages },
          ]}
          compare={(v) => v === props.gameOptions.generation.language}
          setChecked={(l) => props.setGameOptions("generation", "language", l)}
        >
          <Lang />
        </RadioGroup>
      </Show>
      <Switch>
        <Match
          when={props.gameOptions.categorySelected.kind === CategoryKind.custom}
        >
          {props.children}
        </Match>
      </Switch>
      <RadioGroup
        name="time"
        values={[
          { label: "10s", value: 10 },
          { label: "30s", value: 30 },
          { label: "1m", value: 60 },
          { label: "2m", value: 120 },
        ]}
        compare={(v) => v === props.gameOptions.timer}
        setChecked={(time) =>
          props.setGameOptions("timer", time)
        }
      >
        <Stopwatch />
      </RadioGroup>
    </div>
  );
};

export default TimerParamsCompact;
