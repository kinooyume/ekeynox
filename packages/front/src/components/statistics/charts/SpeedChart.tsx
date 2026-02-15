import {
  LineController,
  PointElement,
  LineElement,
  Filler,
  LinearScale,
  ChartArea,
  type ChartData,
  Tooltip,
  Colors,
  ScatterController,
  Chart,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";
import { createComputed, createSignal, onMount } from "solid-js";
import { ChartMetrics } from "~/typingStatistics/charts";
import { useWindowSize } from "@solid-primitives/resize-observer";
import { useSettings } from "~/contexts/SettingsProvider";

type MyChartProps = {
  metrics: ChartMetrics;
};

type DataColors = {
  wpm: string;
  backgroundWpm: string;
  raw: string;
  backgroundRaw: string;
  pointBorder: string;
  error: string;
  errorBorder: string;
};

type OptionsColors = {
  grid: string;
  text: string;
  textBottom: string;
};

const getOptions = (colors: OptionsColors) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      display: true,
      labels: {
        color: colors.text,
        padding: 20,
      },
    },
    tooltip: {
      mode: "index",
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
        color: colors.text,
        font: {
          size: 13,
          weight: "normal",
          family: "Larsseit, system-ui, sans-serif",
        },
      },
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: "Seconds",
        color: colors.textBottom,
        font: {
          size: 16,
          weight: "semi-bold",
          family: "Larsseit, system-ui, sans-serif",
        },
      },
    },
    wpm: {
      axis: "y",
      display: true,
      title: {
        display: true,
        text: "Speed",
        color: colors.textBottom,
        font: {
          size: 16,
          weight: "normal",
          family: "Larsseit, system-ui, sans-serif",
        },
      },
      beginAtZero: true,
      ticks: {
        precision: 0,
        autoSkip: true,
        autoSkipPadding: 20,
        color: colors.text,
        font: {
          size: 15,
          weight: "normal",
          family: "Larsseit, system-ui, sans-serif",
        },
      },
      grid: {
        display: true,
        color: colors.grid,
        lineWidth: 2,
      },
    },
    raw: {
      axis: "y",
      display: false,
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
        color: colors.textBottom,
        font: {
          size: 16,
          weight: "normal",
          family: "Larsseit, system-ui, sans-serif",
        },
      },
      beginAtZero: true,
      ticks: {
        precision: 0,
        autoSkip: true,
        autoSkipPadding: 20,

        color: colors.text,

        font: {
          size: 15,
          weight: "normal",
          family: "Larsseit, system-ui, sans-serif",
        },
      },
      grid: {
        display: false,
      },
    },
  },
});

const lightColors: DataColors = {
  wpm: "#654f3e",
  backgroundWpm: "rgba(101, 79, 62, 0.1)",
  raw: "#978679",
  backgroundRaw: "rgba(134, 115, 101, 0.3)",
  pointBorder: "#e1c89b",
  errorBorder: "#e7eef4",
  error: "#c26b5f",
};
const darkColors: DataColors = {
  wpm: "#f2c992",
  backgroundWpm: "rgba(242, 201, 146, 0.1)",
  raw: "#978679",
  pointBorder: "#654f3e",
  backgroundRaw: "rgba(134, 115, 101, 0.3)",
  errorBorder: "#181927",
  error: "#a83f3f",
};

let lightOptionsColor: OptionsColors = {
  text: "rgb(0, 31, 63)",
  textBottom: "#654f3e",
  grid: "rgba(0, 31, 63, 0.2)",
};
let darkOptionsColor: OptionsColors = {
  text: "#f6f5f7",
  textBottom: "#f8dbb6",
  grid: "rgba(246, 245, 247, 0.2)",
};

const MyChart = (props: MyChartProps) => {
  const dataOrigin = (colors: DataColors): ChartData => {
    return {
      datasets: [
        {
          type: "line",
          label: "WPM",
          order: 2,
          yAxisID: "wpm",
          borderColor: colors.wpm,
          pointBackgroundColor: colors.wpm,
          borderWidth: 3,
          pointRadius: 5,
          pointBorderColor: colors.pointBorder,
          pointBorderWidth: 2,
          fill: true,
          backgroundColor: colors.backgroundWpm,
          data: props.metrics.wpm,
        },
        {
          type: "line",
          label: "Raw",
          order: 3,
          yAxisID: "wpm",
          fill: true,
          borderColor: colors.raw,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: colors.raw,
          pointBorderColor: colors.pointBorder,
          pointBorderWidth: 2,
          backgroundColor: colors.backgroundRaw,
          data: props.metrics.raw,
        },
        {
          type: "scatter",
          label: "Errors",
          yAxisID: "error",
          pointStyle: "circle",
          showLine: false,
          order: 1,
          pointRadius: 5,
          borderWidth: 1,
          pointBackgroundColor: colors.error,
          pointBorderColor: colors.errorBorder,
          data: props.metrics.errors,
        },
      ],
    } as ChartData;
  };

  css`
    .chart {
      width: 100%;
      height: 320px;
    }
  `;

  const { dark } = useSettings();
  const size = useWindowSize();

  const [data, setData] = createSignal<ChartData>();
  const [options, setOptions] = createSignal();

  createComputed(() => {
    if (dark()) {
      setData(dataOrigin(darkColors));
      setOptions(getOptions(darkOptionsColor));
    } else {
      setData(dataOrigin(lightColors));
      setOptions(getOptions(lightOptionsColor));
    }
  });

  onMount(() => {
    Chart.register(
      LineController,
      PointElement,
      LineElement,
      LinearScale,
      Tooltip,
      Colors,
      Filler,
      ScatterController,
    );
  });

  return (
    <div class="chart">
      <DefaultChart
        data={data()}
        plugins={[
          LineController,
          PointElement,
          LineElement,
          LinearScale,
          Tooltip,
          Colors,
          ScatterController,
          Filler,
        ]}
        options={options()}
      />
    </div>
  );
};

export default MyChart;
