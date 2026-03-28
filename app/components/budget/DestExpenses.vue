<template>
  <UCard>
    <template #header>
      <SectionHeader
        description="Covered by the visa transfer — not deducted from your savings"
        icon="i-lucide-map-pin"
        title="Destination living expenses"
      />
    </template>
    <div class="space-y-1">
      <p
        class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pt-1 pb-1"
      >
        Housing
      </p>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <SliderRow
          v-model="store.rent"
          :max="200000"
          :min="0"
          :step="1000"
          label="Rent (dest. currency)"
          tip="Converted to EUR using Settings rate"
          unit="dest"
        />
        <SliderRow
          v-model="store.electricity"
          :max="30000"
          :min="0"
          :step="500"
          label="Electricity (dest. currency)"
          tip="Can be high in hot climates (A/C)"
          unit="dest"
        />
        <SliderRow
          v-model="store.internet"
          :max="10000"
          :min="0"
          :step="100"
          label="Internet (dest. currency)"
          tip="Converted to EUR using Settings rate"
          unit="dest"
        />
        <SliderRow
          v-model="store.mobilePhones"
          :max="10000"
          :min="0"
          :step="100"
          label="Mobile phones (2×, dest. currency)"
          tip="Converted to EUR using Settings rate"
          unit="dest"
        />
      </div>

      <USeparator class="my-4!" />
      <p
        class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1"
      >
        Food
      </p>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <SliderRow
          v-model="store.groceries"
          :max="1000"
          :min="100"
          :step="10"
          label="Groceries"
          tip="Lower if shopping at local markets"
          unit="eur"
        />
        <SliderRow
          v-model="store.diningOut"
          :max="500"
          :min="0"
          :step="10"
          label="Dining out"
          unit="eur"
        />
      </div>

      <USeparator class="my-4!" />
      <p
        class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1"
      >
        Transport + other
      </p>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <SliderRow
          v-model="store.transport"
          :max="500"
          :min="0"
          :step="10"
          description="Public transport, taxis, no car assumed initially"
          label="Transport"
          tip="No car assumed — see Optional expenses"
          unit="eur"
        />
        <SliderRow
          v-model="store.petMonthly"
          :max="300"
          :min="0"
          :step="10"
          label="Pet (food + vet)"
          tip="Set to zero if not applicable"
          unit="eur"
        />
        <SliderRow
          v-model="store.personalCare"
          :max="400"
          :min="0"
          :step="10"
          label="Personal care + household"
          unit="eur"
        />
        <SliderRow
          v-model="store.leisureBuffer"
          :max="500"
          :min="0"
          :step="10"
          label="Leisure + misc buffer"
          tip="Catch-all for subscriptions and surprises"
          unit="eur"
        />
      </div>
    </div>
    <template #footer>
      <div class="space-y-1">
        <StatRow
          :value="`−${formatEUR(store.totalDestExpenses)}`"
          label="Total destination expenses"
          tip="Should be covered by visa transfer"
          tone="negative"
        />
        <StatRow
          :tone="store.transferSurplus >= 0 ? 'positive' : 'negative'"
          :value="`${store.transferSurplus >= 0 ? '+' : ''}${formatEUR(store.transferSurplus)}/mo`"
          label="Transfer surplus"
          large
          tip="Positive = transfer covers all costs"
          top-border
        />
      </div>
      <UAlert
        v-if="store.transferDeficit"
        class="mt-4"
        color="warning"
        description="Increase the transfer amount or reduce living costs."
        icon="i-lucide-triangle-alert"
        title="Transfer won't cover destination expenses"
        variant="soft"
      />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>
