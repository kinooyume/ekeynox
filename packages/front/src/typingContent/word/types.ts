import { MetaCharacter } from "../character/types";

export type NonEmptyArray<T> = [T, ...T[]];

export enum WordStatus {
  unstart = "unstart",
  unfocus = "unfocus",
  pending = "pending",
  pause = "pause",
  over = "over",
}

// Prompt
export type MetaWord = {
  /* Core */
  characters: NonEmptyArray<MetaCharacter>;
  isSeparator: boolean;
  /* --- */
  status: WordStatus;
  focus: boolean;
  wasCorrect: boolean;
  spentTime: number;
  wpm: number;
};


/* *** */
/* TypingState */
/* *** */

export enum TypingWordKind {
  ignore,
  correct,
}

export type TypingWord =
  | { kind: TypingWordKind.ignore }
  | { kind: TypingWordKind.correct; length: number };
