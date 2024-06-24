import { Match, Show, Switch } from "solid-js";
import { css } from "solid-styled";
import RadioGroup from "../ui/RadioGroup";

import Lang from "../svgs/lang";
import Quote from "../svgs/quote";
import Text from "../svgs/text";
import Customizer from "../svgs/customizer";
import Stopwatch from "../svgs/stopwatch";
import type { GameParams } from "./GameParams";
import { useI18n } from "~/settings/i18nProvider";
import { Category, CategoryKind, Languages, WordsGenerationCategory } from "~/gameOptions/gameOptions";

const TimerParams = (props: GameParams) => {

  const t = useI18n();
  css`
    .time-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      color: var(--text-secondary-color);
      text-transform: uppercase;
      cursor: default;
    }
    .option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      transition: opacity 0.15s ease-in-out;
    }
  `;

  return (
    <div class="time-params">
      <div class="option">
        <h3>{t("content")}</h3>
        <RadioGroup
          name="wordsCategory-timer"
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
            // {
            //   label: t("custom"),
            //   value: { kind: CategoryKind.custom } as Category,
            //   icon: <Customizer />,
            // },
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
      </div>
      <Show
        when={props.gameOptions.categorySelected.kind !== CategoryKind.custom}
      >
        <div class="option">
          <h3> {t("language")} </h3>
          <RadioGroup
            name="languages-timer"
            values={[
              { label: t("en"), value: "en" as Languages },
              { label: t("fr"), value: "fr" as Languages },
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
          when={props.gameOptions.categorySelected.kind === CategoryKind.custom}
        >
          {props.children}
        </Match>
      </Switch>
      <div class="option">
        <h3>{t("timeLimit")}</h3>
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
    </div>
  );
};

export default TimerParams;
