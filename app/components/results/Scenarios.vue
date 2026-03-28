<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <SectionHeader icon="i-lucide-bar-chart-2" title="Three scenarios" />
        <InfoTip text="Thresholds set in Settings" />
      </div>
    </template>
    <div class="space-y-2">
      <div
        v-for="s in store.scenarios"
        :key="s.label"
        :class="
          s.isBase
            ? 'bg-primary-50 dark:bg-primary-950 border border-primary-100 dark:border-primary-900'
            : 'bg-gray-50 dark:bg-gray-800/50'
        "
        class="flex items-center justify-between rounded-xl px-4 py-3 transition-colors"
      >
        <div class="flex flex-col gap-0.5">
          <span
            :class="
              s.isBase
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="text-sm font-medium"
          >
            {{ s.label }}
          </span>
          <span class="text-xs text-gray-400 tabular-nums"
            >{{ formatEUR(s.rate) }}/mo</span
          >
        </div>
        <div class="text-right flex flex-col gap-0.5">
          <span
            :class="
              s.isBase
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="text-sm font-semibold tabular-nums"
          >
            {{ s.months ? s.months + " months" : "—" }}
          </span>
          <span class="text-xs text-gray-400 tabular-nums">
            {{ s.date ? formatMonth(s.date) : "" }}
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR, formatMonth } = useFormatters();
</script>
