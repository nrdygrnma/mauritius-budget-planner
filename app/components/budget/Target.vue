<template>
  <UCard>
    <template #header>
      <SectionHeader
        description="Property or asset purchase including all acquisition costs"
        icon="i-lucide-home"
        title="Purchase target"
      />
    </template>
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <SliderRow
        v-model="store.propertyPrice"
        :max="500000"
        :min="50000"
        :step="5000"
        label="Target purchase price"
        unit="eur"
      />
      <SliderRow
        v-model="store.purchaseFees"
        :max="50000"
        :min="0"
        :step="500"
        description="Taxes, legal fees, agent commission, etc."
        label="Acquisition fees"
        unit="eur"
      />
      <SliderRow
        v-model="store.relocationCosts"
        :max="10000"
        :min="0"
        :step="100"
        description="Moving, setup, and arrival expenses"
        label="One-time relocation costs"
        unit="eur"
      />
      <SliderRow
        v-model="store.existingSavings"
        :max="200000"
        :min="0"
        :step="1000"
        label="Existing savings"
        unit="eur"
      />
    </div>
    <template #footer>
      <StatRow
        :value="formatEUR(store.grandTotal)"
        label="Grand total needed"
        large
        tone="strong"
      />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>
