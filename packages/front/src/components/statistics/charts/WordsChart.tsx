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
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";

import { onMount } from "solid-js";
import { WordSpeed } from "~/typingStatistics/averageWordWpm";

type WordTypingStatisticsResultProps = {
  words: WordSpeed[];
};

const WordsChart = (props: WordTypingStatisticsResultProps) => {
  // get the first 10 words
  const words = props.words.slice(0, 10);
  const [labels, speeds] = words.reduce(
    ([labels, speeds], word) => {
      labels.push(word.word);
      speeds.push(Math.floor(word.averageWpm));
      return [labels, speeds];
    },
    [[] as string[], [] as number[]],
  );

  const data = {
    labels,
    datasets: [
      {
        data: speeds,
        backgroundColor: "#2b5e7a",
        borderRadius: 10,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
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
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
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
        data={data}
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
        options={options}
      />
    </div>
  );
};

export default WordsChart;
