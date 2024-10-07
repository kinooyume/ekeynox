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

  const seriesData = [
    Math.round(correct * 100) / 100,
    Math.round(corrected * 100) / 100,
    Math.round(incorrect * 100) / 100,
  ];
  const total = seriesData.reduce((a, v) => a + v);
  const inPercent = seriesData.map((v) =>
    v ? Math.max((v / total) * 100, 2) : v,
  );

  // make dynamicLabels i seriesData index is > 0
  const dynamicLabels = seriesData.reduce((acc, v, i) => {
    if (v > 0) {
      acc.push(`${v}%`);
    }
    return acc;
  }, [] as string[]);

  const bgColors = ["#107b65", "#b16f4c", "#a83f3f"];
  const dynamicBackground = seriesData.reduce((acc, v, i) => {
    if (v > 0) acc.push(bgColors[i]);
    return acc;
  }, [] as string[]);

  const data = {
    datasets: [
      {
        data: inPercent,
        backgroundColor: dynamicBackground,
      },
    ],
    labels: dynamicLabels,
  } as ChartData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    rotation: -95,
    circumference: 190,
    plugins: {
      legend: {
        position: "bottom",
        title: {
          display: true,
          padding: 1,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            var value = seriesData[tooltipItem.dataIndex];
            return `${value}`;
          },
        },
      },
    },
  } as ChartOptions;

  css`
    .chart {
      position: relative;
      width: 380px;
      height: 200px;
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
