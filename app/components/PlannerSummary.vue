<template>
  <div
    class="sticky top-(--ui-header-height) z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800"
  >
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-end justify-between gap-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 flex-1">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1">
              <span class="text-xs text-gray-400 dark:text-gray-500"
                >Monthly savings</span
              >
              <InfoTip side="top" text="Income minus all deductions" />
            </div>
            <span
              :class="
                store.adjustedMonthlySavings > 0
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-red-500 dark:text-red-400'
              "
              class="text-xl font-bold tabular-nums leading-tight"
            >
              {{ formatEUR(store.adjustedMonthlySavings) }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1">
              <span class="text-xs text-gray-400 dark:text-gray-500"
                >Total needed</span
              >
              <InfoTip side="top" text="Price + fees + relocation costs" />
            </div>
            <span
              class="text-xl font-bold tabular-nums leading-tight text-gray-900 dark:text-white"
            >
              {{ formatEUR(store.grandTotal) }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1">
              <span class="text-xs text-gray-400 dark:text-gray-500"
                >Months to target</span
              >
              <InfoTip side="top" text="Remaining amount / monthly savings" />
            </div>
            <span
              class="text-xl font-bold tabular-nums leading-tight text-gray-900 dark:text-white"
            >
              {{ store.monthsToTarget ?? "—" }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1">
              <span class="text-xs text-teal-500 dark:text-teal-400"
                >Ready by</span
              >
              <InfoTip side="top" text="Relocation date + months to target" />
            </div>
            <span
              class="text-xl font-bold tabular-nums leading-tight text-teal-600 dark:text-teal-400"
            >
              {{ store.readyDate ? formatMonth(store.readyDate) : "—" }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0 pb-0.5">
          <UButton
            :disabled="exporting"
            :label="exporting ? 'Exporting…' : 'Export PDF'"
            :loading="exporting"
            color="neutral"
            icon="i-lucide-file-down"
            size="xs"
            variant="ghost"
            @click="$emit('export')"
          />
          <UButton
            color="error"
            icon="i-lucide-rotate-ccw"
            label="Reset"
            size="xs"
            variant="ghost"
            @click="$emit('reset')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ exporting?: boolean }>();
defineEmits<{ export: []; reset: [] }>();

const store = useBudgetStore();
const { formatEUR, formatMonth } = useFormatters();
</script>
