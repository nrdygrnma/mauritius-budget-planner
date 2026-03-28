<template>
  <UCard variant="subtle">
    <template #header>
      <SectionHeader
        icon="i-lucide-calculator"
        title="Monthly savings breakdown"
      />
    </template>
    <div class="space-y-0.5">
      <StatRow
        :value="formatEUR(store.totalIncome)"
        label="Combined income"
        tone="positive"
      />
      <StatRow
        :value="`−${formatEUR(store.transferEUR)}`"
        label="Visa transfer"
        tone="negative"
      />
      <StatRow
        :value="`−${formatEUR(store.healthInsurance)}`"
        label="Health insurance"
        tone="negative"
      />
      <StatRow
        :value="`−${formatEUR(store.totalFlightsMonthly)}`"
        label="Flights (amortised)"
        tone="negative"
      />
      <StatRow
        v-if="store.totalOptionalActive > 0"
        :value="`−${formatEUR(store.totalOptionalActive)}`"
        label="Optional expenses"
        tone="negative"
      />
      <StatRow
        :tone="store.adjustedMonthlySavings > 0 ? 'positive' : 'negative'"
        :value="formatEUR(store.adjustedMonthlySavings)"
        label="Net monthly savings"
        large
        top-border
      />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>