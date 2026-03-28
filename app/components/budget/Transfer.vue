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
        tip="Minimum required by your visa or permit"
        unit="usd"
      />
    </div>
    <template #footer>
      <div class="space-y-1">
        <StatRow
          :value="settings.originToUsdRate.toFixed(4)"
          label="EUR / USD rate"
          tip="Set in Settings via live rates"
          tone="neutral"
        />
        <StatRow
          :label="`${settings.destCurrencyCode} per EUR`"
          :value="settings.destUnitsPerOrigin.toFixed(4)"
          tip="Set in Settings via live rates"
          tone="neutral"
        />
        <StatRow
          :value="`≈ ${formatEUR(store.transferEUR)}`"
          label="Transfer in euros"
          large
          tip="Spent at destination — not savings"
          tone="neutral"
          top-border
        />
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Exchange rates are managed in
        <NuxtLink
          class="underline hover:text-gray-600 dark:hover:text-gray-300"
          to="/settings"
          >Settings</NuxtLink
        >
        and updated automatically.
      </p>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const settings = useSettingsStore();
const { formatEUR } = useFormatters();
</script>
