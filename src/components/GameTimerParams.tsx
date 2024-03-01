import { css } from "solid-styled";
import Lang from "./ui/lang";
import Word from "./ui/word";
import {
  NumberSelectionType,
  type Languages,
  type NumberSelection,
  type Translator,
  WordsCategory,
} from "./App";
import RadioGroup from "./RadioGroup";
import { Match, Show, Switch } from "solid-js";

type GameRandomParamsProps = {
  start: (content?: string) => void;
  t: Translator;
  words: NumberSelection;
  setWords: (words: NumberSelection) => void;
  language: Languages;
  setLanguage: (language: Languages) => void;
  wordsCategory: WordsCategory;
  setWordsCategory: (wordsCategory: WordsCategory) => void;
};

const GameRandomParams = (props: GameRandomParamsProps) => {
  css`
    .random-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      width: 100%;
      padding: 0 30px;
    }
  `;

  const OnClick = () => {
    if (props.wordsCategory === WordsCategory.custom) {
    return props.start(inputRef.value);
    }
    props.start()
  };
  let inputRef: HTMLTextAreaElement;
  return (
    <div class="random-params">
      <RadioGroup
        name="wordsCategory-timer"
        values={[
          { label: props.t("words"), value: WordsCategory.words1k },
          { label: props.t("quotes"), value: WordsCategory.quotes },
          { label: props.t("custom"), value: WordsCategory.custom },
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
        <Match when={props.wordsCategory === WordsCategory.words1k}>
          <RadioGroup
            name="nbrWords-timer"
            values={[
              { label: "10", value: 10 },
              { label: "25", value: 25 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
            checked={props.words.value}
            setChecked={(v) =>
              props.setWords({ type: NumberSelectionType.selected, value: v })
            }
          >
            <Word />
          </RadioGroup>
        </Match>
        <Match when={props.wordsCategory === WordsCategory.custom}>
          <textarea ref={inputRef!}></textarea>
        </Match>
      </Switch>

      <button onClick={OnClick}>{props.t("letsGo")}</button>
    </div>
  );
};

export default GameRandomParams;
