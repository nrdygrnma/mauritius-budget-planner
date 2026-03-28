<template>
  <div
    :class="disabled ? 'opacity-35 pointer-events-none' : ''"
    class="py-3 px-1 transition-opacity"
  >
    <div class="flex items-center justify-between mb-2 gap-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{
          label
        }}</span>
        <InfoTip v-if="tip" :text="tip" />
      </div>
      <span
        class="text-sm font-semibold tabular-nums text-gray-900 dark:text-white shrink-0"
      >
        {{ displayValue }}
      </span>
    </div>
    <USlider v-model="model" :max="max" :min="min" :step="step" size="sm" />
    <p
      v-if="description"
      class="text-xs text-gray-400 dark:text-gray-500 mt-1.5"
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
  unit?: "eur" | "usd" | "dest" | "rate" | "count";
  description?: string;
  disabled?: boolean;
  tip?: string;
}>();

const model = defineModel<number>();
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