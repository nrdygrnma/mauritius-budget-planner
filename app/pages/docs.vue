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
        make a major purchase after relocating abroad. Every slider updates your
        savings timeline in real time. Your settings are saved automatically to
        your browser.
      </p>
    </div>

    <USeparator />

    <!-- Formula -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The formula
      </h2>
      <div
        class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-700 dark:text-gray-300 space-y-1.5"
      >
        <p>Monthly savings = Total income</p>
        <p class="pl-6 text-gray-400">
          − Visa transfer (funds your destination life)
        </p>
        <p class="pl-6 text-gray-400">− Health insurance</p>
        <p class="pl-6 text-gray-400">− Flights (amortised monthly)</p>
        <p class="pl-6 text-gray-400">− Any enabled optional expenses</p>
        <USeparator class="my-3!" />
        <p>
          Months to target = (Purchase price + fees + relocation − existing
          savings)
        </p>
        <p class="pl-24 text-gray-400">÷ Monthly savings</p>
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

    <!-- Settings -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Settings
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The Settings page (gear icon in the nav) controls the global context for
        the planner: origin and destination countries, currencies, exchange
        rates, relocation date, and scenario thresholds. Changing the
        destination country automatically fills in the destination currency.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Exchange rates are fetched automatically from
        <a
          class="text-primary-600 dark:text-primary-400 hover:underline"
          href="https://frankfurter.dev"
          rel="noopener"
          target="_blank"
          >Frankfurter</a
        >
        (ECB reference rates, 31 currencies) or
        <a
          class="text-primary-600 dark:text-primary-400 hover:underline"
          href="https://github.com/fawazahmed0/exchange-api"
          rel="noopener"
          target="_blank"
          >fawazahmed0/exchange-api</a
        >
        (200+ currencies) depending on which currencies you have selected. No
        API key is required. Rates are updated daily and can always be
        overridden manually.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The current exchange rates are shown as read-only values in the Transfer
        card on the planner page — they are not editable there to keep the
        source of truth in one place.
      </p>
    </div>

    <USeparator />

    <!-- Scenarios -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Scenarios and sensitivity
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The results panel shows three scenarios — conservative, base case (your
        current sliders), and optimistic. The conservative and optimistic
        savings rates are configurable in Settings, defaulting to €4,200/mo and
        €6,500/mo respectively. Use these to understand the range of possible
        timelines without changing your baseline plan.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The optional future expenses section lets you toggle on costs you expect
        to add later — a car, higher healthcare spending, business costs — to
        see the impact on your timeline without permanently adjusting the plan.
      </p>
    </div>

    <USeparator />

    <!-- PDF export -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        PDF export
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The
        <strong class="text-gray-700 dark:text-gray-300">Export PDF</strong>
        button in the summary strip generates a formatted A4 report covering
        every section of the planner — income, transfer, destination expenses,
        home expenses, any active optional expenses, purchase target, savings
        breakdown, three scenarios, and milestones. Only optional expenses that
        are currently toggled on are included.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        The filename is derived from your plan name if you have set one in
        Settings (e.g.
        <code
          class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono"
          >meridian-move-to-mauritius-2027-2026-01-15.pdf</code
        >), otherwise it defaults to a dated filename.
      </p>
    </div>

    <USeparator />

    <!-- Persistence -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Saving and persistence
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        All settings are saved automatically to your browser's
        <code
          class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono"
          >localStorage</code
        >
        and restored on every visit — no account or server needed. Budget state
        and settings are stored separately so resetting one does not affect the
        other.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Use
        <strong class="text-gray-700 dark:text-gray-300">Export PDF</strong> to
        save a snapshot of your plan at a point in time. Use
        <strong class="text-gray-700 dark:text-gray-300"
          >Reset to defaults</strong
        >
        in the summary strip to restore all planner sliders, or the reset button
        in Settings to restore global configuration.
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
      "Enter the net monthly take-home pay for you and your partner in your home currency. All calculations are euro-denominated — if you earn in another currency, set the origin currency and exchange rate in Settings first.",
  },
  {
    icon: "i-lucide-landmark",
    title: "Visa transfer requirement",
    description:
      "Many long-stay visas and residency permits require a minimum monthly transfer into a local bank account at the destination. This money is not savings — it is your destination spending budget. Enter the required amount in USD. The current EUR/USD and destination currency rates are shown as read-only values, fetched automatically in Settings.",
  },
  {
    icon: "i-lucide-map-pin",
    title: "Destination living expenses",
    description:
      "Your expected monthly costs at the destination. Housing (rent and utilities) is entered in the local destination currency and converted using your configured rate. Everything else is in euros. These expenses are assumed to be covered by the visa transfer — they do not directly reduce your savings, but they do affect the transfer surplus warning.",
  },
  {
    icon: "i-lucide-plane",
    title: "Home country expenses",
    description:
      "Costs you continue paying from your home country income: health insurance, return flights, and flights for visitors you finance. These are amortised monthly and deducted directly from your savings. Flights are the most variable item — adjust based on your destination distance and how often you plan to travel.",
  },
  {
    icon: "i-lucide-toggle-right",
    title: "Optional future expenses",
    description:
      "Costs you do not have on arrival but may add over time — a car, housing body corporate fees, higher healthcare spending, business costs. Toggle these on individually to see how each affects your timeline without permanently changing your baseline. Only active optional expenses appear in the PDF export.",
  },
  {
    icon: "i-lucide-home",
    title: "Purchase target",
    description:
      "Set your target property price, acquisition fees (taxes, legal, agent commission), and one-time relocation costs. If you already have savings set aside, enter them here to reduce the amount you need to accumulate. The planner calculates how many months from your relocation date until you reach the full amount.",
  },
];
</script>
