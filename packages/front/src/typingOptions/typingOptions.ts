import { makeSourceNested } from "~/typingContent/TypingGameSource";
// NOTE: Je pense qu'on peut remettre typingModeKind ici non ? 
import { TypingModeKind } from "./typingModeKind";
import {  TypingGameOptions } from "./typingGameOptions";
import { Category, CategoryKind, GenerationCategory } from "./typingModeCategory";
import { Languages } from "./typingModeLanguage";

// NOTE:  TypingOptions -> TypingGameOptionsOptions

export type ContentGeneration = {
  category: GenerationCategory;
  language: Languages;
};

export type TypingOptions = {
  modeSelected: TypingModeKind;
  categorySelected: Category;
  generation: ContentGeneration;
  custom: string;
  wordCount: number;
  timer: number;
};
// Default Game Options
const getDefaultTypingOptions = (): TypingOptions => ({
  modeSelected: TypingModeKind.speed,
  categorySelected: {
    kind: CategoryKind.generation,
    category: GenerationCategory.words1k,
  },
  generation: {
    category: GenerationCategory.words1k,
    language: "en",
  },
  custom: "",
  wordCount: 10,
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
          wordsCount: opts.wordCount,
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

export { getDefaultTypingOptions, deepCopy, optionsToPending };
