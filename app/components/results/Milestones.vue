<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <SectionHeader icon="i-lucide-flag" title="Milestones" />
        <span
          class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums"
        >
          {{ store.progressPercent }}%
        </span>
      </div>
    </template>
    <UProgress
      :value="store.progressPercent"
      class="mb-5"
      color="primary"
      size="md"
    />
    <div class="space-y-0.5">
      <div
        v-for="m in store.milestones"
        :key="m.label"
        :class="
          m.label === 'Target reached'
            ? 'bg-primary-50 dark:bg-primary-950'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        "
        class="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
      >
        <span
          :class="
            m.label === 'Target reached'
              ? 'font-semibold text-primary-700 dark:text-primary-300'
              : 'text-gray-500 dark:text-gray-400'
          "
          class="text-sm"
        >
          {{ m.label }}
        </span>
        <span
          :class="
            m.label === 'Target reached'
              ? 'font-semibold text-primary-600 dark:text-primary-400'
              : 'text-gray-400 dark:text-gray-500'
          "
          class="text-sm tabular-nums"
        >
          {{ m.date ? formatMonth(m.date) : "—" }}
        </span>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatMonth } = useFormatters();
</script>
