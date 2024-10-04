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
import type { StatProjection } from "../../metrics/KeypressMetrics";
import { onMount, type JSXElement } from "solid-js";

type MyChartProps = {
  stats: StatProjection;
  children: JSXElement;
};

const AccuracyDoughnut = (props: MyChartProps) => {
  const correct = props.stats.accuracies[1];
  const corrected = props.stats.accuracies[0] - props.stats.accuracies[1];
  const incorrect = 100 - props.stats.accuracies[0];
  const data = {
    datasets: [
      {
        data: [correct, corrected, incorrect],
        backgroundColor: ["#107b65", "#b16f4c", "#a83f3f"],
      },
    ],
  } as ChartData;

  type OverlapSegment = {
    radius: number;
    color: string;
    coordinates: { x: number; y: number }[];
  };

  const makeOverlapSegment = (value: any, color: string): OverlapSegment => {
    const { innerRadius, outerRadius, endAngle } = value;
    const radius = (outerRadius - innerRadius) / 2;
    const coordinates = [];

    for (let i = -0.01; i < 0.01; i += 0.01) {
      const xCoor = (innerRadius + radius) * Math.cos(endAngle + Math.PI + i);
      const yCoor = (innerRadius + radius) * Math.sin(endAngle + i);
      coordinates.push({ x: xCoor, y: yCoor });
    }
    return { radius, color, coordinates };
  };

  const overlappingSegments = {
    id: "overlappingSegments",
    afterDatasetsDraw(chart: Chart) {
      const { ctx } = chart;
      const x = chart.getDatasetMeta(0).data[0].x;
      const y = chart.getDatasetMeta(0).data[0].y;
      const angle = Math.PI / 180;

      const overlaps = chart
        .getDatasetMeta(0)
        .data.filter((_, index) => chart.getDataVisibility(index))
        .map((value, index) => {
          return makeOverlapSegment(
            value,
            data!.datasets[0]!.backgroundColor![index]!,
          );
        });
      overlaps.reverse().forEach(({ radius, color, coordinates }) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;
        ctx.beginPath();
        coordinates.forEach(({ x, y }) => {
          ctx.arc(-x, y, radius - 1, 0, angle * 360, false);
        });
        ctx.fill();

        ctx.restore();
      });
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    // plugins: [overlappingSegments],
  } as ChartOptions;

  css`
    .chart {
      position: relative;
      width: 260px;
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
      <DefaultChart
        type="doughnut"
        data={data}
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
        options={options}
      />
      <div class="center">{props.children}</div>
    </div>
  );
};

export default AccuracyDoughnut;
