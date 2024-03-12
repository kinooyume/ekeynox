import { css } from "solid-styled";
import Lang from "./ui/lang";
import Word from "./ui/word";
import {
  NumberSelectionType,
  type Translator,
  type GameOptions,
  ContentTypeKind,
  WordsGenerationCategory,
  type ContentType,
  type Languages,
} from "./App";
import RadioGroup from "./RadioGroup";
import { Match, Show, Switch, type JSXElement } from "solid-js";
import Quote from "./ui/quote";
import Text from "./ui/text";
import Customizer from "./ui/customizer";
import type { SetStoreFunction } from "solid-js/store";

type GameRandomParamsProps = {
  t: Translator;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  children: JSXElement;
};

const GameRandomParams = (props: GameRandomParamsProps) => {
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
        setChecked={(value) => props.setGameOptions("contentType", value)}
      />
      <Show
        when={props.gameOptions.contentType.kind !== ContentTypeKind.custom}
      >
        <RadioGroup
          name="languages"
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
        <Match
          when={
            props.gameOptions.contentType.kind === ContentTypeKind.generation &&
            props.gameOptions.contentType.category ===
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
            compare={(v) => v === props.gameOptions.random.value}
            setChecked={(v) =>
              props.setGameOptions("random", {
                type: NumberSelectionType.selected,
                value: v,
              })
            }
          >
            <Word />
          </RadioGroup>
        </Match>
      </Switch>
    </div>
  );
};

export default GameRandomParams;
