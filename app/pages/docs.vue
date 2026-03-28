<template>
  <div class="max-w-3xl mx-auto px-6 py-12 space-y-10">
    <div>
      <UBadge class="mb-4" color="primary" size="sm" variant="subtle"
        >Documentation</UBadge
      >
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        How the planner works
      </h1>
      <p class="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
        Meridian helps you calculate how long it will take to save enough to
        make a major purchase — typically a property — after relocating abroad.
        Every slider updates your savings timeline in real time. Your settings
        are saved automatically.
      </p>
    </div>

    <USeparator />

    <!-- The formula -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The formula
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The core calculation is straightforward:
      </p>
      <div
        class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-700 dark:text-gray-300 space-y-2"
      >
        <p>Monthly savings = Total income</p>
        <p class="pl-4 text-gray-400">
          − Visa transfer (covers destination living costs)
        </p>
        <p class="pl-4 text-gray-400">− Health insurance</p>
        <p class="pl-4 text-gray-400">− Flights (amortised monthly)</p>
        <p class="pl-4 text-gray-400">− Any enabled optional expenses</p>
        <USeparator class="my-2!" />
        <p>
          Months to target = (Purchase price + fees + relocation − existing
          savings)
        </p>
        <p class="pl-20 text-gray-400">÷ Monthly savings</p>
      </div>
      <UAlert
        color="info"
        description="The mandatory monthly transfer flows into your destination bank account and funds your life there. Only the income remaining in your home country — after the transfer, insurance, and flights — becomes actual savings toward your purchase target."
        icon="i-lucide-info"
        title="The visa transfer is not savings"
        variant="soft"
      />
    </div>

    <USeparator />

    <!-- Section guide -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Section guide
      </h2>
      <div class="space-y-3">
        <div
          v-for="item in sections"
          :key="item.title"
          class="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        >
          <div
            class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0 mt-0.5"
          >
            <UIcon :name="item.icon" class="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <p
              class="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              {{ item.title }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <USeparator />

    <!-- Optional expenses -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Scenarios and sensitivity
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The right-hand panel shows three scenarios — conservative (€4,200/mo
        saved), base case (your current settings), and optimistic (€6,500/mo).
        Use these to understand the range of possible timelines.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The optional future expenses section lets you toggle on costs you expect
        to add later — a car, higher healthcare spending, business costs —
        without changing your baseline. This is useful for answering "what if I
        buy a car in year two?" without permanently adjusting the plan.
      </p>
    </div>

    <USeparator />

    <!-- Persistence -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Saving and exporting
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        All settings are saved automatically to your browser's
        <code
          class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono"
          >localStorage</code
        >
        and restored on every visit. Use
        <strong class="text-gray-700 dark:text-gray-300">Export JSON</strong>
        in the summary strip to download a dated snapshot of your current
        assumptions — useful for comparing how your plan evolves over time. Use
        <strong class="text-gray-700 dark:text-gray-300"
          >Reset to defaults</strong
        >
        to restore all sliders to their factory values.
      </p>
    </div>

    <USeparator />

    <div class="pb-8">
      <UButton
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Back to planner"
        to="/"
        variant="ghost"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Docs — Meridian" });

const sections = [
  {
    icon: "i-lucide-wallet",
    title: "Income",
    description:
      "Enter the net monthly take-home pay for you and your partner in euros. All calculations are euro-denominated — if you earn in another currency, convert first and adjust the EUR/USD rate slider accordingly.",
  },
  {
    icon: "i-lucide-landmark",
    title: "Visa transfer requirement",
    description:
      "Many long-stay visas and residency permits require a minimum monthly transfer into a local bank account in the destination country. This money is not savings — it's your destination spending budget. Enter the required amount in USD (or zero if your visa has no transfer requirement), then set the exchange rate. The planner will warn you if your destination living costs exceed the transfer amount.",
  },
  {
    icon: "i-lucide-map-pin",
    title: "Destination living expenses",
    description:
      "Your expected monthly costs in the destination country. Housing (rent + utilities) is entered in the local destination currency and converted using your rate. Everything else is in euros. These expenses are assumed to be covered by the visa transfer, so they don't directly reduce your European savings — but they do affect the transfer surplus warning.",
  },
  {
    icon: "i-lucide-plane",
    title: "Home country expenses",
    description:
      "Costs you continue paying from your European income: health insurance, return flights home, and flights for visitors. These are amortised monthly and deducted directly from your savings. Flights are the most variable item — adjust based on your destination and how often you plan to travel.",
  },
  {
    icon: "i-lucide-toggle-right",
    title: "Optional future expenses",
    description:
      "Costs you don't have on arrival but may add over time — a car, housing fees, business costs, an emergency fund. Toggle these on individually to see how they affect your timeline without permanently changing your baseline.",
  },
  {
    icon: "i-lucide-home",
    title: "Purchase target",
    description:
      "Set your target property price, acquisition fees (taxes, legal, agent), and one-time relocation costs. If you already have savings set aside, enter them here to reduce the amount you need to accumulate. The planner calculates how many months from your start date until you reach the full amount.",
  },
];
</script>
