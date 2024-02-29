import { css } from "solid-styled";
import type { TypingMetrics } from "./TypingMetrics";
import TypingKeyboardResume from "./TypingKeyboardResume";
import type { KeysProjection } from "./KeysProjection";
import type { KeyboardLayout } from "./KeyboardLayout";
import MetricsChart from "./MetricsChart";
import DataMetricsResume from "./DataMetricsResume";
import type { Paragraphs } from "./Content";
import Prompt from "./Prompt";
import WordMetricsResume from "./WordMetricsResume";
import type { SetStoreFunction } from "solid-js/store";
import type { I18nContext } from "./App";

type TypingMetricsProps = {
  metrics: TypingMetrics;
  layout: KeyboardLayout;
  keyMetrics: KeysProjection;
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  onReset: () => void;
  i18n: I18nContext;
};

const TypingMetricsResume = (props: TypingMetricsProps) => {
  css`
    .metrics {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .keyboard {
      margin-top: 64px;
    }
    .reset {
      margin: 64px;
    }
    .details {
      max-width: 1200px;
      margin-right: 198px;
    }
  `;
  return (
    <div class="metrics">
      <DataMetricsResume
        i18n={props.i18n}
        projection={props.metrics.projection}
        onReset={props.onReset}
      />
      <div class="details">
        <div class="chart">
          <MetricsChart metrics={props.metrics} />
        </div>
        <div class="keyboard">
          <TypingKeyboardResume
            layout={props.layout}
            metrics={props.keyMetrics}
          />
        </div>
      </div>
      <WordMetricsResume paragraphs={props.paragraphs} />
      <Prompt
        paragraphs={props.paragraphs}
        setParagraphs={props.setParagraphs}
      />
    </div>
  );
};

export default TypingMetricsResume;
