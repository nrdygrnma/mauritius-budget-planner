<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-8">
    <!-- Header -->
    <div>
      <UBadge class="mb-4" color="neutral" size="sm" variant="subtle"
        >Configuration</UBadge
      >
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Settings
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Configure your relocation context. These settings drive the currency
        labels, exchange rates, and scenario thresholds used throughout the
        planner. Changes are saved automatically.
      </p>
    </div>

    <!-- Planner identity -->
    <UCard>
      <template #header>
        <SectionHeader
          description="Optional label for your relocation plan"
          icon="i-lucide-tag"
          title="Planner identity"
        />
      </template>
      <UFormField
        class="w-full"
        description="Give your plan a name to distinguish it — e.g. 'Move to Mauritius 2027'"
        label="Plan name"
      >
        <UInput
          v-model="settings.plannerName"
          class="w-full"
          icon="i-lucide-pencil"
          placeholder="e.g. Move to Mauritius 2027"
          @change="handleSave"
        />
      </UFormField>
    </UCard>

    <!-- Countries -->
    <UCard>
      <template #header>
        <SectionHeader
          description="Your origin and destination"
          icon="i-lucide-globe"
          title="Countries"
        />
      </template>
      <div class="space-y-5">
        <UFormField
          description="Where you currently live and earn"
          label="Origin country"
        >
          <USelectMenu
            :items="COUNTRIES_GROUPED"
            :model-value="settings.originCountryCode"
            :search-input="{
              placeholder: 'Search countries…',
              icon: 'i-lucide-search',
            }"
            class="w-full"
            value-key="value"
            @update:model-value="onOriginCountryChange"
          />
        </UFormField>

        <UFormField
          description="Where you are relocating to"
          label="Destination country"
        >
          <USelectMenu
            :items="COUNTRIES_GROUPED"
            :model-value="settings.destCountryCode"
            :search-input="{
              placeholder: 'Search countries…',
              icon: 'i-lucide-search',
            }"
            class="w-full"
            value-key="value"
            @update:model-value="onDestCountryChange"
          />
        </UFormField>

        <!-- Live preview -->
        <div
          v-if="settings.originCountry && settings.destCountry"
          class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        >
          <span class="text-2xl">{{ settings.originCountry.flag }}</span>
          <div class="flex-1 text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium text-gray-900 dark:text-white">{{
              settings.originCountry.name
            }}</span>
            <span class="mx-2 text-gray-300 dark:text-gray-600">→</span>
            <span class="font-medium text-gray-900 dark:text-white">{{
              settings.destCountry.name
            }}</span>
          </div>
          <span class="text-2xl">{{ settings.destCountry.flag }}</span>
        </div>
      </div>
    </UCard>

    <!-- Currencies -->
    <UCard>
      <template #header>
        <SectionHeader
          description="Origin and destination currencies for display and conversion"
          icon="i-lucide-coins"
          title="Currencies"
        />
      </template>
      <div class="space-y-5">
        <UFormField
          description="The currency you earn and save in"
          label="Origin currency"
        >
          <USelectMenu
            v-model="settings.originCurrencyCode"
            :items="currencyItems"
            :search-input="{
              placeholder: 'Search currencies…',
              icon: 'i-lucide-search',
            }"
            class="w-full"
            value-key="value"
            @update:model-value="handleSave"
          />
        </UFormField>

        <UFormField
          description="The local currency at your destination"
          label="Destination currency"
        >
          <USelectMenu
            v-model="settings.destCurrencyCode"
            :items="currencyItems"
            :search-input="{
              placeholder: 'Search currencies…',
              icon: 'i-lucide-search',
            }"
            class="w-full"
            value-key="value"
            @update:model-value="handleSave"
          />
        </UFormField>

        <!-- Currency summary -->
        <div class="grid grid-cols-2 gap-3">
          <div
            class="p-3 rounded-xl bg-primary-50 dark:bg-primary-950 border border-primary-100 dark:border-primary-900"
          >
            <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">
              Origin
            </p>
            <p class="text-lg font-bold text-primary-700 dark:text-primary-300">
              {{ settings.originCurrency?.symbol }}
              <span class="text-sm font-medium ml-1">{{
                settings.originCurrency?.code
              }}</span>
            </p>
            <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
              {{ settings.originCurrency?.name }}
            </p>
          </div>
          <div
            class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">
              Destination
            </p>
            <p class="text-lg font-bold text-gray-700 dark:text-gray-300">
              {{ settings.destCurrency?.symbol }}
              <span class="text-sm font-medium ml-1">{{
                settings.destCurrency?.code
              }}</span>
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {{ settings.destCurrency?.name }}
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Exchange rates -->
    <UCard>
      <template #header>
        <SectionHeader
          description="Fetched automatically from Frankfurter (ECB data) or set manually"
          icon="i-lucide-arrow-left-right"
          title="Exchange rates"
        />
      </template>

      <div class="space-y-5">
        <!-- Fetch button + status -->
        <div
          class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Live rates via Frankfurter
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              <template v-if="rates.state.loading">
                Fetching live rates…
              </template>
              <template v-else-if="rates.state.lastUpdated">
                Updated
                {{
                  rates.state.lastUpdated.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
                via {{ rates.sourceLabel.value }} ·
                {{ rates.isStale.value ? "may be outdated" : "fresh" }}
              </template>
              <template v-else>
                No data fetched yet — click to get live rates
              </template>
            </p>
            <p
              v-if="rates.state.error"
              class="text-xs text-red-500 dark:text-red-400 mt-1"
            >
              {{ rates.state.error }}
            </p>
          </div>
          <UButton
            :loading="rates.state.loading"
            color="primary"
            icon="i-lucide-refresh-cw"
            label="Fetch rates"
            size="sm"
            variant="soft"
            @click="rates.fetchRates()"
          />
        </div>

        <USeparator />

        <!-- Manual overrides — always editable -->
        <UFormField
          :description="`How many USD equal 1 ${settings.originCurrencyCode}`"
          :label="`${settings.originCurrencyCode} → USD rate`"
        >
          <UInputNumber
            v-model="settings.originToUsdRate"
            :format-options="{
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
              useGrouping: false,
            }"
            :max="10000"
            :min="0.0001"
            :step="0.0001"
            class="w-full"
            @change="handleSave"
          />
        </UFormField>

        <UFormField
          :description="`How many ${settings.destCurrencyCode} equal 1 ${settings.originCurrencyCode}`"
          :label="`${settings.destCurrencyCode} units per ${settings.originCurrencyCode}`"
        >
          <UInputNumber
            v-model="settings.destUnitsPerOrigin"
            :format-options="{
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
              useGrouping: false,
            }"
            :max="100000"
            :min="0.0001"
            :step="0.0001"
            class="w-full"
            @change="handleSave"
          />
        </UFormField>

        <!-- Attribution — required by Frankfurter terms -->
        <p class="text-xs text-gray-400 dark:text-gray-500">
          Live rates provided by
          <a
            class="underline hover:text-gray-600 dark:hover:text-gray-300"
            href="https://frankfurter.dev"
            rel="noopener"
            target="_blank"
          >
            Frankfurter
          </a>
          (ECB reference rates, updated daily). You are welcome to cache this
          data and use it for personal currency conversion purposes.
        </p>
      </div>
    </UCard>

    <!-- Relocation date -->
    <UCard>
      <template #header>
        <SectionHeader
          description="When savings accumulation begins"
          icon="i-lucide-calendar"
          title="Relocation date"
        />
      </template>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Month">
          <USelect
            v-model="settings.relocationMonth"
            :items="monthItems"
            class="w-full"
            value-key="value"
            @update:model-value="handleSave"
          />
        </UFormField>
        <UFormField label="Year">
          <UInputNumber
            v-model="settings.relocationYear"
            :format-options="{ useGrouping: false }"
            :max="2040"
            :min="2024"
            :step="1"
            class="w-full"
            @change="handleSave"
          />
        </UFormField>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Savings timeline starts:
        <span class="font-medium text-gray-600 dark:text-gray-300">
          {{
            settings.relocationDate.toLocaleString("en-GB", {
              month: "long",
              year: "numeric",
            })
          }}
        </span>
      </p>
    </UCard>

    <!-- Scenario thresholds -->
    <UCard>
      <template #header>
        <SectionHeader
          description="Monthly savings rates used for the conservative and optimistic scenarios"
          icon="i-lucide-sliders-horizontal"
          title="Scenario thresholds"
        />
      </template>
      <div class="space-y-5">
        <UFormField
          description="A cautious estimate — higher spending, unexpected costs"
          label="Conservative rate (€/mo)"
        >
          <UInputNumber
            v-model="settings.conservativeRate"
            :max="settings.optimisticRate - 100"
            :min="500"
            :step="100"
            class="w-full"
            @change="handleSave"
          />
        </UFormField>
        <UFormField
          description="Best case — disciplined spending, growing income"
          label="Optimistic rate (€/mo)"
        >
          <UInputNumber
            v-model="settings.optimisticRate"
            :max="20000"
            :min="settings.conservativeRate + 100"
            :step="100"
            class="w-full"
            @change="handleSave"
          />
        </UFormField>

        <!-- Preview -->
        <div class="grid grid-cols-3 gap-2 text-center">
          <div
            class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <p class="text-xs text-gray-400 mb-1">Conservative</p>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              €{{ settings.conservativeRate.toLocaleString() }}/mo
            </p>
          </div>
          <div
            class="p-3 rounded-xl bg-primary-50 dark:bg-primary-950 border border-primary-100 dark:border-primary-900"
          >
            <p class="text-xs text-primary-500 mb-1">Base case</p>
            <p
              class="text-sm font-semibold text-primary-700 dark:text-primary-300"
            >
              your sliders
            </p>
          </div>
          <div
            class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <p class="text-xs text-gray-400 mb-1">Optimistic</p>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              €{{ settings.optimisticRate.toLocaleString() }}/mo
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Display preferences -->
    <UCard>
      <template #header>
        <SectionHeader
          description="How values are shown in the planner"
          icon="i-lucide-eye"
          title="Display"
        />
      </template>
      <div class="flex items-center justify-between py-1">
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show destination currency in sliders
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Display rent and utilities in
            {{ settings.destCurrency?.code ?? "local currency" }} rather than
            converted euros
          </p>
        </div>
        <USwitch
          v-model="settings.showDestCurrencyInSliders"
          size="md"
          @update:model-value="handleSave"
        />
      </div>
    </UCard>

    <!-- Reset -->
    <div class="flex items-center justify-between pt-2 pb-8">
      <UButton
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Back to planner"
        to="/"
        variant="ghost"
      />
      <UButton
        color="error"
        icon="i-lucide-rotate-ccw"
        label="Reset settings to defaults"
        variant="ghost"
        @click="handleReset"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CURRENCIES } from "~/utils/currencies";
import { COUNTRIES_GROUPED } from "~/utils/countries";
import type { SelectItem } from "@nuxt/ui";

useHead({ title: "Settings — Meridian" });

const settings = useSettingsStore();
const toast = useToast();

const rates = useExchangeRates();

// Currency select items
const currencyItems = CURRENCIES.map((c) => ({
  label: `${c.symbol} ${c.code} — ${c.name}`,
  value: c.code,
}));

// Month items
const monthItems: SelectItem[] = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

// Sync currency when country changes
function onOriginCountryChange(code: string) {
  settings.applyOriginCountry(code);
}

function onDestCountryChange(code: string) {
  settings.applyDestCountry(code);
}

function handleReset() {
  settings.resetToDefaults();
  toast.add({
    title: "Settings reset",
    description: "All settings restored to defaults.",
    color: "success",
  });
}

function handleSave() {
  toast.add({
    title: "Settings saved",
    description: "Your configuration has been saved automatically.",
    color: "success",
  });
}

onMounted(() => {
  if (rates.canFetch.value && rates.isStale.value) {
    rates.fetchRates();
  }
});

// Re-fetch when currencies change
watch(
  [() => settings.originCurrencyCode, () => settings.destCurrencyCode],
  () => {
    if (rates.canFetch.value) {
      rates.fetchRates();
    }
  },
);
</script>
