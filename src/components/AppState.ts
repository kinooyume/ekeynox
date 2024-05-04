import {
  makeSourceNested,
  type GetContent,
  type SourceProps,
} from "./content/TypingGameSource";
import { GameModeKind } from "./gameMode/GameMode";
import { CategoryKind, type GameOptions } from "./gameMode/GameOptions";
import type { Metrics, MetricsResume } from "./metrics/Metrics";

/* Pending Mode */

export type PendingMode =
  | {
      kind: GameModeKind.speed;
      isGenerated: boolean;
      getContent: GetContent;
    }
  | {
      kind: GameModeKind.timer;
      isGenerated: boolean;
      time: number;
      getContent: GetContent;
    };

const makePendingMode = (
  opts: GameOptions,
  sources: SourceProps,
): PendingMode => {
  switch (opts.modeSelected) {
    case GameModeKind.speed:
      return {
        kind: GameModeKind.speed,
        isGenerated: opts.categorySelected.kind === CategoryKind.generation,
        getContent: makeSourceNested({
          opts,
          sources,
          wordsCount: opts.random,
        }),
      };
    case GameModeKind.timer:
      return {
        kind: GameModeKind.timer,
        isGenerated: opts.categorySelected.kind === CategoryKind.generation,
        time: opts.timer * 1000,
        getContent: makeSourceNested({
          opts,
          sources,
          wordsCount: 40,
        }),
      };
  }
};

export enum PendingKind {
  new,
  redo,
}

export type PendingStatus =
  | {
      kind: PendingKind.new;
      mode: PendingMode;
    }
  | {
      kind: PendingKind.redo;
      mode: PendingMode;
      prev: MetricsResume;
    };

/* ***  */
export enum AppStateKind {
  menu,
  pending,
  resume,
}

export type AppState =
  | { kind: AppStateKind.menu }
  | {
      kind: AppStateKind.pending;
      data: PendingStatus;
    }
  | { kind: AppStateKind.resume; metrics: Metrics; content: PendingMode };

export { makePendingMode };
