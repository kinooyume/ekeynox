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
  ChartData,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";

import { createComputed, createSignal, onMount } from "solid-js";
import { CharacterStatsResult } from "~/typingContent/character/stats";
import { mergeCharacterScore } from "~/typingContent/character/stats/score";
import { useWindowSize } from "@solid-primitives/resize-observer";
import { useSettings } from "~/contexts/SettingsProvider";

type CharacterCharProps = {
  keys: CharacterStatsResult;
};

const CharacterChart = (props: CharacterCharProps) => {
  let labels: string[] = [];
  let matches: number[] = [];
  let unmatches: number[] = [];
  let extras: number[] = [];
  let misses: number[] = [];

  Object.entries(props.keys[0]).forEach(([key, scoreFull]) => {
    labels.push(key);
    const score = mergeCharacterScore(scoreFull);

    matches.push(score.match);
    unmatches.push(score.unmatch);
    extras.push(score.extra);
    misses.push(score.missed);
  });

  type CharColors = {
    matches: string;
    unmatches: string;
    extras: string;
  };

  type OptionsColors = {
    grid: string;
    text: string;
    textBottom: string;
  };

  let lightOptionsColors: OptionsColors = {
    text: "#654f3e",
    textBottom: "rgb(0, 31, 63)",
    grid: "rgba(0, 31, 63, 0.2)",
  };
  let darkOptionsColors: OptionsColors = {
    text: "#f8dbb6",
    textBottom: "#f6f5f7",
    grid: "rgba(246, 245, 247, 0.2)",
  };
  const darkColors: CharColors = {
    matches: "#107b65",
    unmatches: "#a83f3f",
    extras: "#b16f4c",
  };

  const lightColors: CharColors = {
    matches: "#9abc85",
    unmatches: "#c26b5f",
    extras: "#cbae5c",
  };

  const getData = (colors: CharColors) => ({
    labels,
    datasets: [
      {
        label: "Matches",
        data: matches,
        backgroundColor: colors.matches,
        borderRadius: 10,
      },
      {
        label: "Unmatches",
        data: unmatches,
        backgroundColor: colors.unmatches,
        borderRadius: 10,
      },
      {
        label: "extras",
        data: extras,
        backgroundColor: colors.extras,
        borderRadius: 10,
      },
      // {
      //   label: "misses",
      //   data: misses,
      //   backgroundColor: "#978679",
      //   borderRadius: 10,
      // },
    ],
  });
  const getOptions = (colors: OptionsColors) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    labels: labels,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
        color: colors.text,
        labels: {
          color: colors.text,
        },
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
          color: colors.text,
          font: {
            size: 15,
            weight: "normal",
            family: "Larsseit, system-ui, sans-serif",
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: true,
          color: colors.grid,
          lineWidth: 1,
        },
        ticks: {
          callback: (value: number) => Math.abs(value),
          color: colors.textBottom,
          font: {
            size: 13,
            weight: "normal",
            family: "Larsseit, system-ui, sans-serif",
          },
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
  });
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
          data={data()}
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
          options={options()}
        />
      </div>
    </div>
  );
};

export default CharacterChart;
