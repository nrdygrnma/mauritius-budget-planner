<template>
  <UCard>
    <template #header>
      <SectionHeader
        description="Mandatory monthly transfer to destination account — spending money, not savings"
        icon="i-lucide-landmark"
        title="Visa transfer requirement"
      />
    </template>
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <SliderRow
        v-model="store.transferUSD"
        :max="6000"
        :min="0"
        :step="100"
        label="Monthly transfer (USD)"
        unit="usd"
      />
      <SliderRow
        v-model="store.eurUsdRate"
        :max="1.6"
        :min="0.8"
        :step="0.01"
        label="EUR / USD rate"
        unit="rate"
      />
      <SliderRow
        v-model="store.destCurrencyRate"
        :max="10000"
        :min="1"
        :step="1"
        description="e.g. 52 for MUR, 1.09 for USD, 0.86 for GBP"
        label="Dest. currency per EUR"
        unit="count"
      />
    </div>
    <template #footer>
      <StatRow
        :value="`≈ ${formatEUR(store.transferEUR)}`"
        label="Transfer in euros"
        tone="neutral"
      />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>
