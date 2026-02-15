import { MetaWord, WordStatus } from "~/typingContent/word/types.ts";

import WordWpmCounter, {
  type PendingWpmCounter,
  type PausedWpmCounter,
  WpmCounterStateKind,
} from "./WordWpmCounter.ts";

type WordStatusReactiveProps = {
  status: WordStatus;
};

export type WordStatusReactive = ({
  status,
}: WordStatusReactiveProps) => WordStatusReactive;

type CreateProps = {
  word: MetaWord;
  setWpm: (arg: { wpm: number; duration: number }) => void;
};

const createWordWpmCounterReactive = ({ word, setWpm }: CreateProps) => {
  const pending =
    (counter: PendingWpmCounter): WordStatusReactive =>
    ({ status }) => {
      if (status === WordStatus.pause) return paused(counter.pause());
      if (!(status === WordStatus.over)) return pending(counter);
      const wpm = counter.getWpm(word.characters);
      switch (wpm.kind) {
        case WpmCounterStateKind.done:
          setWpm(wpm);
          return paused(counter.pause());
        case WpmCounterStateKind.pause:
          return paused(counter.pause());
        case WpmCounterStateKind.pending:
          return pending(counter);
      }
    };

  const paused =
    (counter: PausedWpmCounter): WordStatusReactive =>
    ({ status }) => {
      switch (status) {
        case WordStatus.unstart:
          return create(word.spentTime);
        case WordStatus.pending:
          return pending(counter.resume());
      }
      return paused(counter);
    };

  const create = (elapsed: number) => paused(WordWpmCounter(elapsed));
  return create(word.spentTime);
};

export { createWordWpmCounterReactive };
