import type { GameOptions } from "./GameOptions";
import type { SetStoreFunction } from "solid-js/store";
import type { Translator } from "../App";
import type { JSXElement } from "solid-js";

export type GameParams = {
  t: Translator;
  gameOptions: GameOptions; 
  setGameOptions: SetStoreFunction<GameOptions>;
  children: JSXElement;
};
