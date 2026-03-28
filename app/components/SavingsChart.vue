<template>
  <div style="height: 260px; position: relative">
    <Line
      v-if="store.chartData.labels.length"
      :data="data"
      :options="options"
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
  Filler,
  AnnotationPlugin,
);

const store = useBudgetStore();
const { options, data } = useChartConfig();
</script>
