import type { MetricsResume } from "../metrics/Metrics";

export type ActionsResumeProps = {
  t: Translator;
  gameOptions: GameOptions;
  content: PendingMode;
  metrics: Metrics;
  metricsResume: MetricsResume;
  setContentGeneration: (type: ContentGeneration) => void;
  start: (opts: GameOptions, customSource: string) => void;
  redo: (content: PendingMode, metrics: MetricsResume) => void;
};

