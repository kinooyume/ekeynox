import { css } from "solid-styled";
import { Switch, type JSXElement, Show, Match } from "solid-js";
import {
  TypingOptions,
} from "~/typingOptions/typingOptions";
import { useI18n } from "~/contexts/i18nProvider";
import { TypingModeKind } from "~/typingOptions/typingModeKind";
import { CategoryKind, GenerationCategory } from "~/typingOptions/typingModeCategory";

// NOTE: make a data to link title + icons + params full/compact
//
type TypingOptionsRecapProps = {
  typingOptions: TypingOptions;
};

const TypingOptionsRecap = (props: TypingOptionsRecapProps) => {
  const t = useI18n();
  css`
    .options-recap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tag {
      background-color: var(--background-color);
      border-radius: 4px;
      display: flex;
      gap: 5px;
      padding: 5px 10px;
      height: 18px;
    }

    span {
      font-size: 14px;
      text-transform: capitalize;
      color: var(--text-secondary-color);
    }
  `;
  return (
    <div class="options-recap">
      <Show when={props.typingOptions.modeSelected === TypingModeKind.timer}>
        <div class="tag animate">
          <span>{props.typingOptions.timer}s</span>
        </div>
      </Show>
      <Switch
        fallback={
          <div class="tag animate">
            <span>{t("custom")}</span>
          </div>
        }
      >
        <Match
          when={
            props.typingOptions.categorySelected.kind === CategoryKind.generation
          }
        >
          <Switch>
            <Match
              when={
                (props.typingOptions.categorySelected as any).category ===
                GenerationCategory.quotes
              }
            >
              <div class="tag animate">
                <span>{t("quotes")}</span>
              </div>
            </Match>
            <Match
              when={
                (props.typingOptions.categorySelected as any).category ===
                  GenerationCategory.words1k &&
                props.typingOptions.modeSelected !== TypingModeKind.timer
              }
            >
              <div class="tag animate">
                <span>{`${props.typingOptions.wordCount} ${t("words")}`}</span>
              </div>
            </Match>
          </Switch>

          <div class="tag animate">
            <span>{t(props.typingOptions.generation.language)}</span>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default TypingOptionsRecap;
