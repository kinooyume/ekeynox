import { MakeTypingModeParam, TypingModeParamValue } from "./typingModeParams";

export type Languages = "en" | "fr";

export type ParamValueLanguage = TypingModeParamValue<Languages>;

const ParamValuesCategories: ParamValueLanguage[] = [
  { label: "en", content: "en" as Languages },
  { label: "fr", content: "fr" as Languages },
];

const makeParamsLanguage: MakeTypingModeParam<Languages> = (
  typingOptions,
  setTypingOptions,
) => ({
  name: "param-language",
  label: "language",
  values: ParamValuesCategories,
  compare: (v) => v === typingOptions.generation.language,
  setValue: (l) => setTypingOptions("generation", "language", l),
});

export { makeParamsLanguage };
