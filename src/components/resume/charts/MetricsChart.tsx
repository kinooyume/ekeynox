import { onMount } from "solid-js";
import {
  Chart,
  LineController,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  type ChartData,
  Title,
  Tooltip,
  Legend,
  Colors,
  ScatterController,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";
import type { ChartMetrics } from "../../metrics/Metrics";

type MyChartProps = {
  metrics: ChartMetrics;
};
const MyChart = (props: MyChartProps) => {
  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(
      LineController,
      CategoryScale,
      PointElement,
      LineElement,
      LinearScale,
      Title,
      Tooltip,
      Legend,
      Colors,
      ScatterController,
    );
  });

  const data = {
    datasets: [
      {
        type: "line",
        label: "WPM",
        order: 2,
        yAxisID: "wpm",
        borderColor: "#744307",
        data: props.metrics.wpm,
      },
      {
        type: "line",
        label: "Raw",
        order: 3,
        yAxisID: "raw",
        borderColor: "#0f2c4e",
        data: props.metrics.raw,
      },
      {
        type: "scatter",
        label: "Errors",
        yAxisID: "error",
        pointStyle: "crossRot",
        showLine: false,
        order: 1,
        borderColor: "#ff0000",
        data: props.metrics.errors,
      },
    ],
  } as ChartData;

  css`
    .chart {
      width: 1024px;
      height: 300px;
    }
  `;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    tension: 0.4,
    scales: {
      x: {
        axis: "x",
        type: "linear",
        display: true,
        min: 1,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Seconds",
        },
      },
      wpm: {
        axis: "y",
        display: true,
        title: {
          display: true,
          text: "Speed",
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: true,
        },
      },
      raw: {
        axis: "y",
        display: false,
        title: {
          display: true,
          text: "Raw Words per Minute",
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          precision: 0,
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: false,
        },
      },
      error: {
        axis: "y",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Errors",
        },
        beginAtZero: true,
        ticks: {
          precision: 0,
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div class="chart">
      <DefaultChart data={data} options={options} />
    </div>
  );
};

export default MyChart;
