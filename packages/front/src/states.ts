import { Metrics, TypingStatisticsResult } from "~/typingStatistics/Metrics";

import { TypingOptions } from "~/typingOptions/typingOptions";
import { TypingGameOptions } from "~/typingOptions/typingGameOptions";

export enum PendingKind {
  new,
  redo,
}

export type PendingStatusNew = {
  kind: PendingKind.new;
  mode: TypingGameOptions;
};

export type PendingStatusRedo = {
  kind: PendingKind.redo;
  mode: TypingGameOptions;
  prev: TypingStatisticsResult;
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
  options: TypingOptions;
};

export type ResumeState = {
  kind: AppStateKind.resume;
  metrics: Metrics;
  content: TypingGameOptions;
};

export type AppState =
  | { kind: AppStateKind.menu }
  | PendingState
  | ResumeState
  | { kind: AppStateKind.loading }
  | { kind: AppStateKind.login };
