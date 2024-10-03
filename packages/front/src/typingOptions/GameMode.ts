import type { JSXElement } from "solid-js";

import type { GameParams } from "./GameParams";
import SpeedParams from "~/components/gameMode/SpeedParams";
import SpeedParamsCompact from "~/components/gameMode/SpeedParamsCompact";
import TimerParams from "~/components/gameMode/TimerParams";
import TimerParamsCompact from "~/components/gameMode/TimerParamsCompact";

import MonkeySmile from "~/svgs/monkeySmile";
import BunnySmile from "~/svgs/bunnySmile";
import Bunny from "~/svgs/bunny";
import Monkey from "~/svgs/monkey";
import BunnyHead from "~/svgs/bunnyHead";
import MonkeyHead from "~/svgs/monkeyHead";
import { GameModeKind } from "~/typingOptions/gameModeKind";

export type GameModeData = {
  picto: () => JSXElement;
  head: () => JSXElement;
  smile: () => JSXElement;
  params: (props: GameParams) => JSXElement;
  compact: (props: GameParams) => JSXElement;
};

export type GameMode = Record<GameModeKind, GameModeData>;

const gameModes: GameMode = {
  [GameModeKind.speed]: {
    picto: Monkey,
    head: MonkeyHead,
    smile: MonkeySmile,
    params: SpeedParams,
    compact: SpeedParamsCompact,
  },
  [GameModeKind.timer]: {
    picto: Bunny,
    head: BunnyHead,
    smile: BunnySmile,
    params: TimerParams,
    compact: TimerParamsCompact,
  },
};

const gameModesArray: Array<[GameModeKind, GameModeData]> = Object.entries(
  gameModes,
) as Array<[GameModeKind, GameModeData]>;

export { gameModes, gameModesArray };
