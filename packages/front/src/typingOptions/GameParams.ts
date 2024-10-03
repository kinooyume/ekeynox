import type { JSXElement } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import type { GameOptions } from "~/typingOptions/gameOptions";

// Props
export type GameParams = {
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  children: JSXElement;
};
