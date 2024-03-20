import { onMount, type JSXElement } from "solid-js";
import {
  Chart,
  CategoryScale,
  PointElement,
  type ChartData,
  Title,
  Tooltip,
  Legend,
  Colors,
  DoughnutController,
  ArcElement,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";
import type { StatProjection } from "../../metrics/KeypressMetrics";

type MyChartProps = {
  stats: StatProjection;
  children: JSXElement;
};

const AccuracyDoughnut = (props: MyChartProps) => {
  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(
      CategoryScale,
      DoughnutController,
      PointElement,
      Title,
      Tooltip,
      ArcElement,
      Legend,
      Colors,
    );
  });

  const correct = props.stats.accuracies[1];
  const corrected = props.stats.accuracies[0] - props.stats.accuracies[1];
  const incorrect = 100 - props.stats.accuracies[0];
  const data = {
    datasets: [
      {
        data: [correct, corrected, incorrect],
        backgroundColor: ["#107b65", "#b16f4c", "#a83f3f"],
      },
    ],
  } as ChartData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
  };

  css`
    .chart {
      position: relative;
      width: 260px;
      height: 260px;
    }
    .center {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `;
  return (
    <div class="chart">
      <DefaultChart type="doughnut" data={data} options={options} />
      <div class="center">{props.children}</div>
    </div>
  );
};

export default AccuracyDoughnut;
