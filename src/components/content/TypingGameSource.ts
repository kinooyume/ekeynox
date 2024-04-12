import { GameModeKind } from "../gameMode/GameMode";
import {
  type GameOptions,
  WordsGenerationCategory,
  ContentTypeKind,
} from "../gameMode/GameOptions";
import type { ContentData } from "./Content";
import Content from "./Content";
import { randomQuote, randomWords } from "./randomContent";

type SourceProps = {
  random: Array<string>;
  custom: string;
};

const getSource = (
  opts: GameOptions,
  sources: SourceProps,
  wordNumber: number,
): (() => ContentData) => {
  if (opts.contentType.kind === ContentTypeKind.custom) {
    return () => Content.parse(sources.custom);
  }
  switch (opts.generation.category) {
    case WordsGenerationCategory.words1k:
      return () => Content.parseWords(randomWords(sources.random)(wordNumber));
    case WordsGenerationCategory.quotes:
      return () => Content.parse(randomQuote(sources.random));
  }
};

export type GameModeContent =
  | {
      kind: GameModeKind.random;
      getContent: () => ContentData;
    }
  | {
      kind: GameModeKind.timer;
      time: number;
      getContent: () => ContentData;
    };

const makeGetContent = (
  opts: GameOptions,
  sources: SourceProps,
): GameModeContent => {
  switch (opts.mode) {
    case GameModeKind.random:
      return {
        kind: GameModeKind.random,
        getContent: getSource(opts, sources, opts.random.value),
      };
    case GameModeKind.timer:
      return {
        kind: GameModeKind.timer,
        time: opts.timer.value * 1000,
        getContent: getSource(opts, sources, opts.timer.value * 4),
      };
  }
};

export { makeGetContent };
