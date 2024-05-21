import { css } from "solid-styled";
import type { KeypressMetricsProjection } from "../metrics/KeypressMetrics";
import type { GameOptions } from "../gameMode/GameOptions";
import type { Translator } from "../App";
import AccuracyDoughnut from "./charts/AccuracyDoughnut";

type DataMetricsResumeProps = {
  t: Translator;
  projection: KeypressMetricsProjection;
  currentGameOptions: GameOptions;
};

const DataMetricsResume = (props: DataMetricsResumeProps) => {
  css`
    .data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
    }
    .speeds {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .speed-data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .title {
      font-size: 1.8rem;
      margin: 0;
    }
    .accuracies-data {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `;

  const getTime = (duration: number) => {
    // from miliseconds to minutes and seconds
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    const secString = `${seconds}s`
    if (minutes === 0) return secString;
    return `${minutes}m${secString}`;
  };

  css`
    .actions {
      display: flex;
      gap: 1rem;
    }
  `;
  return (
    <div class="data">
      <div class="speeds">
        <div class="speed-data">
          
        </div>
      </div>
          <p>
            {props.t("elapsedTime")}: {getTime(props.projection.core.duration)}
          </p>
      <p>
        {(props.projection.stats.consistency * 100).toFixed(0)}% 
         {props.t("consistency")}
      </p>
    </div>
  );
};

export default DataMetricsResume;
