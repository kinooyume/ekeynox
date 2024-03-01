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

type GameRandomParamsProps = {
  start: () => void;
  t: Translator;
  words: NumberSelection;
  setWords: (words: NumberSelection) => void;
  language: Languages;
  setLanguage: (language: Languages) => void;
  wordsCategory: string;
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

  return (
    <div class="random-params">
      <RadioGroup
        name="languages"
        values={[
          { label: props.t("english"), value: "en" },
          { label: props.t("french"), value: "fr" },
        ]}
        checked={props.language}
        setChecked={props.setLanguage}
      >
        <Lang />
      </RadioGroup>
      <RadioGroup
        name="nbrWords"
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

      <button onClick={() => props.start()}>{props.t("letsGo")}</button>
    </div>
  );
};

export default GameRandomParams;
