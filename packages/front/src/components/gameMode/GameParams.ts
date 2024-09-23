import type { SetStoreFunction } from "solid-js/store";
import type { JSXElement } from "solid-js";
import { GameOptions } from "~/gameOptions/gameOptions";

export type GameParams = {
  gameOptions: GameOptions; 
  setGameOptions: SetStoreFunction<GameOptions>;
  children: JSXElement;
};
