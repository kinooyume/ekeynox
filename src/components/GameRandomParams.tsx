import { css } from "solid-styled";
import Lang from "./ui/lang";
import Word from "./ui/word";
import {
  NumberSelectionType,
  type Languages,
  type NumberSelection,
  type Translator,
} from "./App";

type GameRandomParamsProps = {
  start: () => void;
  t: Translator;
  words: NumberSelection;
  setWords: (words: NumberSelection) => void;
  language: string;
  setLanguage: (language: Languages) => void;
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
    .icon {
      height: 15px;
      padding: 4px 8px;
      padding-top: 0;
      display: inline-block;
      justify-content: center;
      align-items: center;
    }
    .lang {
      padding-top: 2px;
    }
  `;

  return (
    <div class="random-params">
      <div class="radio-group">
        <div class="icon lang">
          <Lang />
        </div>
        <input
          onInput={(_) => props.setLanguage("en")}
          type="radio"
          id="english"
          name="languages"
          value="en"
          checked={props.language === "en"}
        />
        <label for="english">{props.t("english")}</label>
        <input
          onInput={(_) => props.setLanguage("fr")}
          type="radio"
          id="french"
          name="languages"
          value="fr"
          checked={props.language === "fr"}
        />
        <label for="french">{props.t("french")}</label>
      </div>
      <div class="radio-group">
        <div class="icon">
          <Word />
        </div>
        <input
          onInput={(_) =>
            props.setWords({
              type: NumberSelectionType.selected,
              value: 10,
            })
          }
          type="radio"
          id="10"
          name="characters"
          value={10}
          checked={props.words.value === 10}
        />
        <label for="10">10</label>
        <input
          onInput={(_) =>
            props.setWords({
              type: NumberSelectionType.selected,
              value: 25,
            })
          }
          type="radio"
          id="25"
          name="characters"
          value={25}
          checked={props.words.value === 25}
        />
        <label for="25">25</label>
      </div>

      <button onClick={() => props.start()}>{props.t("letsGo")}</button>
    </div>
  );
};

export default GameRandomParams;
