import type { JSXElement } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import type { TypingOptions } from "~/typingOptions/typingOptions";

// Props
export type GameParams = {
  typingOptions: TypingOptions;
  setTypingOptions: SetStoreFunction<TypingOptions>;
  children: JSXElement;
};
