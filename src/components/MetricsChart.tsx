import { createComputed, createSignal, onMount } from "solid-js";
import {
  Chart,
  LineController,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  type ChartData,
} from "chart.js";

import { DefaultChart } from "solid-chartjs";
import type { TypingMetrics } from "./TypingMetrics";
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
    let data = [] as number[];
    let log = props.metrics.logs;
    while (log) {
      const elapsed = Math.round((log.value.meta.stop - log.value.meta.start) / 1000);

      labels.push(elapsed.toString());
      data.push(log.value.stats.speed.byWord[0]);
      log = log.next;
    }
    setData({
      labels: labels.reverse(),
      datasets: [
        {
          label: "WPM",
          data: data.reverse(),
        },
      ],
    });
  });
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    tension: 0.4,
  };

  return (
    <div class="chart">
      <DefaultChart type="line" data={data()} options={options} />
    </div>
  );
};

export default MyChart;
