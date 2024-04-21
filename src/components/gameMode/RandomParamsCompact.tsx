import { Match, Show, Switch } from "solid-js";
import { css } from "solid-styled";
import Lang from "../svgs/lang";
import Word from "../svgs/word";
import {
  CategoryKind,
  WordsGenerationCategory,
  type Category,
  type Languages,
} from "./GameOptions";
import RadioGroup from "../ui/RadioGroup";
import Quote from "../svgs/quote";
import Text from "../svgs/text";
import Customizer from "../svgs/customizer";
import type { GameParams } from "./GameParams";

const RandomParamsCompact = (props: GameParams) => {
  css`
    .random-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  `;

  return (
    <div class="random-params">
      <RadioGroup
        name="wordsCategory"
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
          name="languages"
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
        <Match
          when={
            props.gameOptions.categorySelected.kind ===
              CategoryKind.generation &&
            props.gameOptions.categorySelected.category ===
              WordsGenerationCategory.words1k
          }
        >
          <RadioGroup
            name="nbrWords"
            values={[
              { label: "10", value: 10 },
              { label: "25", value: 25 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
            compare={(v) => v === props.gameOptions.random}
            setChecked={(v) => props.setGameOptions("random", v)}
          >
            <Word />
          </RadioGroup>
        </Match>
      </Switch>
    </div>
  );
};

export default RandomParamsCompact;
