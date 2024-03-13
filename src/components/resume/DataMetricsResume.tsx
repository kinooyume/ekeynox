import { css } from "solid-styled";
import type { KeypressMetricsProjection } from "../metrics/KeypressMetrics";
import type { GameOptions } from "../gameSelection/GameOptions";
import type { Translator } from "../App";
import type { ContentData } from "../content/Content";

type DataMetricsResumeProps = {
  projection: KeypressMetricsProjection;
  onReset: () => void;
  t: Translator;
  currentGameOptions: GameOptions;
  setGameOptions: (options: GameOptions) => void;
  setContent: (content: ContentData) => void;
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
      font-size: 4em;
      margin: 0;
    }
    .wpm-data span {
      font-size: 1.5rem;
      margin-left: 8px;
      opacity: 0.6;
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
    .accu-data {
      font-size: 2em;
      margin: 0;
    }
    .accu-data span {
      font-size: 1.5rem;
      opacity: 0.6;
    }
    .accu-real {
      font-size: 1.8rem;
    }
    .accu-real-data span {
      font-size: 0.9rem;
      opacity: 0.6;
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
        <p class="title">{props.t("speed")}</p>
        <div class="speed-data">
          <p class="wpm-data">
            {props.projection.stats.speed.byWord[0].toFixed(2)}
            <span>WPM</span>
          </p>
          <p class="raw-data">
            {props.projection.stats.speed.byKeypress[1].toFixed(2)}
            <span>Raw</span>
          </p>
          <p>
            {props.t("elapsedTime")}: {getTime(props.projection.core.duration)}
          </p>
        </div>
      </div>
      <div class="accuracies">
        <p class="title">{props.t("accuracy")}</p>
        <div class="accuracies-data">
          <p class="accu-data">
            {Math.trunc(props.projection.stats.accuracies[0])}
            <span>%</span>
          </p>
          <p class="accu-real-data">
            {props.t("real")} :{" "}
            {props.projection.stats.accuracies[1].toFixed(2)}
            <span>%</span>
          </p>
          <p class="consistency">
            {props.t("consistency")}:{" "}
            {(props.projection.stats.consistency * 100).toFixed(2)}
          </p>
        </div>
      </div>
      <div class="bottom"></div>
    </div>
  );
};

export default DataMetricsResume;
