import { MakeTypingModeParam, TypingModeParamValue } from "./typingModeParams";

export type ParamValueWordCount = TypingModeParamValue<number>;

const ParamValuesWordCount: ParamValueWordCount[] = [
  { label: "10", content: 10 },
  { label: "25", content: 25 },
  { label: "50", content: 50 },
  { label: "100", content: 100 },
];

const makeParamsWordCount: MakeTypingModeParam<number> = (
  typingOptions,
  setTypingOptions,
) => ({
  name: "param-word-count",
  label: "wordCount",
  values: ParamValuesWordCount,
  compare: (v) => v === typingOptions.wordCount,
  setValue: (wc) => setTypingOptions("wordCount", wc),
});

export { makeParamsWordCount };
