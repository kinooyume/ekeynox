import { css } from "solid-styled";
import type { KeypressMetricsProjection } from "../metrics/KeypressMetrics";
import type { GameOptions } from "../gameSelection/GameOptions";
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
    .wpm-data {
      font-size: 3em;
      margin: 0;
    }
    .wpm-data span {
      font-size: 1.3rem;
      margin-left: 8px;
      opacity: 0.6;
    }
    .raw-data {
      opacity: 0.6;
      margin: 0;
    }
    .raw-data span {
      margin-left: 4px;
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
    return `${minutes}:${seconds}`;
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
          <AccuracyDoughnut stats={props.projection.stats}>
            <p class="wpm-data">
              {Math.trunc(props.projection.stats.speed.byWord[0])}
              <span>WPM</span>
            </p>
            <p class="raw-data">
              {props.projection.stats.speed.byKeypress[1].toFixed(2)}
              <span>Raw</span>
            </p>
          </AccuracyDoughnut>
          <p>
            {props.t("elapsedTime")}: {getTime(props.projection.core.duration)}
          </p>
        </div>
      </div>
      <div class="accuracies">
        <p class="title">{props.t("consistency")}</p>
        <div class="accuracies-data">
          <p class="consistency">
            {(props.projection.stats.consistency * 100).toFixed(2)}
          </p>
        </div>
      </div>
      <div class="bottom"></div>
    </div>
  );
};

export default DataMetricsResume;
