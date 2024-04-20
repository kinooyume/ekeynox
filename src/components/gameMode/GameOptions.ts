import { GameModeKind } from "./GameMode";

// TODO: should we build it from folder/files ?
export type Languages = "en" | "fr";

export enum WordsGenerationCategory {
  words1k = "words1k",
  quotes = "quotes",
}

export type ContentGeneration = {
  category: WordsGenerationCategory;
  language: Languages;
  infinite: boolean;
};

export enum ContentTypeKind {
  generation,
  custom,
}

export type ContentType =
  | { kind: ContentTypeKind.custom }
  | { kind: ContentTypeKind.generation; category: WordsGenerationCategory };

export enum NumberSelectionType {
  selected,
  custom,
}

export type NumberSelection =
  | { type: NumberSelectionType.selected; value: number }
  | { type: NumberSelectionType.custom; value: number };

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
  mode: GameModeKind;
  contentType: ContentType;
  generation: ContentGeneration;
  custom: string;
  random: NumberSelection;
  timer: NumberSelection;
};

const getDefaultGameOptions = (): GameOptions => ({
  mode: GameModeKind.random,
  contentType: {
    kind: ContentTypeKind.generation,
    category: WordsGenerationCategory.words1k,
  },
  generation: {
    category: WordsGenerationCategory.words1k,
    language: "en",
    infinite: true,
  },
  custom: "",
  random: { type: NumberSelectionType.selected, value: 10 },
  timer: { type: NumberSelectionType.selected, value: 10 },
});

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export { getDefaultGameOptions, deepCopy };
