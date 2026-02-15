
import { TypingOptions } from "~/typingOptions/typingOptions";
import { TypingGameOptionsOptions } from "~/typingOptions/typingTypingOptions";
import { TypingStatistics, TypingStatisticsResult } from "./typingStatistics";

export enum PendingKind {
  new,
  redo,
}

export type PendingStatusNew = {
  kind: PendingKind.new;
  mode: TypingGameOptionsOptions;
};

export type PendingStatusRedo = {
  kind: PendingKind.redo;
  mode: TypingGameOptionsOptions;
  prev: TypingStatisticsResult;
};

export type PendingStatus = PendingStatusNew | PendingStatusRedo;

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
  statistics: TypingStatistics;
  content: TypingGameOptionsOptions;
};

export type AppState =
  | { kind: AppStateKind.menu }
  | PendingState
  | ResumeState
  | { kind: AppStateKind.loading }
  | { kind: AppStateKind.login };
