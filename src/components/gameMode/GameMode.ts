import type { JSXElement } from "solid-js";
import Bunny from "../svgs/bunny";
import Monkey from "../svgs/monkey";
import BunnyHead from "../svgs/bunnyHead";
import MonkeyHead from "../svgs/monkeyHead";
import type { GameParams } from "./GameParams";
import RandomParams from "./RandomParams";
import RandomParamsCompact from "./RandomParamsCompact";
import TimerParams from "./TimerParams";
import TimerParamsCompact from "./TimerParamsCompact";

export enum GameModeKind {
  random = "random",
  timer = "timer",
}

export type GameModeData = {
  picto: () => JSXElement;
  head: () => JSXElement;
  params: (props: GameParams) => JSXElement;
  compact: (props: GameParams) => JSXElement;
};

export type GameMode = Record<GameModeKind, GameModeData>;

const gameModes: GameMode = {
  [GameModeKind.random]: {
    picto: Monkey,
    head: MonkeyHead,
    params: RandomParams,
    compact: RandomParamsCompact,
  },
  [GameModeKind.timer]: {
    picto: Bunny,
    head: BunnyHead,
    params: TimerParams,
    compact: TimerParamsCompact,
  },
};

const gameModesArray: Array<[GameModeKind, GameModeData]> = Object.entries(
  gameModes,
) as Array<[GameModeKind, GameModeData]>;

export { gameModes, gameModesArray };
