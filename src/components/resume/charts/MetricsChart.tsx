import { createComputed, createSignal, onMount } from "solid-js";
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
import type { TypingMetrics } from "../../metrics/TypingMetrics";
import { css } from "solid-styled";

type MyChartProps = {
  metrics: TypingMetrics;
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

  const [data, setData] = createSignal<ChartData | undefined>();

  css`
    .chart {
      width: 1024px;
      height: 300px;
    }
  `;
  createComputed(() => {
    let labels = [] as string[];
    let wpm = [] as { x: number; y: number }[];
    let raw = [] as { x: number; y: number }[];
    let incorrect = [] as { x: number; y: number }[];

    let log = props.metrics.logs;
    let prevElapsed = -1;
    while (log) {
      const elapsed = Math.round(log.value.core.duration / 1000);
      console.log(elapsed);
      if (prevElapsed !== elapsed) {
        labels.push(elapsed.toString());
        wpm.push({ x: elapsed, y: log.value.stats.speed.byWord[0] });
        raw.push({ x: elapsed, y: log.value.stats.speed.byKeypress[1] });
        let secProj = log.value.meta.sectionProjection;
        let wrong = secProj.incorrect + secProj.missed + secProj.extra;
        if (wrong > 0) {
          incorrect.push({ x: elapsed, y: wrong });
        }
      }
      prevElapsed = elapsed;
      log = log.next;
    }
    setData({
      datasets: [
        {
          type: "line",
          label: "WPM",
          order: 2,
          yAxisID: "wpm",
          borderColor: "#744307",
          data: wpm,
        },
        {
          type: "line",
          label: "Raw",
          order: 3,
          yAxisID: "raw",
          borderColor: "#0f2c4e",
          data: raw,
        },
        {
          type: "scatter",
          label: "Errors",
          yAxisID: "error",
          pointStyle: "crossRot",
          showLine: false,
          order: 1,
          borderColor: "#ff0000",
          data: incorrect,
        },
      ],
    });
  });
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
      <DefaultChart data={data()} options={options} />
    </div>
  );
};

export default MyChart;
