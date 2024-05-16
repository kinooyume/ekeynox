import type { KeyTuple } from "../metrics/KeyMetrics";

export enum TypingWordKind {
  ignore,
  correct,
}

export type TypingWord =
  | { kind: TypingWordKind.ignore }
  | { kind: TypingWordKind.correct; length: number };

export type TypingKey = {
  keyMetrics: KeyTuple;
  timestamp: number;
  focusIsSeparator: boolean;
};

export type TypingEvent = {
  key: TypingKey;
  word: TypingWord;
};

export type TypingEventProps = {
  key: TypingKey;
  word?: TypingWord;
  next: boolean;
};

export enum TypingEventKind {
  unstart,
  pending,
  deleted,
  pause,
  over,
}

export type TypingEventType =
  | { kind: TypingEventKind.unstart; restart?: boolean }
  | {
      kind: TypingEventKind.pending;
      key: TypingKey;
      word: TypingWord;
      next: boolean;
    }
  | { kind: TypingEventKind.pause }
  | { kind: TypingEventKind.over };

const make = (statusProps: TypingEventProps): TypingEventType => ({
  kind: TypingEventKind.pending,
  word: { kind: TypingWordKind.ignore },
  ...statusProps,
});

export default { make };
