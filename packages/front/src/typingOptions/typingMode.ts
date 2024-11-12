import type { JSXElement } from "solid-js";

import MonkeySmile from "~/svgs/monkeySmile";
import BunnySmile from "~/svgs/bunnySmile";
import Bunny from "~/svgs/bunny";
import Monkey from "~/svgs/monkey";
import BunnyHead from "~/svgs/bunnyHead";
import MonkeyHead from "~/svgs/monkeyHead";
import { TypingModeKind } from "./typingModeKind";
import {
  MakeTypingModeParam,
  TypingModeParam,
  TypingModeProps,
} from "./typingModeParams";
import { Category, makeParamsCategory } from "./typingModeCategory";
import { makeParamsWordCount } from "./typingModeWordCount";
import { Languages, makeParamsLanguage } from "./typingModeLanguage";
import { makeParamsTimer } from "./typingModeTimer";

export type TypingModeData<ParamsWord, ParamsQuote, ParamsCustom> = {
  picto: () => JSXElement;
  head: () => JSXElement;
  smile: () => JSXElement;

  category: MakeTypingModeParam<Category>;
  params: ParamsByCategories<ParamsWord, ParamsQuote, ParamsCustom>;
};

export type ParamsByCategories<ParamsWord, ParamsQuote, ParamsCustom> = (
  props: TypingModeProps,
) => {
  words: ParamsWord[];
  quotes: ParamsQuote[];
  custom: ParamsCustom[];
};

/* Speed */

type ParamsWordsSpeed = TypingModeParam<Languages> | TypingModeParam<number>;
type ParamsQuoteSpeed = ParamsWordsSpeed;

const speedParams: ParamsByCategories<
  ParamsWordsSpeed,
  ParamsQuoteSpeed,
  null
> = (props) => ({
  words: [
    makeParamsLanguage(props.typingOptions, props.setTypingOptions),
    makeParamsWordCount(props.typingOptions, props.setTypingOptions),
  ],
  quotes: [makeParamsLanguage(props.typingOptions, props.setTypingOptions)],
  custom: [],
});

type TypingModeParamsSpeed = TypingModeData<
  ParamsWordsSpeed,
  ParamsQuoteSpeed,
  null
>;

/*  Timer */

type ParamsWordsTimer = ParamsWordsSpeed;
type ParamsQuoteTimer = ParamsWordsSpeed;
type ParamsCustomTimer = TypingModeParam<number>;

const timerParams: ParamsByCategories<
  ParamsWordsTimer,
  ParamsQuoteTimer,
  ParamsCustomTimer
> = (props) => ({
  words: [
    makeParamsLanguage(props.typingOptions, props.setTypingOptions),
    makeParamsTimer(props.typingOptions, props.setTypingOptions),
  ],
  quotes: [
    makeParamsLanguage(props.typingOptions, props.setTypingOptions),
    makeParamsTimer(props.typingOptions, props.setTypingOptions),
  ],
  custom: [makeParamsTimer(props.typingOptions, props.setTypingOptions)],
});

type TypingModeParamsTimer = TypingModeData<ParamsWordsTimer, ParamsQuoteTimer, ParamsCustomTimer>;

/* Common */

export type ParamsbyCategoriesUnion =
  | ParamsByCategories<ParamsWordsSpeed, ParamsQuoteSpeed, null>
  | ParamsByCategories<ParamsWordsTimer, ParamsQuoteTimer, ParamsCustomTimer>;

export type TypingModeParams = TypingModeParamsTimer | TypingModeParamsSpeed;

export type TypingMode = Record<TypingModeKind, TypingModeParams>;

const typingModes: TypingMode = {
  [TypingModeKind.speed]: {
    picto: Monkey,
    head: MonkeyHead,
    smile: MonkeySmile,
    category: makeParamsCategory,
    params: speedParams,
  },
  [TypingModeKind.timer]: {
    picto: Bunny,
    head: BunnyHead,
    smile: BunnySmile,
    category: makeParamsCategory,
    params: timerParams,
  },
};

const typingModesArray: Array<[TypingModeKind, TypingModeParams]> =
  Object.entries(typingModes) as Array<[TypingModeKind, TypingModeParams]>;

export { typingModes, typingModesArray };
