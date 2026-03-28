<template>
  <UCard>
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <SectionHeader
          description="Toggle on to stress-test your timeline"
          icon="i-lucide-toggle-right"
          title="Optional future expenses"
        />
        <UBadge
          v-if="store.activeOptionalCount > 0"
          class="shrink-0 mt-0.5"
          color="warning"
          size="sm"
          variant="subtle"
        >
          {{ store.activeOptionalCount }} active · −{{
            formatEUR(store.totalOptionalActive)
          }}/mo
        </UBadge>
      </div>
    </template>
    <div class="space-y-3">
      <div
        v-for="(expense, key) in store.optionalExpenses"
        :key="key"
        :class="
          expense.enabled
            ? 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/50'
            : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30'
        "
        class="rounded-xl border transition-all duration-200 overflow-hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 gap-4">
          <div class="min-w-0">
            <p
              class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
            >
              {{ expense.label }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {{ expense.description }}
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span
              v-if="expense.enabled"
              class="text-sm font-semibold text-primary-600 dark:text-primary-400 tabular-nums"
            >
              −{{ formatEUR(expense.value) }}/mo
            </span>
            <USwitch v-model="expense.enabled" size="sm" />
          </div>
        </div>
        <div
          v-if="expense.enabled"
          class="px-4 pb-4 pt-0 border-t border-primary-100 dark:border-primary-900"
        >
          <SliderRow
            v-model="expense.value"
            :label="expense.label"
            :max="expense.max"
            :min="expense.min"
            :step="expense.step"
            unit="eur"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>
