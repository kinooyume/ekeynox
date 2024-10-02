import type { JSXElement } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { GameOptions } from "~/gameOptions/gameOptions";

export type GameParams = {
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  children: JSXElement;
};
