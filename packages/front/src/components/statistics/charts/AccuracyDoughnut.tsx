import {
  Chart,
  CategoryScale,
  PointElement,
  type ChartData,
  type ChartOptions,
  Title,
  Tooltip,
  Legend,
  Colors,
  DoughnutController,
  ArcElement,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";
import { onMount, type JSXElement } from "solid-js";
import { StatProjection } from "~/typingStatistics/KeypressMetrics";

type MyChartProps = {
  stats: StatProjection;
  children: JSXElement;
};

const AccuracyDoughnut = (props: MyChartProps) => {
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

  type OverlapSegment = {
    radius: number;
    color: string;
    coordinates: { x: number; y: number }[];
  };

  // https://stackoverflow.com/questions/54670302/small-value-in-doughnut-chart-is-not-visible-chartjs/54692344#54692344

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    rotation: -95,
    circumference: 190,
    plugins: {
      tooltip: {
        },
    },
  } as ChartOptions;

  css`
    .chart {
      position: relative;
      width: 280px;
      height: 160px;
    }
    .center {
      position: absolute;
      top: 0;
      left: 0;
      height: 60px;
      margin-top: 70px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `;

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
      // overlappingSegments,
    );
  });
  return (
    <div class="chart">
      <div class="center">{props.children}</div>
      <DefaultChart
        type="doughnut"
        data={data}
        plugins={[
          CategoryScale,
          DoughnutController,
          PointElement,
          Title,
          Tooltip,
          ArcElement,
          Legend,
          Colors,
          // overlappingSegments,
        ]}
        options={options}
      />
    </div>
  );
};

export default AccuracyDoughnut;
