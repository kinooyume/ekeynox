import {
  Component,
  For,
  JSXElement,
  Match,
  Switch,
} from "solid-js";
import { useI18n } from "~/contexts/i18nProvider";
import { ParamsbyCategoriesUnion } from "~/typingOptions/typingMode";
import {
  Category,
  CategoryKind,
  GenerationCategory,
} from "~/typingOptions/typingModeCategory";
import {
  MakeTypingModeParam,
  TypingModeParam,
} from "~/typingOptions/typingModeParams";
import RadioGroup from "../ui/RadioGroup";
import { TypingOptions } from "~/typingOptions/typingOptions";
import { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";

interface Props {
  typingOptions: TypingOptions;
  setTypingOptions: SetStoreFunction<TypingOptions>;
  categoryParams: MakeTypingModeParam<Category>;
  modeParams: ParamsbyCategoriesUnion;
  compact?: boolean;
  children: JSXElement;
}

const TypingParams: Component<Props> = (props) => {
  const t = useI18n();

  css`
    .mode-params {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    .mode-params.compact {
      gap: 0.2rem;
    }
    p {
      margin: 0;
      font-size: 18px;
      font-weight: 400;
      color: var(--text-secondary-color);
      text-transform: capitalize;
      cursor: default;
    }
    .compact p {
      font-size: 18px;
    }
    .param-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border-radius: 12px;
      transition: opacity 0.15s ease-in-out;
    }

    .compact .param-options {
      padding: 8px;
    }
    .compact .param-options:hover {
      transition: all 0.2s ease-in-out;
      background-color: var(--background-color);
    }
    @media screen and (max-width: 860px) {
      .param-options {
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
    <div class="mode-params" classList={{ compact: props.compact }}>
      <div class="param-options">
        <p>{t("content")}</p>
        <RadioGroup
          {...props.categoryParams(props.typingOptions, props.setTypingOptions)}
        />
      </div>
      <Switch>
        <Match
          keyed
          when={
            props.typingOptions.categorySelected.kind ===
            CategoryKind.generation
          }
        >
          <Switch>
            <Match
              keyed
              when={
                props.typingOptions.generation.category ===
                GenerationCategory.words1k
              }
            >
              <For each={props.modeParams(props).words}>
                {(param) => (
                  <div class="param-options">
                    {/* @ts-ignore-next-line */}
                    <p>{t(param.label)}</p>
                    <RadioGroup {...(param as TypingModeParam<any>)} />
                  </div>
                )}
              </For>
            </Match>
            <Match
              keyed
              when={
                props.typingOptions.generation.category ===
                GenerationCategory.quotes
              }
            >
              <For each={props.modeParams(props).quotes}>
                {(param) => (
                  <div class="param-options">
                    {/* @ts-ignore-next-line */}
                    <p>{t(param.label)}</p>
                    <RadioGroup {...(param as TypingModeParam<any>)} />
                  </div>
                )}
              </For>
            </Match>
          </Switch>
        </Match>
        <Match
          when={
            props.typingOptions.categorySelected.kind === CategoryKind.custom
          }
        >
          {props.children}
          <For each={props.modeParams(props).custom}>
            {(param) => (
              <div class="param-options">
                {/* @ts-ignore-next-line */}
                <p>{t(param.label)}</p>
                <RadioGroup {...(param as TypingModeParam<any>)} />
              </div>
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
};

export default TypingParams;
