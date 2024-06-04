// TODO: should we build it from folder/files ?

import {
  SourceProps,
  makeSourceNested,
} from "~/components/content/TypingGameSource";
import { GameModeKind } from "./gameModeKind";
import { PendingMode } from "~/appState/appState";

export type Languages = "en" | "fr";

export enum WordsGenerationCategory {
  words1k = "words1k",
  quotes = "quotes",
}

export type ContentGeneration = {
  category: WordsGenerationCategory;
  language: Languages;
};

export enum CategoryKind {
  generation,
  custom,
}

export type Category =
  | { kind: CategoryKind.custom }
  | { kind: CategoryKind.generation; category: WordsGenerationCategory };

export enum WordsCategoryKind {
  words1k = "words1k",
  quotes = "quotes",
  custom = "custom",
}
/* *** */
// NOTE: Do we need this ?
//
export type WordsCategory =
  | {
      kind: WordsCategoryKind.words1k;
      data: string[];
    }
  | { kind: WordsCategoryKind.quotes; data: string[] }
  | { kind: WordsCategoryKind.custom; data: string };

/* __ */

export type GameOptions = {
  modeSelected: GameModeKind;
  categorySelected: Category;
  generation: ContentGeneration;
  custom: string;
  random: number;
  timer: number;
};

/*
 * NOTE: shoulwe merge contentType/generation ?
 * ==> We want to keep last generation config
 *
 */

type Selected = {
  mode: GameModeKind;
  category: CategoryKind;
};

const getDefaultGameOptions = (): GameOptions => ({
  modeSelected: GameModeKind.speed,
  // NOTE: on doit pouvoir avoir que le kind ?
  categorySelected: {
    kind: CategoryKind.generation,
    category: WordsGenerationCategory.words1k,
  },
  generation: {
    category: WordsGenerationCategory.words1k,
    language: "en",
  },
  custom: "",
  random: 10,
  timer: 10,
});

const deepCopy = (source: GameOptions): GameOptions => ({
  ...source,
  categorySelected: { ...source.categorySelected },
  generation: { ...source.generation },
});

const optionsToPending = async (
  opts: GameOptions,
  sourceGen: Promise<string[]>,
): Promise<PendingMode> => {
  console.log("optionsToPending");
  switch (opts.modeSelected) {
    case GameModeKind.speed:
      const source = await sourceGen;
      return {
        kind: GameModeKind.speed,
        isGenerated: opts.categorySelected.kind === CategoryKind.generation,
        getContent: makeSourceNested({
          opts,
          sources: { random: source, custom: opts.custom },
          wordsCount: opts.random,
        }),
      };
    case GameModeKind.timer:
      const source_1 = await sourceGen;
      return {
        kind: GameModeKind.timer,
        isGenerated: opts.categorySelected.kind === CategoryKind.generation,
        time: opts.timer * 1000,
        getContent: makeSourceNested({
          opts,
          sources: { random: source_1, custom: opts.custom },
          wordsCount: 40,
        }),
      };
  }
};

export { getDefaultGameOptions, deepCopy, optionsToPending };
