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
          unit="dest"
        />
        <SliderRow
          v-model="store.electricity"
          :max="30000"
          :min="0"
          :step="500"
          label="Electricity (dest. currency)"
          unit="dest"
        />
        <SliderRow
          v-model="store.internet"
          :max="150"
          :min="10"
          :step="5"
          label="Internet"
          unit="eur"
        />
        <SliderRow
          v-model="store.mobilePhones"
          :max="100"
          :min="10"
          :step="5"
          label="Mobile phones (2×)"
          unit="eur"
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
          unit="eur"
        />
        <SliderRow
          v-model="store.petMonthly"
          :max="300"
          :min="0"
          :step="10"
          label="Pet (food + vet)"
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
          unit="eur"
        />
      </div>
    </div>
    <template #footer>
      <div class="space-y-1">
        <StatRow
          :value="`−${formatEUR(store.totalDestExpenses)}`"
          label="Total destination expenses"
          tone="negative"
        />
        <StatRow
          :tone="store.transferSurplus >= 0 ? 'positive' : 'negative'"
          :value="`${store.transferSurplus >= 0 ? '+' : ''}${formatEUR(store.transferSurplus)}/mo`"
          label="Transfer surplus"
          large
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
