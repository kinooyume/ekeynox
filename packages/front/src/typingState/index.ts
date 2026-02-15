import { TypingCharacter } from "~/typingContent/character/types";
import { TypingWord, TypingWordKind } from "~/typingContent/word/types";

export enum TypingStateKind {
  unstart,
  pending,
  deleted,
  pause,
  over,
}

export type TypingStatePending = {
  kind: TypingStateKind.pending;
  key: TypingCharacter;
  word: TypingWord;
  next: boolean;
};

export type TypingState =
  | { kind: TypingStateKind.unstart }
  | { kind: TypingStateKind.pause }
  | TypingStatePending
  | { kind: TypingStateKind.over };

export type TypingPendingEvent = {
  key: TypingCharacter;
  word?: TypingWord;
  next: boolean;
};

export const typingStatePending = (event: TypingPendingEvent): TypingState => ({
  kind: TypingStateKind.pending,
  word: { kind: TypingWordKind.ignore },
  ...event,
});
