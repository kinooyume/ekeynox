import { GetContent } from "~/typingContent/TypingGameSource";
import { TypingModeKind } from "./typingModeKind";

export type TypingGameOptions =
  | {
      kind: TypingModeKind.speed;
      isGenerated: boolean;
      getContent: GetContent;
    }
  | {
      kind: TypingModeKind.timer;
      isGenerated: boolean;
      time: number;
      getContent: GetContent;
    };

export function deepCopyMode(source: TypingGameOptions): TypingGameOptions {
  if (source.kind === TypingModeKind.speed) {
    return {
      kind: TypingModeKind.speed,
      isGenerated: source.isGenerated,
      getContent: source.getContent,
    };
  } else {
    return {
      kind: TypingModeKind.timer,
      isGenerated: source.isGenerated,
      time: source.time,
      getContent: source.getContent,
    };
  }
}
