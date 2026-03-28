<template>
  <div
    :class="{ 'opacity-35 pointer-events-none select-none': disabled }"
    class="group py-3 transition-opacity duration-200"
  >
    <div class="flex items-baseline justify-between mb-3 gap-4">
      <span class="text-sm text-gray-500 dark:text-gray-400 leading-snug">
        {{ label }}
      </span>
      <span
        class="text-sm font-semibold text-gray-900 dark:text-white tabular-nums shrink-0"
      >
        {{ displayValue }}
      </span>
    </div>
    <USlider
      v-model="model"
      :disabled="disabled"
      :max="max"
      :min="min"
      :step="step"
      color="primary"
      size="md"
      tooltip
    />
    <p
      v-if="description"
      class="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed"
    >
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: "eur" | "usd" | "rs" | "rate" | "dest" | "count";
  description?: string;
  disabled?: boolean;
}>();

const model = defineModel<number>({ required: true });
const { formatEUR, formatUSD, formatDestCurrency, formatCount, formatRate } =
  useFormatters();

const displayValue = computed(() => {
  const v = model.value ?? props.min;
  switch (props.unit) {
    case "eur":
      return formatEUR(v);
    case "usd":
      return formatUSD(v);
    case "dest":
      return formatDestCurrency(v);
    case "rate":
      return formatRate(v);
    case "count":
      return formatCount(v);
    default:
      return String(v);
  }
});
</script>
