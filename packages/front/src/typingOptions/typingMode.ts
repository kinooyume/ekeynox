import type { JSXElement } from "solid-js";

import type { GameParams } from "./GameParams";
import SpeedParams from "~/components/typingMode/SpeedParams";
import SpeedParamsCompact from "~/components/typingMode/SpeedParamsCompact";
import TimerParams from "~/components/typingMode/TimerParams";
import TimerParamsCompact from "~/components/typingMode/TimerParamsCompact";

import MonkeySmile from "~/svgs/monkeySmile";
import BunnySmile from "~/svgs/bunnySmile";
import Bunny from "~/svgs/bunny";
import Monkey from "~/svgs/monkey";
import BunnyHead from "~/svgs/bunnyHead";
import MonkeyHead from "~/svgs/monkeyHead";
import { TypingModeKind } from "./typingModeKind";

export type TypingModeData = {
  picto: () => JSXElement;
  head: () => JSXElement;
  smile: () => JSXElement;
  params: (props: GameParams) => JSXElement;
  compact: (props: GameParams) => JSXElement;
};

export type TypingMode = Record<TypingModeKind, TypingModeData>;

const typingModes: TypingMode = {
  [TypingModeKind.speed]: {
    picto: Monkey,
    head: MonkeyHead,
    smile: MonkeySmile,
    params: SpeedParams,
    compact: SpeedParamsCompact,
  },
  [TypingModeKind.timer]: {
    picto: Bunny,
    head: BunnyHead,
    smile: BunnySmile,
    params: TimerParams,
    compact: TimerParamsCompact,
  },
};

const typingModesArray: Array<[TypingModeKind, TypingModeData]> = Object.entries(
  typingModes,
) as Array<[TypingModeKind, TypingModeData]>;

export { typingModes, typingModesArray };
