import { makeSourceNested } from "~/typingContent/TypingGameSource";
// NOTE: Je pense qu'on peut remettre typingModeKind ici non ? 
import { TypingModeKind } from "./typingModeKind";
import { TypingGameOptions } from "./typingGameOptions";

// NOTE:  TypingOptions -> TypingGameOptions

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

// NOTE: C'est ici !

export type TypingOptions = {
  modeSelected: TypingModeKind;
  categorySelected: Category;
  generation: ContentGeneration;
  custom: string;
  random: number;
  timer: number;
};
// Default Game Options
const getDefaultGameOptions = (): TypingOptions => ({
  modeSelected: TypingModeKind.speed,
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

// Deep copy
const deepCopy = (source: TypingOptions): TypingOptions => ({
  ...source,
  categorySelected: { ...source.categorySelected },
  generation: { ...source.generation },
});

// Convert to PendingMode
const optionsToPending = async (
  opts: TypingOptions,
  sourceGen: Promise<string[]>,
): Promise<TypingGameOptions> => {
  switch (opts.modeSelected) {
    case TypingModeKind.speed:
      return sourceGen.then((source) => ({
        kind: TypingModeKind.speed,
        isGenerated: opts.categorySelected.kind === CategoryKind.generation,
        getContent: makeSourceNested({
          opts,
          sources: { random: source, custom: opts.custom },
          wordsCount: opts.random,
        }),
      }));
    case TypingModeKind.timer:
      return sourceGen.then((source) => ({
        kind: TypingModeKind.timer,
        isGenerated: opts.categorySelected.kind === CategoryKind.generation,
        time: opts.timer * 1000,
        getContent: makeSourceNested({
          opts,
          sources: { random: source, custom: opts.custom },
          wordsCount: 40,
        }),
      }));
  }
};

export { getDefaultGameOptions, deepCopy, optionsToPending };

/* *** */
// NOTE: Do we need this ?
//
// export type WordsCategory =
//   | {
//       kind: WordsCategoryKind.words1k;
//       data: string[];
//     }
//   | { kind: WordsCategoryKind.quotes; data: string[] }
//   | { kind: WordsCategoryKind.custom; data: string };
//
/* __ */


/*
 * NOTE: shoulwe merge contentType/generation ?
 * ==> We want to keep last generation config
 *
 */

// type Selected = {
//   mode: TypingModeKind;
//   category: CategoryKind;
// };
