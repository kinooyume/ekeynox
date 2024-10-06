import {
  Chart,
  CategoryScale,
  PointElement,
  Title,
  Tooltip,
  LinearScale,
  Legend,
  Colors,
  ArcElement,
  BarController,
  BarElement,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";

import { onMount } from "solid-js";
import { CharacterStatsResult } from "~/typingContent/character/stats";

type CharacterCharProps = {
  keys: CharacterStatsResult;
};

const CharacterChart = (props: CharacterCharProps) => {
  let labels: string[] = [];
  let matches: number[] = [];
  let unmatches: number[] = [];
  let corrected: number[] = [];
  let extras: number[] = [];
  let misses: number[] = [];

  Object.entries(props.keys[0]).forEach(([key, score]) => {
    labels.push(key);
    console.log(labels);
    matches.push(score.match);
    unmatches.push(score.unmatch);
    extras.push(score.extra);
    misses.push(score.missed);
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Matches",
        data: matches,
        backgroundColor: "#107b65",
        borderRadius: 10,
      },
      {
        label: "Unmatches",
        data: unmatches,
        backgroundColor: "#a83f3f",
        borderRadius: 10,
      },
      {
        label: "extras",
        data: extras,
        backgroundColor: "#2b5e7a",
        borderRadius: 10,
      },
      {
        label: "misses",
        data: misses,
        backgroundColor: "#978679",
        borderRadius: 10,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    labels: labels,
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
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value: number) => Math.abs(value),
        },
      },
      // y2: {
      //   axis: "y",
      //   position: "right",
      //   stacked: true,
      //   grid: {
      //     display: false,
      //   },
      // },
    },
  };
  css`
    .chart-wrapper {
      position: relative;
      display: block;
      width: 90%;
      overflow: hidden;
    }
    .chart {
      position: relative;
      width: 100%;
    }
  `;

  onMount(() => {
    Chart.register(
      CategoryScale,
      PointElement,
      Title,
      LinearScale,
      Tooltip,
      Legend,
      Colors,
      ArcElement,
      BarController,
      BarElement,
    );
  });
  return (
    <div class="chart-wrapper">
      <div class="chart">
        <DefaultChart
          type="bar"
          data={data}
          plugins={[
            CategoryScale,
            PointElement,
            Title,
            Tooltip,
            Legend,
            Colors,
            ArcElement,
            BarController,
            BarElement,
          ]}
          options={options}
        />
      </div>
    </div>
  );
};

export default CharacterChart;
