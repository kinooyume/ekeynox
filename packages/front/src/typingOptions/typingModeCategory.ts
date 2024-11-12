import Quote from "~/svgs/quote";
import { MakeTypingModeParam, TypingModeParamValue } from "./typingModeParams";

export enum GenerationCategory {
  words1k = "words1k",
  quotes = "quotes",
}

export enum CategoryKind {
  generation,
  custom,
}

export type Category =
  | { kind: CategoryKind.custom }
  | { kind: CategoryKind.generation; category: GenerationCategory };

export type ParamValueCategory = TypingModeParamValue<Category>;

const ParamValuesCategories: ParamValueCategory[] = [
  {
    label: "words",
    icon: () => Quote,
    content: {
      kind: CategoryKind.generation,
      category: GenerationCategory.words1k,
    },
  },
  {
    label: "quotes",
    content: {
      kind: CategoryKind.generation,
      category: GenerationCategory.quotes,
    },
  },
  {
    label: "custom",
    content: { kind: CategoryKind.custom },
  },
];

const makeParamsCategory: MakeTypingModeParam<Category> = (
  typingOptions,
  setTypingOptions,
) => ({
  name: "param-category",
  label: "content",
  values: ParamValuesCategories,
  compare: (v) => {
    switch (typingOptions.categorySelected.kind) {
      case CategoryKind.custom:
        return v.kind === CategoryKind.custom;
      case CategoryKind.generation:
        return (
          v.kind === CategoryKind.generation &&
          v.category === typingOptions.categorySelected.category
        );
    }
  },
  setValue: (value) => {
    if (value.kind === CategoryKind.generation) {
      setTypingOptions("generation", "category", value.category);
    }
    setTypingOptions("categorySelected", value);
  },
});

export { makeParamsCategory };
