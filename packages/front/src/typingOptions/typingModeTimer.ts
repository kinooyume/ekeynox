import { MakeTypingModeParam, TypingModeParamValue } from "./typingModeParams";

export type ParamValueTimer = TypingModeParamValue<number>;

const ParamValuesTimer: ParamValueTimer[] = [
  { label: "10s", content: 10 },
  { label: "30s", content: 30 },
  { label: "1m", content: 60 },
  { label: "2m", content: 120 },
];

const makeParamsTimer: MakeTypingModeParam<number> = (
  typingOptions,
  setTypingOptions,
) => ({
  name: "param-timer",
  label: "timeLimit",
  values: ParamValuesTimer,
  compare: (v) => v === typingOptions.timer,
  setValue: (time) => setTypingOptions("timer", time),
});

export { makeParamsTimer };
