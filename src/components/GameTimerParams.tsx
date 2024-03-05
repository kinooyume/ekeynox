import { css } from "solid-styled";
import Lang from "./ui/lang";
import {
  NumberSelectionType,
  type Languages,
  type NumberSelection,
  type Translator,
  WordsCategory,
} from "./App";
import RadioGroup from "./RadioGroup";
import { Match, Show, Switch } from "solid-js";

import Quote from "./ui/quote";
import Text from "./ui/text";
import Customizer from "./ui/customizer";
import Stopwatch from "./ui/stopwatch";

type GameRandomParamsProps = {
  start: (content?: string) => void;
  t: Translator;
  time: NumberSelection;
  setTime: (time: NumberSelection) => void;
  language: Languages;
  setLanguage: (language: Languages) => void;
  wordsCategory: WordsCategory;
  setWordsCategory: (wordsCategory: WordsCategory) => void;
};

const GameRandomParams = (props: GameRandomParamsProps) => {
  css`
    .time-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    button {
      margin-top: 64px;
    }
  `;

  const OnClick = () => {
    if (props.wordsCategory === WordsCategory.custom) {
      return props.start(inputRef.value);
    }
    props.start();
  };
  let inputRef: HTMLTextAreaElement;
  return (
    <div class="time-params">
      <RadioGroup
        name="time"
        values={[
          { label: "10s", value: 10 },
          { label: "30s", value: 30 },
          { label: "1m", value: 60 },
          { label: "2m", value: 120 },
          { label: "5m", value: 300 },
        ]}
        checked={props.time.value}
        setChecked={(time) =>
          props.setTime({ type: NumberSelectionType.selected, value: time })
        }
      >
        <Stopwatch />
      </RadioGroup>
      <RadioGroup
        name="wordsCategory-timer"
        values={[
          {
            label: props.t("words"),
            value: WordsCategory.words1k,
            icon: <Text />,
          },
          {
            label: props.t("quotes"),
            value: WordsCategory.quotes,
            icon: <Quote />,
          },
          {
            label: props.t("custom"),
            value: WordsCategory.custom,
            icon: <Customizer />,
          },
        ]}
        checked={props.wordsCategory}
        setChecked={props.setWordsCategory}
      />
      <Show when={props.wordsCategory !== WordsCategory.custom}>
        <RadioGroup
          name="languages-timer"
          values={[
            { label: props.t("english"), value: "en" },
            { label: props.t("french"), value: "fr" },
          ]}
          checked={props.language}
          setChecked={props.setLanguage}
        >
          <Lang />
        </RadioGroup>
      </Show>
      <Switch>
        <Match when={props.wordsCategory === WordsCategory.custom}>
          <textarea ref={inputRef!}></textarea>
        </Match>
      </Switch>
      <button onClick={OnClick}>{props.t("letsGo")}</button>
    </div>
  );
};

export default GameRandomParams;
