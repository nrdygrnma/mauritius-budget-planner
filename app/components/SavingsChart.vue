<template>
  <div style="height: 260px; position: relative">
    <Line
      v-if="store.chartData.labels.length"
      :data="data"
      :options="chartOptions"
    />
    <div
      v-else
      class="flex items-center justify-center h-full text-sm text-gray-400"
    >
      Adjust your budget to see the savings timeline
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Line } from "vue-chartjs";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  AnnotationPlugin,
);

const store = useBudgetStore();
const { formatEUR } = useFormatters();

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => formatEUR(ctx.parsed.y),
      },
    },
    annotation: {
      annotations: {
        targetLine: {
          type: "line" as const,
          yMin: store.grandTotal,
          yMax: store.grandTotal,
          borderColor: "#A32D2D",
          borderWidth: 1.5,
          borderDash: [6, 4],
          label: {
            display: true,
            content: "Target " + formatEUR(store.grandTotal),
            position: "end",
            backgroundColor: "transparent",
            color: "#A32D2D",
            font: { size: 11 },
          },
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 12,
        font: { size: 11 },
      },
      grid: { display: false },
    },
    y: {
      ticks: {
        callback: (v: any) => "€" + (v / 1000).toFixed(0) + "k",
        font: { size: 11 },
      },
    },
  },
}));

const data = computed(() => ({
  labels: store.chartData.labels,
  datasets: [
    {
      data: store.chartData.data,
      borderColor: "#0F9E75",
      backgroundColor: "rgba(15,158,117,0.08)",
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 10,
    },
  ],
}));
</script>
