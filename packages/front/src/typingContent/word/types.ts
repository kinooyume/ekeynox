import { MetaCharacter } from "../character/types";

export type NonEmptyArray<T> = [T, ...T[]];

export enum WordStatus {
  unstart = "unstart",
  unfocus = "unfocus",
  pending = "pending",
  pause = "pause",
  over = "over",
}

export type MetaWord = {
  /* Core */
  characters: NonEmptyArray<MetaCharacter>;
  isSeparator: boolean;
  /* --- */
  status: WordStatus;
  focus: boolean;
  /* Wpm */
  isCorrect: boolean;
  lastEnterTimestamp: number;
  lastLeaveTimestamp: number;
  spentTime: number;
  wpm: number;
  /* --- */
};


export enum TypingWordKind {
  ignore,
  correct,
}

export type TypingWord =
  | { kind: TypingWordKind.ignore }
  | { kind: TypingWordKind.correct; length: number };
