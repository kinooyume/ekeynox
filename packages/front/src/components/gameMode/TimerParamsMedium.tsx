import { Match, Show, Switch } from "solid-js";
import { css } from "solid-styled";
import {
  CategoryKind,
  WordsGenerationCategory,
  type Category,
  type Languages,
} from "../../typingOptions/gameOptions";
import RadioGroup from "../ui/RadioGroup";

import Lang from "~/svgs/lang";
import Quote from "~/svgs/quote";
import Text from "~/svgs/text";
import Customizer from "~/svgs/customizer";
import Stopwatch from "~/svgs/stopwatch";
import type { GameParams } from "./GameParams";
import { useI18n } from "~/contexts/i18nProvider";

const TimerParamsMedium = (props: GameParams) => {
  const t = useI18n();
  css`
    .time-params {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    p {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      color: var(--text-secondary-color);
      text-transform: capitalize;
      cursor: default;
    }
    .option {
      display: flex;
      border-radius: 12px;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 8px;
      transition: all 0.2s ease-in-out;
    }
    .option:hover {
      background-color: var(--background-color);
    }
  `;

  return (
    <div class="time-params">
      <div class="option">
        <p>{t("content")}</p>
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
            {
              label: t("custom"),
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
      </div>
      <Show
        when={props.gameOptions.categorySelected.kind !== CategoryKind.custom}
      >
        <div class="option">
          <p> {t("language")} </p>
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
        <p>{t("timeLimit")}</p>
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

export default TimerParamsMedium;
