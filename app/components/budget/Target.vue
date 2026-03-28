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
        tip="Check local minimum for foreign buyers"
        unit="eur"
      />
      <SliderRow
        v-model="store.relocationCosts"
        :max="10000"
        :min="0"
        :step="100"
        description="Moving, setup, and arrival expenses"
        label="One-time relocation costs"
        tip="Shipping, temporary stay, and setup"
        unit="eur"
      />
      <SliderRow
        v-model="store.existingSavings"
        :max="200000"
        :min="0"
        :step="1000"
        label="Existing savings"
        tip="Already set aside toward this goal"
        unit="eur"
      />
    </div>
    <template #footer>
      <div class="space-y-1">
        <StatRow
          :label="`Acquisition fees (${settings.acquisitionFeePercent}%)`"
          :value="formatEUR(store.purchaseFees)"
          tip="Percentage set in Settings"
          tone="neutral"
        />
        <StatRow
          :value="formatEUR(store.grandTotal)"
          label="Grand total needed"
          large
          tip="Price + fees + relocation costs"
          tone="strong"
        />
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Acquisition fee percentage is configured in
        <NuxtLink
          class="underline hover:text-gray-600 dark:hover:text-gray-300"
          to="/settings"
        >
          Settings </NuxtLink
        >.
      </p>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const settings = useSettingsStore();
const { formatEUR } = useFormatters();
</script>
