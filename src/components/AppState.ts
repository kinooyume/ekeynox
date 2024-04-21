import { type GameModeContent } from "./content/TypingGameSource";
import type { Metrics, MetricsResume } from "./metrics/Metrics";

export enum PendingKind {
  new,
  redo,
}

export type PendingStatus =
  | {
      kind: PendingKind.new;
      content: GameModeContent;
    }
  | {
      kind: PendingKind.redo;
      content: GameModeContent;
      prev: MetricsResume;
    };

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
  | { kind: AppStateKind.resume; metrics: Metrics; content: GameModeContent };
