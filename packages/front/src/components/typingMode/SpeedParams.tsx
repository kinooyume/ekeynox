import { Match, Show, Switch, type JSXElement } from "solid-js";
import { css } from "solid-styled";
import Lang from "~/svgs/lang";
import Word from "~/svgs/word";
import RadioGroup from "../ui/RadioGroup";
import Quote from "~/svgs/quote";
import Text from "~/svgs/text";
import Customizer from "~/svgs/customizer";
import { useI18n } from "~/contexts/i18nProvider";
import {
  Category,
  CategoryKind,
  Languages,
  WordsGenerationCategory,
} from "~/typingOptions/typingOptions";
import { GameParams } from "~/typingOptions/GameParams";

const SpeedParams = (props: GameParams) => {
  const t = useI18n();
  css`
    .random-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    p {
      margin: 0;
      font-weight: 400;
      color: var(--text-secondary-color);
      font-size: 18px;
      cursor: default;
      text-transform: capitalize;
    }
    .option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      transition: all 0.15s ease-in-out;
    }
    @media screen and (max-width: 860px) {
      .option {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      p {
        font-size: 14px;
      }
    }
  `;

  return (
    <div class="random-params">
      <div class="option">
        <p>{t("content")}</p>
        <RadioGroup
          name="wordsCategory"
          values={[
            {
              label: t("words"),
              value: {
                kind: CategoryKind.generation,
                category: WordsGenerationCategory.words1k,
              } as Category,
              icon: <Text />,
            },
            {
              label: t("quotes"),
              value: {
                kind: CategoryKind.generation,
                category: WordsGenerationCategory.quotes,
              } as Category,
              icon: <Quote />,
            },
            {
              label: t("custom"),
              value: { kind: CategoryKind.custom } as Category,
              icon: <Customizer />,
            },
          ]}
          compare={(v) => {
            switch (props.typingOptions.categorySelected.kind) {
              case CategoryKind.custom:
                return v.kind === CategoryKind.custom;
              case CategoryKind.generation:
                return (
                  v.kind === CategoryKind.generation &&
                  v.category === props.typingOptions.categorySelected.category
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
      </div>
      <Show
        when={props.typingOptions.categorySelected.kind !== CategoryKind.custom}
      >
        <div class="option">
          <p> {t("language")} </p>
          <RadioGroup
            name="languages"
            values={[
              { label: t("en"), value: "en" as Languages },
              { label: t("fr"), value: "fr" as Languages },
            ]}
            compare={(v) => v === props.typingOptions.generation.language}
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
          when={props.typingOptions.categorySelected.kind === CategoryKind.custom}
        >
          {props.children}
        </Match>
        <Match
          when={
            props.typingOptions.categorySelected.kind ===
              CategoryKind.generation &&
            props.typingOptions.categorySelected.category ===
              WordsGenerationCategory.words1k
          }
        >
          <div class="option">
            <p>{t("wordCount")}</p>
            <RadioGroup
              name="nbrWords"
              values={[
                { label: "10", value: 10 },
                { label: "25", value: 25 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
              ]}
              compare={(v) => v === props.typingOptions.random}
              setChecked={(v) => props.setGameOptions("random", v)}
            >
              <div></div>
            </RadioGroup>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default SpeedParams;
