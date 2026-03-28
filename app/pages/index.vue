<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <PlannerSummary @export="handleExport" @reset="showReset = true" />

    <div
      class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-2 gap-8"
    >
      <div class="space-y-6">
        <BudgetIncome />
        <BudgetTransfer />
        <BudgetDestExpenses />
        <BudgetHomeExpenses />
        <BudgetOptional />
        <BudgetTarget />
      </div>

      <div
        class="space-y-6 xl:sticky xl:top-[calc(var(--ui-header-height)+5rem)] xl:self-start"
      >
        <UAlert
          v-if="store.adjustedMonthlySavings <= 0"
          color="error"
          description="Your current settings result in no savings. Adjust income or reduce expenses."
          icon="i-lucide-circle-alert"
          title="Expenses exceed income"
          variant="soft"
        />
        <ResultsChart />
        <ResultsMilestones />
        <ResultsScenarios />
        <ResultsBreakdown />
      </div>
    </div>

    <ResetModal v-model:open="showReset" @confirm="handleReset" />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Meridian — Relocation Budget Planner" });

const store = useBudgetStore();
const showReset = ref(false);

function handleExport() {
  const data = JSON.stringify(store.$state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meridian-budget-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleReset() {
  store.resetToDefaults();
  showReset.value = false;
  nextTick(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
}
</script>
