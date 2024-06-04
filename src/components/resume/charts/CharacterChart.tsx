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

import type { KeyResume } from "../../metrics/Metrics";
import { onMount } from "solid-js";

type CharacterCharProps = {
  keys: [KeyResume, Map<string, number>];
};

const CharacterChart = (props: CharacterCharProps) => {
  // get the first 10 words
  // const words = props.words.slice(0, 10);
  // const [labels, speeds] = words.reduce(
  //   ([labels, speeds], word) => {
  //     labels.push(word.word);
  //     speeds.push(Math.floor(word.averageWpm));
  //     return [labels, speeds];
  //   },
  //   [[] as string[], [] as number[]],
  // );

  let labels: string[] = [];
  let matches: number[] = [];
  let unmatches: number[] = [];
  let extras: number[] = [];
  let misses: number[] = [];
  let expected: number[] = [];

  Object.entries(props.keys[0]).forEach(([key, projection]) => {
    labels.push(key);
    matches.push(projection.match);
    unmatches.push(projection.unmatch);
    extras.push(projection.extra);
    misses.push(projection.missed);
    expected.push(-(props.keys[1].get(key) || 0));
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Matches",
        data: matches,
        backgroundColor: "#107b65",
      },
      {
        label: "Unmatches",
        data: unmatches,
        backgroundColor: "#a83f3f",
      },
      {
        label: "extras",
        data: extras,
        backgroundColor: "#2b5e7a",
      },
      {
        label: "misses",
        data: misses,
        backgroundColor: "#978679",
      },
      {
        label: "expected",
        data: expected,
        backgroundColor: "purple",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      tooltip: {
        callbacks: {
          // label: (context: ChartTooltipItem) => {
          // let ds = data.datasets[tooltipItem.datasetIndex];
          // return (
          //   ds.label + ": " + Math.abs(ds.data[tooltipItem.index] as number)
          // );
          // },
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value: number) => Math.abs(value),
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y2: {
        axis: "y",
        position: "right",
        stacked: true,
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

export default CharacterChart;
