import {
  LineController,
  PointElement,
  LineElement,
  LinearScale,
  type ChartData,
  Tooltip,
  Colors,
  ScatterController,
  Chart,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";
import type { ChartMetrics } from "../../metrics/Metrics";
import { onMount } from "solid-js";

type MyChartProps = {
  metrics: ChartMetrics;
};
const MyChart = (props: MyChartProps) => {
  const data = {
    datasets: [
      {
        type: "line",
        label: "WPM",
        order: 2,
        yAxisID: "wpm",
        borderColor: "#8c583c",
        data: props.metrics.wpm,
        // fill: true,
        // gradient: {
        //   backgroundColor: {
        //     axis: "y",
        //     colors: {
        //       0: "rgba(0, 0, 0, 0)",
        //       100: "#b16f4c",
        //     },
        //   },
        // },
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
      width: 100%;
      height: 300px;
    }
  `;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: true,
      },
    },
    tension: 0.4,
    scales: {
      x: {
        axis: "x",
        type: "linear",
        display: true,
        ticks: {
          precision: 0,
          autoSkip: true,
          autoSkipPadding: 20,
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
        ticks: {
          precision: 0,
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

  onMount(() => {
    Chart.register(LineController, PointElement, LineElement, LinearScale, Tooltip, Colors, ScatterController );
  })

  return (
    <div class="chart">
      <DefaultChart
        data={data}
        plugins={[
          LineController,
          PointElement,
          LineElement,
          LinearScale,
          Tooltip,
          Colors,
          ScatterController,
        ]}
        options={options}
      />
    </div>
  );
};

export default MyChart;
