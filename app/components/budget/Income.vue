<template>
  <UCard>
    <template #header>
      <SectionHeader
        description="Combined net monthly take-home in your home currency"
        icon="i-lucide-wallet"
        title="Income"
      />
    </template>
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <SliderRow
        v-model="store.incomeYou"
        :max="10000"
        :min="1000"
        :step="100"
        label="Your income"
        tip="Net take-home after tax"
        unit="eur"
      />

      <SliderRow
        v-model="store.incomePartner"
        :max="10000"
        :min="1000"
        :step="100"
        label="Partner's income"
        tip="Set to minimum if not applicable"
        unit="eur"
      />
    </div>
    <template #footer>
      <StatRow
        :value="formatEUR(store.totalIncome)"
        label="Total combined"
        large
        tip="Available before any deductions"
        tone="positive"
      />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>
