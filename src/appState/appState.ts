import { GameModeKind } from "~/gameOptions/gameModeKind";
import { type GetContent } from "../components/content/TypingGameSource";
import type { Metrics, MetricsResume } from "../components/metrics/Metrics";
import { GameOptions } from "~/gameOptions/gameOptions";

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
  loading,
  menu,
  pending,
  resume,
}

export type PendingState = {
  kind: AppStateKind.pending;
  status: Promise<PendingStatus>;
  options: GameOptions;
};

export type AppState =
  | { kind: AppStateKind.menu }
  | PendingState
  | { kind: AppStateKind.resume; metrics: Metrics; content: PendingMode }
  | { kind: AppStateKind.loading };
