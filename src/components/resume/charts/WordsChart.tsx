import { onMount, For, type JSXElement } from "solid-js";
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

import type { WordSpeed } from "../../metrics/Metrics";

type WordMetricsResumeProps = {
  words: WordSpeed[];
};

const WordsChart = (props: WordMetricsResumeProps) => {
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
      <DefaultChart type="bar" data={data} options={options} />
    </div>
  );
};

export default WordsChart;
