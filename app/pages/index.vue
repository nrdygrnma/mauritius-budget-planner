<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <div
      class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-medium text-gray-900 dark:text-white">
            Mauritius budget planner
          </h1>
          <p class="text-sm text-gray-500">
            Savings timeline to property ownership · Jan 2027 start
          </p>
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-download"
            size="sm"
            variant="outline"
            @click="exportJSON"
          >
            Export JSON
          </UButton>
          <UButton
            color="error"
            icon="i-lucide-rotate-ccw"
            size="sm"
            variant="outline"
            @click="showResetConfirm = true"
          >
            Reset
          </UButton>
        </div>
      </div>
    </div>

    <!-- Sticky summary strip -->
    <div
      class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm px-4 py-3"
    >
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <p class="text-xs text-gray-500 mb-0.5">Monthly savings</p>
          <p
            :class="
              store.adjustedMonthlySavings > 0
                ? 'text-teal-600'
                : 'text-red-600'
            "
            class="text-base font-medium"
          >
            {{ formatEUR(store.adjustedMonthlySavings) }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <p class="text-xs text-gray-500 mb-0.5">Total needed</p>
          <p class="text-base font-medium text-gray-900 dark:text-white">
            {{ formatEUR(store.grandTotal) }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <p class="text-xs text-gray-500 mb-0.5">Months to target</p>
          <p class="text-base font-medium text-gray-900 dark:text-white">
            {{ store.monthsToTarget ?? "—" }}
          </p>
        </div>
        <div class="bg-teal-50 dark:bg-teal-950 rounded-lg px-3 py-2">
          <p class="text-xs text-teal-600 dark:text-teal-400 mb-0.5">
            Ready by
          </p>
          <p class="text-base font-medium text-teal-700 dark:text-teal-300">
            {{ store.readyDate ? formatMonth(store.readyDate) : "—" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div
      class="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <!-- LEFT COLUMN: inputs -->
      <div class="space-y-4">
        <!-- Income -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Income
            </p>
          </template>
          <SliderRow
            v-model="store.incomeYou"
            :max="10000"
            :min="1000"
            :step="100"
            label="Your income (net/mo)"
            unit="eur"
          />
          <SliderRow
            v-model="store.incomePartner"
            :max="10000"
            :min="1000"
            :step="100"
            label="Partner's income (net/mo)"
            unit="eur"
          />
          <USeparator class="my-2" />
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Total combined</span>
            <span class="font-medium text-teal-600">{{
              formatEUR(store.totalIncome)
            }}</span>
          </div>
        </UCard>

        <!-- Permit transfer -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Permit transfer (EDB requirement)
            </p>
          </template>
          <SliderRow
            v-model="store.transferUSD"
            :max="5000"
            :min="1500"
            :step="100"
            description="Mandatory $2,000/mo to Mauritius bank — this is spending money, not savings"
            label="Monthly transfer (USD)"
            unit="usd"
          />
          <SliderRow
            v-model="store.eurUsdRate"
            :max="1.4"
            :min="0.9"
            :step="0.01"
            label="EUR/USD rate"
            unit="rate"
          />
          <SliderRow
            v-model="store.murEurRate"
            :max="65"
            :min="45"
            :step="1"
            description="Rupees per euro"
            label="MUR/EUR rate"
            unit="count"
          />
          <USeparator class="my-2" />
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Transfer in euros</span>
            <span class="font-medium text-gray-600"
              >≈ {{ formatEUR(store.transferEUR) }}</span
            >
          </div>
        </UCard>

        <!-- MU living expenses -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Mauritius living expenses
            </p>
          </template>
          <p class="text-xs text-gray-400 mb-3">
            Covered by the mandatory transfer — not separate savings
          </p>

          <p
            class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1"
          >
            Housing
          </p>
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

          <USeparator class="my-2" />
          <p
            class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1"
          >
            Food
          </p>
          <SliderRow
            v-model="store.groceries"
            :max="800"
            :min="150"
            :step="10"
            description="Local markets + farms focus"
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

          <USeparator class="my-2" />
          <p
            class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1"
          >
            Transport + other
          </p>
          <SliderRow
            v-model="store.transport"
            :max="300"
            :min="30"
            :step="10"
            label="Bus + taxis (no car)"
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
            label="Leisure + misc buffer"
            unit="eur"
          />

          <USeparator class="my-2" />
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Total MU expenses</span>
            <span class="font-medium text-red-600"
              >−{{ formatEUR(store.totalMuExpenses) }}</span
            >
          </div>
          <div class="flex justify-between text-sm mt-1">
            <span class="text-gray-500">Transfer surplus in MU bank</span>
            <span
              :class="
                store.transferSurplus >= 0 ? 'text-teal-600' : 'text-red-600'
              "
              class="font-medium"
            >
              {{ store.transferSurplus >= 0 ? "+" : ""
              }}{{ formatEUR(store.transferSurplus) }}/mo
            </span>
          </div>

          <UAlert
            v-if="store.transferDeficit"
            class="mt-3"
            color="warning"
            description="Increase the transfer amount or reduce living costs."
            icon="i-lucide-triangle-alert"
            title="Transfer may not cover MU expenses"
            variant="soft"
          />
        </UCard>

        <!-- EU expenses -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              European expenses (deducted from savings)
            </p>
          </template>

          <SliderRow
            v-model="store.healthInsurance"
            :max="600"
            :min="50"
            :step="10"
            label="Health insurance (2 people)"
            unit="eur"
          />

          <USeparator class="my-2" />
          <p
            class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1"
          >
            Your flights to Austria
          </p>
          <SliderRow
            v-model="store.tripsYouPerYear"
            :max="6"
            :min="0"
            :step="1"
            label="Trips/year (both of you)"
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

          <USeparator class="my-2" />
          <p
            class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1"
          >
            Children visiting Mauritius
          </p>
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
            label="Trips/year per child"
            unit="count"
          />
          <SliderRow
            v-model="store.flightPriceKids"
            :max="1600"
            :min="400"
            :step="50"
            label="Kids' flight cost each"
            unit="eur"
          />

          <USeparator class="my-2" />
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Your flights/yr</span>
              <span class="text-red-600 font-medium"
                >−{{ formatEUR(store.flightsYouAnnual) }}/yr · −{{
                  formatEUR(store.flightsYouMonthly)
                }}/mo</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kids' flights/yr</span>
              <span class="text-red-600 font-medium"
                >−{{ formatEUR(store.flightsKidsAnnual) }}/yr · −{{
                  formatEUR(store.flightsKidsMonthly)
                }}/mo</span
              >
            </div>
            <div
              class="flex justify-between pt-1 border-t border-gray-100 dark:border-gray-800"
            >
              <span class="text-gray-600 font-medium"
                >Total EU deductions/mo</span
              >
              <span class="text-red-600 font-medium"
                >−{{ formatEUR(store.totalEuDeductions) }}</span
              >
            </div>
          </div>
        </UCard>

        <!-- Optional future expenses -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <p
                class="text-sm font-medium text-gray-500 uppercase tracking-wide"
              >
                Optional future expenses
              </p>
              <UBadge
                v-if="store.activeOptionalCount > 0"
                color="warning"
                size="sm"
                variant="soft"
              >
                {{ store.activeOptionalCount }} active · −{{
                  formatEUR(store.totalOptionalActive)
                }}/mo
              </UBadge>
            </div>
          </template>

          <div
            v-for="(expense, key) in store.optionalExpenses"
            :key="key"
            :class="[
              'rounded-lg p-3 mb-2 border transition-colors',
              expense.enabled
                ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950'
                : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900',
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{ expense.label }}</span
              >
              <USwitch v-model="expense.enabled" size="sm" />
            </div>
            <p class="text-xs text-gray-400 mb-2">{{ expense.description }}</p>
            <SliderRow
              v-if="expense.enabled"
              v-model="expense.value"
              :disabled="!expense.enabled"
              :label="formatEUR(expense.value) + '/mo'"
              :max="expense.max"
              :min="expense.min"
              :step="expense.step"
              unit="eur"
            />
          </div>
        </UCard>

        <!-- Property target -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Property savings target
            </p>
          </template>
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
            description="Registration duty + notary + agent fees"
            label="Purchase fees (~10%)"
            unit="eur"
          />
          <SliderRow
            v-model="store.dogRelocation"
            :max="2500"
            :min="500"
            :step="100"
            description="Cargo flight + vet prep + agent"
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

          <USeparator class="my-2" />
          <div class="flex justify-between text-sm font-medium">
            <span class="text-gray-600">Grand total needed</span>
            <span class="text-gray-900 dark:text-white">{{
              formatEUR(store.grandTotal)
            }}</span>
          </div>
        </UCard>
      </div>

      <!-- RIGHT COLUMN: results (sticky on desktop) -->
      <div class="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <!-- Savings error state -->
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
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Savings timeline
            </p>
          </template>
          <SavingsChart />
        </UCard>

        <!-- Progress -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <p
                class="text-sm font-medium text-gray-500 uppercase tracking-wide"
              >
                Progress
              </p>
              <span class="text-sm font-medium text-gray-600"
                >{{ store.progressPercent }}%</span
              >
            </div>
          </template>
          <UProgress
            :value="store.progressPercent"
            class="mb-4"
            color="primary"
          />
          <div class="space-y-2">
            <div
              v-for="m in store.milestones"
              :key="m.label"
              :class="
                m.label === 'Target reached'
                  ? 'font-medium text-teal-700 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-400'
              "
              class="flex items-center justify-between text-sm"
            >
              <span>{{ m.label }}</span>
              <span>{{ m.date ? formatMonth(m.date) : "—" }}</span>
            </div>
          </div>
        </UCard>

        <!-- Scenarios -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Three scenarios
            </p>
          </template>
          <div class="space-y-2">
            <div
              v-for="s in store.scenarios"
              :key="s.label"
              :class="[
                'flex items-center justify-between text-sm rounded-lg px-3 py-2',
                s.isBase
                  ? 'bg-teal-50 dark:bg-teal-950'
                  : 'bg-gray-50 dark:bg-gray-900',
              ]"
            >
              <div>
                <span
                  :class="
                    s.isBase
                      ? 'font-medium text-teal-700 dark:text-teal-300'
                      : 'text-gray-600 dark:text-gray-400'
                  "
                >
                  {{ s.label }}
                </span>
                <span class="text-xs text-gray-400 ml-2"
                  >{{ formatEUR(s.rate) }}/mo</span
                >
              </div>
              <div class="text-right">
                <span
                  :class="
                    s.isBase
                      ? 'font-medium text-teal-700 dark:text-teal-300'
                      : 'text-gray-600'
                  "
                >
                  {{ s.months ? s.months + " mo" : "—" }}
                </span>
                <span class="text-xs text-gray-400 ml-1.5">
                  {{ s.date ? formatMonth(s.date) : "" }}
                </span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Dog checklist -->
        <UCard>
          <template #header>
            <p
              class="text-sm font-medium text-gray-500 uppercase tracking-wide"
            >
              Dog relocation checklist
            </p>
          </template>
          <ul class="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> Sterilisation certificate
              (mandatory)
            </li>
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> ISO 15-digit microchip
            </li>
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> Rabies vaccine (60 days–12
              months before entry)
            </li>
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> Rabies titer test (30 days–6
              months before entry)
            </li>
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> Import permit from MoA (apply
              3–6 months ahead)
            </li>
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> 5-day quarantine on arrival
              (~Rs 200 total)
            </li>
            <li class="flex gap-2">
              <span class="text-teal-500">✓</span> MSAW registration within 15
              days (Rs 500)
            </li>
            <li class="flex gap-2 text-amber-600">
              <span>!</span> Start process min. 6 months before departure
            </li>
          </ul>
        </UCard>
      </div>
    </div>

    <!-- Reset confirmation modal -->
    <UModal v-model:open="showResetConfirm">
      <template #content>
        <UCard>
          <template #header>
            <p class="font-medium">Reset to defaults?</p>
          </template>
          <p class="text-sm text-gray-500 mb-4">
            This will clear all your current settings and restore the original
            values. Your saved state in localStorage will be erased.
          </p>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="showResetConfirm = false"
              >Cancel</UButton
            >
            <UButton color="error" @click="confirmReset">Reset</UButton>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Mauritius Budget Planner" });

const store = useBudgetStore();
const { formatEUR, formatRs, formatMonth } = useFormatters();

const showResetConfirm = ref(false);

function confirmReset() {
  store.resetToDefaults();
  showResetConfirm.value = false;
}

function exportJSON() {
  const data = JSON.stringify(store.$state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mauritius-budget-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
