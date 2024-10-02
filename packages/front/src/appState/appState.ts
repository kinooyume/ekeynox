import { GameModeKind } from "~/gameOptions/gameModeKind";
import { GameOptions } from "~/gameOptions/gameOptions";
import { GetContent } from "~/typingContent/TypingGameSource";
import { Metrics, MetricsResume } from "~/typingMetrics/Metrics";

// NOTE: Ca doit pas etre ici; je pense pas
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

export function deepCopyMode(source: PendingMode): PendingMode {
  if (source.kind === GameModeKind.speed) {
    return {
      kind: GameModeKind.speed,
      isGenerated: source.isGenerated,
      getContent: source.getContent,
    };
  } else {
    return {
      kind: GameModeKind.timer,
      isGenerated: source.isGenerated,
      time: source.time,
      getContent: source.getContent,
    };
  }
}

export enum PendingKind {
  new,
  redo,
}

export type PendingStatusNew = {
  kind: PendingKind.new;
  mode: PendingMode;
};

export type PendingStatusRedo = {
  kind: PendingKind.redo;
  mode: PendingMode;
  prev: MetricsResume;
};

export type PendingStatus = PendingStatusNew | PendingStatusRedo;

/* ***  */
export enum AppStateKind {
  loading,
  menu,
  pending,
  resume,
  login,
}

export type PendingState = {
  kind: AppStateKind.pending;
  status: Promise<PendingStatus>;
  options: GameOptions;
};

export type ResumeState = {
  kind: AppStateKind.resume;
  metrics: Metrics;
  content: PendingMode;
};

export type AppState =
  | { kind: AppStateKind.menu }
  | PendingState
  | ResumeState
  | { kind: AppStateKind.loading }
  | { kind: AppStateKind.login };
