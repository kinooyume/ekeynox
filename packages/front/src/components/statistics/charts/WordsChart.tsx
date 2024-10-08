import {
  Chart,
  CategoryScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  ArcElement,
  BarController,
  BarElement,
  ChartData,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";

import { createComputed, createSignal, onMount } from "solid-js";
import { WordSpeed } from "~/typingStatistics/averageWordWpm";
import { useWindowSize } from "@solid-primitives/resize-observer";
import { useSettings } from "~/contexts/SettingsProvider";

type WordTypingStatisticsResultProps = {
  words: WordSpeed[];
};

const WordsChart = (props: WordTypingStatisticsResultProps) => {
  // get the first 10 words
  const words = props.words.slice(0, 10);
  // const words = props.words;
  // NOTE: ??
  const [labels, speeds] = words.reduce(
    ([labels, speeds], word) => {
      labels.push(word.word);
      speeds.push(Math.floor(word.averageWpm));
      return [labels, speeds];
    },
    [[] as string[], [] as number[]],
  );

  type ChartColors = {
    background: string;
    border: string;
  };

  type OptionsColors = {
    text: string;
    textBottom: string;
    grid: string;
  };
  let lightOptionsColors: OptionsColors = {
    grid: "rgba(0, 31, 63, 0.2)",
    text: "#654f3e",
    textBottom: "rgb(0, 31, 63)",
  };
  let darkOptionsColors: OptionsColors = {
    text: "#f8dbb6",
    textBottom: "#f6f5f7",
    grid: "rgba(246, 245, 247, 0.2)",
  };

  const lightColors: ChartColors = {
    background: "#e1c89b",
    border: "#654f3e",
  };
  const darkColors: ChartColors = {
    background: "#654f3e",
    border: "#f2c992",
  };
  const getData = (colors: ChartColors) => ({
    labels,
    datasets: [
      {
        data: speeds,
        backgroundColor: colors.background,
        borderRadius: 10,
      },
    ],
  });
  const getOptions = (colors: OptionsColors) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
        color: colors.text,
      },
      labels: {
        color: colors.text,
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },

    scales: {
      x: {
        grid: {
          display: true,
          color: colors.grid,
          lineWidth: 1,
        },
        ticks: {
          color: colors.textBottom,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 15,
            weight: "normal",
            family: "Larsseit, system-ui, sans-serif",
          },
        },
      },
    },
  });

  css`
    .chart {
      position: relative;
      width: 90%;
      height: 400px;
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

  const { dark } = useSettings();
  const size = useWindowSize();

  const [data, setData] = createSignal<ChartData>();
  const [options, setOptions] = createSignal();

  createComputed(() => {
    if (dark()) {
      setData(getData(darkColors));
      setOptions(getOptions(darkOptionsColors));
    } else {
      setData(getData(lightColors));
      setOptions(getOptions(lightOptionsColors));
    }
  });

  onMount(() => {
    Chart.register(
      CategoryScale,
      PointElement,
      Title,
      Tooltip,
      Legend,
      Colors,
      ArcElement,
      BarController,
      BarElement,
    );
  });
  return (
    <div class="chart">
      <DefaultChart
        type="bar"
        data={data()}
        plugins={[
          CategoryScale,
          PointElement,
          BarController,
          BarElement,
          Title,
          Tooltip,
          ArcElement,
          Legend,
          Colors,
        ]}
        options={options()}
      />
    </div>
  );
};

export default WordsChart;
