import Bunny from "../svgs/bunny";
import Monkey from "../svgs/monkey";
import BunnyHead from "../svgs/bunnyHead";
import MonkeyHead from "../svgs/monkeyHead";
import SpeedParams from "./SpeedParams";
import SpeedParamsCompact from "./SpeedParamsCompact";
import TimerParams from "./TimerParams";
import TimerParamsCompact from "./TimerParamsCompact";
import { GameMode, GameModeKind } from "./GameMode";

export const gameModes: GameMode = {
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
    params: TimerParams,
    compact: TimerParamsCompact,
  },
};

