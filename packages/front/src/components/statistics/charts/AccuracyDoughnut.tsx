import {
  Chart,
  CategoryScale,
  PointElement,
  type ChartData,
  type ChartOptions,
  Title,
  Tooltip,
  Legend,
  Colors,
  DoughnutController,
  ArcElement,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import { css } from "solid-styled";
import {
  createComputed,
  createSignal,
  onMount,
  type JSXElement,
} from "solid-js";
import { StatProjection } from "~/typingStatistics/KeypressMetrics";
import { useSettings } from "~/contexts/SettingsProvider";
import { useWindowSize } from "@solid-primitives/resize-observer";

type MyChartProps = {
  stats: StatProjection;
  children: JSXElement;
};

const AccuracyDoughnut = (props: MyChartProps) => {
  const correct = props.stats.accuracies[1];
  const corrected = props.stats.accuracies[0] - props.stats.accuracies[1];
  const incorrect = 100 - props.stats.accuracies[0];

  const seriesData = [
    Math.round(correct * 100) / 100,
    Math.round(corrected * 100) / 100,
    Math.round(incorrect * 100) / 100,
  ];
  const total = seriesData.reduce((a, v) => a + v);

  const inPercent = seriesData.reduce((acc, v) => {
    if (v > 0) acc.push(v);
    return acc;
  }, [] as number[]);
  // make dynamicLabels i seriesData index is > 0
  const dynamicLabels = seriesData.reduce((acc, v, i) => {
    if (v > 0) {
      acc.push(`${v}%`);
    }
    return acc;
  }, [] as string[]);

  type BgColors = string[];

  const darkColors = ["#107b65", "#b16f4c", "#a83f3f"];
  const lightColors = ["#9abc85", "#cbae5c", "#c26b5f"];

  type FontColor = string;

  let lightColor: FontColor = "rgb(0, 31, 63)";
  let darkColor: FontColor = "#f6f5f7";

  const dynamicBackground = (bgColors: BgColors) => {
    const a = seriesData.reduce((acc, v, i) => {
      if (v > 0) acc.push(bgColors[i]);
      return acc;
    }, [] as string[]);
    return a;
  };

  const getData = (bgColors: BgColors) => {
    return {
      datasets: [
        {
          data: inPercent,
          backgroundColor: dynamicBackground(bgColors),
        },
      ],
      labels: dynamicLabels,
    } as ChartData;
  };

  const getOptions = (fontColor: FontColor) =>
    ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "86%",
      rotation: -95,
      borderRadius: 5,
      borderWidth: 2,
      circumference: 190,
      plugins: {
        legend: {
          position: "bottom",
          title: {
            display: true,
            padding: 1,
          },
          labels: {
            color: fontColor,
            font: {
              size: 15,
              weight: "normal",
              family: "Larsseit, system-ui, sans-serif",
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              var value = seriesData[tooltipItem.dataIndex];
              return `${value}`;
            },
          },
        },
      },
    }) as ChartOptions;

  const { dark } = useSettings();
  const size = useWindowSize();

  const [data, setData] = createSignal<ChartData>();
  const [options, setOptions] = createSignal();

  createComputed(() => {
    if (dark()) {
      setData(getData(darkColors));
      setOptions(getOptions(darkColor));
    } else {
      setData(getData(lightColors));
      setOptions(getOptions(lightColor));
    }
  });
  css`
    .chart {
      position: relative;
      width: 380px;
      height: 200px;
    }
    .center {
      position: absolute;
      top: 0;
      left: 0;
      height: 60px;
      margin-top: 70px;
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
      DoughnutController,
      PointElement,
      Title,
      Tooltip,
      ArcElement,
      Legend,
      Colors,
      // overlappingSegments,
    );
  });
  return (
    <div class="chart">
      <div class="center">{props.children}</div>
      <DefaultChart
        type="doughnut"
        data={data()}
        plugins={[
          CategoryScale,
          DoughnutController,
          PointElement,
          Title,
          Tooltip,
          ArcElement,
          Legend,
          Colors,
          // overlappingSegments,
        ]}
        options={options()}
      />
    </div>
  );
};

export default AccuracyDoughnut;
