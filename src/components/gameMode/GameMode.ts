import type { JSXElement } from "solid-js";
import Bunny from "../svgs/bunny";
import Monkey from "../svgs/monkey";
import BunnyHead from "../svgs/bunnyHead";
import MonkeyHead from "../svgs/monkeyHead";
import type { GameParams } from "./GameParams";
import SpeedParams from "./SpeedParams";
import SpeedParamsCompact from "./SpeedParamsCompact";
import TimerParams from "./TimerParams";
import TimerParamsCompact from "./TimerParamsCompact";
import MonkeySmile from "../svgs/monkeySmile";
import BunnySmile from "../svgs/bunnySmile";

// Concernant que les données des modes
export enum GameModeKind {
  speed = "speed",
  timer = "timer",
}

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
