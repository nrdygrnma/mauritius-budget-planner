<template>
  <div class="max-w-3xl mx-auto px-6 py-12 space-y-10">
    <div>
      <UBadge class="mb-4" color="primary" size="sm" variant="subtle">
        Documentation
      </UBadge>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        How the planner works
      </h1>
      <p class="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
        Meridian helps you calculate how long it will take to save enough to
        purchase a G+2 apartment in Mauritius, starting from your January 2027
        relocation. Every slider updates the timeline in real time.
      </p>
    </div>

    <USeparator />

    <!-- Income & transfer -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Income and the EDB transfer
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Enter your combined net monthly income. The
        <strong class="text-gray-700 dark:text-gray-300"
          >mandatory EDB transfer</strong
        >
        ($2,000/month minimum) must be sent to your Mauritius bank account each
        month to maintain your Retired Non-Citizen Residence Permit. This is
        <em>spending money</em>, not savings — it covers your Mauritius living
        costs.
      </p>
      <UAlert
        color="info"
        description="The $2,000/month transfer flows into your Mauritius account and is spent on rent, groceries, utilities, and daily life. Only the income remaining in Europe after the transfer — minus health insurance and flights — becomes actual savings toward your property."
        icon="i-lucide-info"
        title="Transfer is not savings"
        variant="soft"
      />
    </div>

    <USeparator />

    <!-- Expenses -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Expense categories
      </h2>
      <div class="space-y-3">
        <div
          v-for="item in expenseCategories"
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
        Optional future expenses
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        These are expenses you don't have on day one but may acquire over time.
        Toggle them on individually to stress-test your savings timeline.
        Examples include a car (year two onwards), syndic fees once you own your
        apartment, professional subscriptions for your AI QA consulting work,
        and an emergency fund contribution.
      </p>
    </div>

    <USeparator />

    <!-- Dog relocation -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Dog relocation to Mauritius
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Mauritius has strict biosecurity rules. Your dog must be sterilised,
        microchipped (ISO 15-digit), and vaccinated against rabies between 60
        days and 12 months before entry. A rabies titer test is also required 30
        days to 6 months before entry. From Europe, the quarantine period is 5
        days (≈ Rs 200 total).
      </p>
      <UAlert
        color="warning"
        description="The import permit from the Ministry of Agriculture must be applied for 3–6 months in advance, and the permit can only be issued once you hold your Mauritius residence permit."
        icon="i-lucide-alert-triangle"
        title="Start at least 6 months before departure"
        variant="soft"
      />
    </div>

    <USeparator />

    <!-- G+2 scheme -->
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Docs — Meridian Budget Planner" });

const expenseCategories = [
  {
    icon: "i-lucide-home",
    title: "Mauritius living expenses",
    description:
      "Rent, electricity, internet, and mobile phones. Covered by your mandatory EDB transfer — these do not reduce your European savings.",
  },
  {
    icon: "i-lucide-shopping-basket",
    title: "Groceries and dining",
    description:
      "Based on a local-first approach — markets, farms, and local shops. Imported goods carry significant duty markups.",
  },
  {
    icon: "i-lucide-bus",
    title: "Transport",
    description:
      "Year one assumes no car — buses and taxis only. The Metro Express connects Port Louis to Curepipe affordably. Budget for short-term rental when needed.",
  },
  {
    icon: "i-lucide-plane",
    title: "Flights",
    description:
      "Your return trips to Austria plus financing your children's annual visits. Paid from European income, directly reducing monthly savings.",
  },
  {
    icon: "i-lucide-heart-pulse",
    title: "Health insurance",
    description:
      "International private cover for two people. Mauritius has good private clinics; a GP visit costs approximately €25–40. Public hospitals are free for residents.",
  },
];
</script>
