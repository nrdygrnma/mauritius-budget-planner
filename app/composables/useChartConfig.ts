import type { ChartOptions } from "chart.js";

export const useChartConfig = () => {
  const { formatEUR } = useFormatters();
  const store = useBudgetStore();

  const options = computed<ChartOptions<"line">>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => formatEUR(ctx.parsed.y ?? 0),
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
              content: `Target ${formatEUR(store.grandTotal)}`,
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
        ticks: { maxTicksLimit: 12, font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (v) => "€" + (Number(v) / 1000).toFixed(0) + "k",
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

  return { options, data };
};
