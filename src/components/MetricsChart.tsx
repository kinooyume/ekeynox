import { createComputed, createSignal, onMount } from "solid-js";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  Colors,
  type ChartData,
} from "chart.js";
import { Line, type ChartProps } from "solid-chartjs";
import { DefaultChart } from "solid-chartjs";
import type { TypingMetrics } from "./TypingMetrics";

type MyChartProps = {
  metrics: TypingMetrics;
};
const MyChart = (props: MyChartProps) => {
  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const [data, setData] = createSignal<ChartData | undefined>();

  createComputed(() => {
    let labels = [] as string[];
    let data = [] as number[];
    let log = props.metrics.logs;
    while (log) {
      console.log(log.value.projection.incorrect);
      const elapsed = Math.round((log.value.stop - log.value.start) / 1000);

      labels.push(elapsed.toString());
      data.push(log.value.wpms[0]);
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

  return <DefaultChart type="line" data={data()} options={options} />;
};

export default MyChart;
