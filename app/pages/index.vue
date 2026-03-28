<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- ── Sticky summary strip ───────────────────────────── -->
    <div
      class="sticky top-(--ui-header-height) z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800"
    >
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-end justify-between gap-4">
          <!-- Four metrics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 flex-1">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-400 dark:text-gray-500"
                >Monthly savings</span
              >
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
              <span class="text-xs text-gray-400 dark:text-gray-500"
                >Total needed</span
              >
              <span
                class="text-xl font-bold tabular-nums leading-tight text-gray-900 dark:text-white"
              >
                {{ formatEUR(store.grandTotal) }}
              </span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-400 dark:text-gray-500"
                >Months to target</span
              >
              <span
                class="text-xl font-bold tabular-nums leading-tight text-gray-900 dark:text-white"
              >
                {{ store.monthsToTarget ?? "—" }}
              </span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-teal-500 dark:text-teal-400"
                >Ready by</span
              >
              <span
                class="text-xl font-bold tabular-nums leading-tight text-teal-600 dark:text-teal-400"
              >
                {{ store.readyDate ? formatMonth(store.readyDate) : "—" }}
              </span>
            </div>
          </div>

          <!-- Action buttons — right-aligned, vertically centred with the metrics -->
          <div class="flex items-center gap-1.5 shrink-0 pb-0.5">
            <UButton
              color="neutral"
              icon="i-lucide-download"
              label="Export"
              size="xs"
              variant="ghost"
              @click="exportJSON"
            />
            <UButton
              color="error"
              icon="i-lucide-rotate-ccw"
              label="Reset"
              size="xs"
              variant="ghost"
              @click="showResetConfirm = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Main layout ────────────────────────────────────── -->
    <div
      class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-2 gap-8"
    >
      <!-- LEFT: inputs -->
      <div class="space-y-6">
        <!-- Income -->
        <UCard>
          <template #header>
            <SectionHeader
              description="Combined net monthly take-home"
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
              unit="eur"
            />
            <SliderRow
              v-model="store.incomePartner"
              :max="10000"
              :min="1000"
              :step="100"
              label="Partner's income"
              unit="eur"
            />
          </div>
          <template #footer>
            <StatRow
              :value="formatEUR(store.totalIncome)"
              label="Total combined"
              large
              tone="positive"
            />
          </template>
        </UCard>

        <!-- Permit transfer -->
        <UCard>
          <template #header>
            <SectionHeader
              description="Mandatory EDB requirement — this is spending money, not savings"
              icon="i-lucide-building-2"
              title="Permit transfer"
            />
          </template>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <SliderRow
              v-model="store.transferUSD"
              :max="5000"
              :min="1500"
              :step="100"
              label="Monthly transfer"
              unit="usd"
            />
            <SliderRow
              v-model="store.eurUsdRate"
              :max="1.4"
              :min="0.9"
              :step="0.01"
              label="EUR / USD rate"
              unit="rate"
            />
            <SliderRow
              v-model="store.murEurRate"
              :max="65"
              :min="45"
              :step="1"
              label="MUR per euro"
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

        <!-- MU living expenses -->
        <UCard>
          <template #header>
            <SectionHeader
              description="Covered by the transfer — not deducted from savings"
              icon="i-lucide-map-pin"
              title="Mauritius living expenses"
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
                :max="100000"
                :min="20000"
                :step="1000"
                label="Rent"
                unit="rs"
              />
              <SliderRow
                v-model="store.electricity"
                :max="15000"
                :min="1000"
                :step="500"
                label="Electricity"
                unit="rs"
              />
              <SliderRow
                v-model="store.internet"
                :max="100"
                :min="10"
                :step="5"
                label="Internet"
                unit="eur"
              />
              <SliderRow
                v-model="store.mobilePhones"
                :max="80"
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
                :max="800"
                :min="150"
                :step="10"
                description="Local markets and farms focus"
                label="Groceries"
                unit="eur"
              />
              <SliderRow
                v-model="store.diningOut"
                :max="400"
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
                :max="300"
                :min="30"
                :step="10"
                description="No car for year one"
                label="Bus + taxis"
                unit="eur"
              />
              <SliderRow
                v-model="store.dogMonthly"
                :max="250"
                :min="40"
                :step="10"
                label="Dog (food + vet)"
                unit="eur"
              />
              <SliderRow
                v-model="store.personalCare"
                :max="300"
                :min="0"
                :step="10"
                label="Personal care + household"
                unit="eur"
              />
              <SliderRow
                v-model="store.leisureBuffer"
                :max="400"
                :min="0"
                :step="10"
                label="Leisure + buffer"
                unit="eur"
              />
            </div>
          </div>
          <template #footer>
            <div class="space-y-1">
              <StatRow
                :value="`−${formatEUR(store.totalMuExpenses)}`"
                label="Total MU expenses"
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
              title="Transfer won't cover living expenses"
              variant="soft"
            />
          </template>
        </UCard>

        <!-- EU expenses -->
        <UCard>
          <template #header>
            <SectionHeader
              description="Deducted from EU income — these reduce your savings directly"
              icon="i-lucide-plane"
              title="European expenses"
            />
          </template>
          <div class="space-y-1">
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <SliderRow
                v-model="store.healthInsurance"
                :max="600"
                :min="50"
                :step="10"
                label="Health insurance (2 people)"
                unit="eur"
              />
            </div>

            <USeparator class="my-4!" />
            <p
              class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1"
            >
              Your flights to Austria
            </p>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <SliderRow
                v-model="store.tripsYouPerYear"
                :max="6"
                :min="0"
                :step="1"
                label="Trips per year (both)"
                unit="count"
              />
              <SliderRow
                v-model="store.flightPriceYou"
                :max="1600"
                :min="400"
                :step="50"
                label="Cost per person return"
                unit="eur"
              />
            </div>

            <USeparator class="my-4!" />
            <p
              class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1"
            >
              Children visiting Mauritius
            </p>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <SliderRow
                v-model="store.numChildren"
                :max="5"
                :min="0"
                :step="1"
                label="Number of children"
                unit="count"
              />
              <SliderRow
                v-model="store.tripsKidsPerYear"
                :max="4"
                :min="0"
                :step="1"
                label="Trips per year each"
                unit="count"
              />
              <SliderRow
                v-model="store.flightPriceKids"
                :max="1600"
                :min="400"
                :step="50"
                label="Flight cost per child return"
                unit="eur"
              />
            </div>
          </div>
          <template #footer>
            <div class="space-y-1">
              <StatRow
                :label="`Your flights — ${formatEUR(store.flightsYouAnnual)}/yr`"
                :value="`−${formatEUR(store.flightsYouMonthly)}/mo`"
                tone="negative"
              />
              <StatRow
                :label="`Kids' flights — ${formatEUR(store.flightsKidsAnnual)}/yr`"
                :value="`−${formatEUR(store.flightsKidsMonthly)}/mo`"
                tone="negative"
              />
              <StatRow
                :value="`−${formatEUR(store.totalEuDeductions)}`"
                label="Total EU deductions/mo"
                large
                tone="negative"
                top-border
              />
            </div>
          </template>
        </UCard>

        <!-- Optional future expenses -->
        <UCard>
          <template #header>
            <div class="flex items-start justify-between gap-4">
              <SectionHeader
                description="Toggle on to stress-test your timeline"
                icon="i-lucide-toggle-right"
                title="Optional future expenses"
              />
              <UBadge
                v-if="store.activeOptionalCount > 0"
                class="shrink-0 mt-0.5"
                color="warning"
                size="sm"
                variant="subtle"
              >
                {{ store.activeOptionalCount }} active · −{{
                  formatEUR(store.totalOptionalActive)
                }}/mo
              </UBadge>
            </div>
          </template>
          <div class="space-y-3">
            <div
              v-for="(expense, key) in store.optionalExpenses"
              :key="key"
              :class="
                expense.enabled
                  ? 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/50'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30'
              "
              class="rounded-xl border transition-all duration-200 overflow-hidden"
            >
              <div class="flex items-center justify-between px-4 py-3 gap-4">
                <div class="min-w-0">
                  <p
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
                  >
                    {{ expense.label }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {{ expense.description }}
                  </p>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span
                    v-if="expense.enabled"
                    class="text-sm font-semibold text-primary-600 dark:text-primary-400 tabular-nums"
                  >
                    −{{ formatEUR(expense.value) }}/mo
                  </span>
                  <USwitch v-model="expense.enabled" size="sm" />
                </div>
              </div>
              <div
                v-if="expense.enabled"
                class="px-4 pb-4 pt-0 border-t border-primary-100 dark:border-primary-900"
              >
                <SliderRow
                  v-model="expense.value"
                  :label="expense.label"
                  :max="expense.max"
                  :min="expense.min"
                  :step="expense.step"
                  unit="eur"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Property target -->
        <UCard>
          <template #header>
            <SectionHeader
              description="G+2 apartment purchase including all costs"
              icon="i-lucide-home"
              title="Property savings target"
            />
          </template>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <SliderRow
              v-model="store.propertyPrice"
              :max="250000"
              :min="80000"
              :step="5000"
              label="Target property price"
              unit="eur"
            />
            <SliderRow
              v-model="store.purchaseFees"
              :max="25000"
              :min="5000"
              :step="500"
              description="Registration duty + notary + agent"
              label="Purchase fees (~10%)"
              unit="eur"
            />
            <SliderRow
              v-model="store.dogRelocation"
              :max="2500"
              :min="500"
              :step="100"
              description="Cargo flight + vet prep + permit agent"
              label="Dog relocation (one-time)"
              unit="eur"
            />
            <SliderRow
              v-model="store.existingSavings"
              :max="150000"
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
      </div>

      <!-- RIGHT: results -->
      <div
        class="space-y-6 xl:sticky xl:top-[calc(var(--ui-header-height)+5rem)] xl:self-start"
      >
        <!-- Error state -->
        <UAlert
          v-if="store.adjustedMonthlySavings <= 0"
          color="error"
          description="Your current settings result in no savings. Adjust income or reduce expenses."
          icon="i-lucide-circle-alert"
          title="Expenses exceed income"
          variant="soft"
        />

        <!-- Savings chart -->
        <UCard>
          <template #header>
            <SectionHeader
              icon="i-lucide-trending-up"
              title="Savings timeline"
            />
          </template>
          <SavingsChart />
        </UCard>

        <!-- Progress + milestones -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <SectionHeader icon="i-lucide-flag" title="Milestones" />
              <span
                class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums"
              >
                {{ store.progressPercent }}%
              </span>
            </div>
          </template>
          <UProgress
            :value="store.progressPercent"
            class="mb-5"
            color="primary"
            size="md"
          />
          <div class="space-y-0.5">
            <div
              v-for="m in store.milestones"
              :key="m.label"
              :class="
                m.label === 'Target reached'
                  ? 'bg-primary-50 dark:bg-primary-950'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              "
              class="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
            >
              <span
                :class="
                  m.label === 'Target reached'
                    ? 'font-semibold text-primary-700 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                "
                class="text-sm"
              >
                {{ m.label }}
              </span>
              <span
                :class="
                  m.label === 'Target reached'
                    ? 'font-semibold text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500'
                "
                class="text-sm tabular-nums"
              >
                {{ m.date ? formatMonth(m.date) : "—" }}
              </span>
            </div>
          </div>
        </UCard>

        <!-- Scenarios -->
        <UCard>
          <template #header>
            <SectionHeader
              icon="i-lucide-bar-chart-2"
              title="Three scenarios"
            />
          </template>
          <div class="space-y-2">
            <div
              v-for="s in store.scenarios"
              :key="s.label"
              :class="
                s.isBase
                  ? 'bg-primary-50 dark:bg-primary-950 border border-primary-100 dark:border-primary-900'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              "
              class="flex items-center justify-between rounded-xl px-4 py-3 transition-colors"
            >
              <div class="flex flex-col gap-0.5">
                <span
                  :class="
                    s.isBase
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400'
                  "
                  class="text-sm font-medium"
                >
                  {{ s.label }}
                </span>
                <span class="text-xs text-gray-400 tabular-nums"
                  >{{ formatEUR(s.rate) }}/mo</span
                >
              </div>
              <div class="text-right flex flex-col gap-0.5">
                <span
                  :class="
                    s.isBase
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400'
                  "
                  class="text-sm font-semibold tabular-nums"
                >
                  {{ s.months ? s.months + " months" : "—" }}
                </span>
                <span class="text-xs text-gray-400 tabular-nums">{{
                  s.date ? formatMonth(s.date) : ""
                }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Monthly savings summary -->
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
              label="Transfer to Mauritius"
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

        <!-- Dog checklist -->
        <UCard variant="subtle">
          <template #header>
            <SectionHeader
              icon="i-lucide-paw-print"
              title="Dog relocation checklist"
            />
          </template>
          <ul class="space-y-2.5">
            <li
              v-for="item in checklistItems"
              :key="item.text"
              class="flex gap-3 items-start"
            >
              <UIcon
                :class="item.warn ? 'text-amber-500' : 'text-primary-500'"
                :name="
                  item.warn
                    ? 'i-lucide-alert-circle'
                    : 'i-lucide-check-circle-2'
                "
                class="w-4 h-4 mt-0.5 shrink-0"
              />
              <span
                :class="
                  item.warn
                    ? 'text-amber-700 dark:text-amber-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                "
                class="text-sm leading-snug"
              >
                {{ item.text }}
              </span>
            </li>
          </ul>
        </UCard>
      </div>
    </div>

    <!-- Reset modal -->
    <UModal
      v-model:open="showResetConfirm"
      description="This will clear all your current settings and restore the original values. Your saved state in localStorage will be erased."
      title="Reset to defaults?"
    >
      <template #content>
        <UCard>
          <template #header>
            <p class="font-semibold text-gray-900 dark:text-white">
              Reset to defaults?
            </p>
          </template>
          <p class="text-sm text-gray-500 leading-relaxed">
            This will clear all your current settings and restore the original
            values. Your saved state in localStorage will be erased.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                label="Cancel"
                variant="ghost"
                @click="closeReset"
              />

              <UButton
                color="error"
                label="Reset everything"
                @click="confirmReset"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Meridian — Budget Planner" });

const store = useBudgetStore();
const { formatEUR, formatMonth } = useFormatters();

const showResetConfirm = ref(false);

function closeReset() {
  showResetConfirm.value = false;
  nextTick(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
}

function confirmReset() {
  store.resetToDefaults();
  showResetConfirm.value = false;
  nextTick(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
}

function exportJSON() {
  const data = JSON.stringify(store.$state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meridian-budget-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const checklistItems = [
  { text: "Sterilisation certificate (mandatory for entry)", warn: false },
  { text: "ISO 15-digit microchip", warn: false },
  { text: "Rabies vaccine — 60 days to 12 months before entry", warn: false },
  { text: "Rabies titer test — 30 days to 6 months before entry", warn: false },
  {
    text: "Import permit from Ministry of Agriculture (3–6 months ahead)",
    warn: false,
  },
  { text: "5-day quarantine on arrival (~Rs 200 total)", warn: false },
  { text: "MSAW registration within 15 days of arrival (Rs 500)", warn: false },
  {
    text: "Start the entire process at least 6 months before departure",
    warn: true,
  },
];
</script>
