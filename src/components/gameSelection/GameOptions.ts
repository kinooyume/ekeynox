import type { ContentData } from "../content/Content";

export type Languages = "en" | "fr";

export enum WordsGenerationCategory {
  words1k = "words1k",
  quotes = "quotes",
}

export type ContentGeneration = {
  category: WordsGenerationCategory;
  language: Languages;
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

export enum GameStatusKind {
  menu,
  pending,
  resume,
}

export type GameStatus =
  | { kind: GameStatusKind.menu }
  | { kind: GameStatusKind.pending; content: GameModeContent }
  | { kind: GameStatusKind.resume };

export enum GameModeKind {
  monkey = "monkey",
  rabbit = "rabbit",
}

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

export type GameMode =
  | {
      kind: GameModeKind.monkey;
      number: NumberSelection;
      category: WordsCategory;
    }
  | {
      kind: GameModeKind.rabbit;
      time: NumberSelection;
      category: WordsCategory;
    };
/* __ */

export type GameModeContent =
  | {
      kind: GameModeKind.monkey;
      getContent: () => ContentData;
    }
  | {
      kind: GameModeKind.rabbit;
      getContent: () => ContentData;
      time: number;
    };

export type GameOptions = {
  mode: GameModeKind;
  contentType: ContentType;
  generation: ContentGeneration;
  custom: string;
  random: NumberSelection;
  timer: NumberSelection;
};

const getDefaultGameOptions = () : GameOptions => ({
  mode: GameModeKind.monkey,
  contentType: {
    kind: ContentTypeKind.generation,
    category: WordsGenerationCategory.words1k,
  },
  generation: {
    category: WordsGenerationCategory.words1k,
    language: "en",
  },
  custom: "",
  random: { type: NumberSelectionType.selected, value: 10 },
  timer: { type: NumberSelectionType.selected, value: 10 },
});

export { getDefaultGameOptions };
