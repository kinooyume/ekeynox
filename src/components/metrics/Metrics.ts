import type { ContentData } from "../content/Content";
import type { GameOptions } from "../gameSelection/GameOptions";
import type { KeysProjection } from "./KeysProjection";
import type { TypingMetrics } from "./TypingMetrics";

export type Metrics = {
  content: ContentData;
  gameOptions: GameOptions;
  typing: TypingMetrics;
  keys: KeysProjection;
}
