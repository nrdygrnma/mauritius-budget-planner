<template>
  <UCard>
    <template #header>
      <SectionHeader
        description="Deducted from your income — these reduce your savings directly"
        icon="i-lucide-plane"
        title="Home country expenses"
      />
    </template>
    <div class="space-y-1">
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <SliderRow
          v-model="store.healthInsurance"
          :max="800"
          :min="0"
          :step="10"
          label="Health insurance (2 people)"
          tip="Paid from home country account, not transfer"
          unit="eur"
        />
      </div>

      <USeparator class="my-4!" />
      <p
        class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1"
      >
        Your return flights home
      </p>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <SliderRow
          v-model="store.tripsYouPerYear"
          :max="8"
          :min="0"
          :step="1"
          label="Trips per year (you + partner)"
          tip="Return journeys for both partners"
          unit="count"
        />
        <SliderRow
          v-model="store.flightPriceYou"
          :max="2000"
          :min="200"
          :step="50"
          label="Cost per person return"
          tip="Per person — multiplied by 2 internally"
          unit="eur"
        />
      </div>

      <USeparator class="my-4!" />
      <p
        class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1"
      >
        Visitors flying to you
      </p>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <SliderRow
          v-model="store.numDependants"
          :max="6"
          :min="0"
          :step="1"
          label="Number of visitors to finance"
          tip="People whose flights you pay for"
          unit="count"
        />
        <SliderRow
          v-model="store.tripsVisitorsPerYear"
          :max="4"
          :min="0"
          :step="1"
          label="Trips per year each"
          unit="count"
        />
        <SliderRow
          v-model="store.flightPriceVisitors"
          :max="2000"
          :min="200"
          :step="50"
          label="Flight cost per person return"
          tip="Often same route as your own flights"
          unit="eur"
        />
      </div>
    </div>
    <template #footer>
      <div class="space-y-1">
        <StatRow
          :label="`Your flights — ${formatEUR(store.flightsYouAnnual)}/yr`"
          :value="`−${formatEUR(store.flightsYouMonthly)}/mo`"
          tip="Annual total ÷ 12"
          tone="negative"
        />
        <StatRow
          :label="`Visitor flights — ${formatEUR(store.flightsVisitorsAnnual)}/yr`"
          :value="`−${formatEUR(store.flightsVisitorsMonthly)}/mo`"
          tip="Annual total ÷ 12"
          tone="negative"
        />
        <StatRow
          :value="`−${formatEUR(store.totalHomeDeductions)}`"
          label="Total home deductions/mo"
          large
          tip="Transfer + insurance + flights"
          tone="negative"
          top-border
        />
      </div>
    </template>
  </UCard>
</template>
<script lang="ts" setup>
const store = useBudgetStore();
const { formatEUR } = useFormatters();
</script>
