import { defineStore } from "pinia";
import { addMonths } from "date-fns";
import type { Milestone, OptionalExpense } from "~/types";
import { DEFAULT_OPTIONAL_EXPENSES } from "~/data/optionalExpenses";

export const useBudgetStore = defineStore(
  "budget",
  () => {
    const settings = useSettingsStore();
    const optionalExpenses = ref<Record<string, OptionalExpense>>(
      structuredClone(DEFAULT_OPTIONAL_EXPENSES),
    );
    // ── Income ────────────────────────────────────────────────
    const incomeYou = ref(4000);
    const incomePartner = ref(3500);
    const totalIncome = computed(() => incomeYou.value + incomePartner.value);

    // ── Visa / permit transfer ────────────────────────────────
    const transferUSD = ref(2000);
    const eurUsdRate = computed({
      get: () => settings.originToUsdRate,
      set: (v) => {
        settings.originToUsdRate = v;
      },
    });
    const destCurrencyRate = computed({
      get: () => settings.destUnitsPerOrigin,
      set: (v) => {
        settings.destUnitsPerOrigin = v;
      },
    });
    const destCurrencyCode = ref("MUR"); // 3-letter code shown in UI
    const transferEUR = computed(() =>
      Math.round(transferUSD.value / eurUsdRate.value),
    );

    // ── Destination living expenses ───────────────────────────
    const rent = ref(45000); // destination currency
    const electricity = ref(4500); // destination currency
    const internet = ref(29); // EUR
    const mobilePhones = ref(29); // EUR
    const groceries = ref(400); // EUR
    const diningOut = ref(77); // EUR
    const transport = ref(96); // EUR
    const petMonthly = ref(80); // EUR
    const personalCare = ref(58); // EUR
    const leisureBuffer = ref(58); // EUR

    const totalDestExpenses = computed(
      () =>
        Math.round((rent.value + electricity.value) / destCurrencyRate.value) +
        internet.value +
        mobilePhones.value +
        groceries.value +
        diningOut.value +
        transport.value +
        petMonthly.value +
        personalCare.value +
        leisureBuffer.value,
    );
    const transferSurplus = computed(
      () => transferEUR.value - totalDestExpenses.value,
    );
    const transferDeficit = computed(() => transferSurplus.value < 0);

    // ── Home country expenses ─────────────────────────────────
    const healthInsurance = ref(200);
    const tripsYouPerYear = ref(2);
    const flightPriceYou = ref(800);
    const numDependants = ref(2);
    const tripsVisitorsPerYear = ref(1);
    const flightPriceVisitors = ref(800);

    const flightsYouAnnual = computed(
      () => tripsYouPerYear.value * 2 * flightPriceYou.value,
    );
    const flightsVisitorsAnnual = computed(
      () =>
        numDependants.value *
        tripsVisitorsPerYear.value *
        flightPriceVisitors.value,
    );
    const flightsYouMonthly = computed(() =>
      Math.round(flightsYouAnnual.value / 12),
    );
    const flightsVisitorsMonthly = computed(() =>
      Math.round(flightsVisitorsAnnual.value / 12),
    );
    const totalFlightsMonthly = computed(
      () => flightsYouMonthly.value + flightsVisitorsMonthly.value,
    );
    const totalHomeDeductions = computed(
      () =>
        transferEUR.value + healthInsurance.value + totalFlightsMonthly.value,
    );
    const monthlySavings = computed(
      () => totalIncome.value - totalHomeDeductions.value,
    );

    const totalOptionalActive = computed(() =>
      Object.values(optionalExpenses.value)
        .filter((e) => e.enabled)
        .reduce((sum, e) => sum + e.value, 0),
    );
    const activeOptionalCount = computed(
      () =>
        Object.values(optionalExpenses.value).filter((e) => e.enabled).length,
    );
    const adjustedMonthlySavings = computed(
      () => monthlySavings.value - totalOptionalActive.value,
    );

    // ── Property / purchase target ────────────────────────────
    const propertyPrice = ref(130000);
    const purchaseFees = computed(
      () =>
        Math.round(
          (propertyPrice.value * settings.acquisitionFeePercent) / 100 / 100,
        ) * 100,
    );
    const relocationCosts = ref(1200); // one-time moving/setup costs
    const existingSavings = ref(0);
    const startDate = computed(() => settings.relocationDate);

    const grandTotal = computed(
      () => propertyPrice.value + purchaseFees.value + relocationCosts.value,
    );
    const remaining = computed(() =>
      Math.max(0, grandTotal.value - existingSavings.value),
    );
    const monthsToTarget = computed(() =>
      adjustedMonthlySavings.value > 0
        ? Math.ceil(remaining.value / adjustedMonthlySavings.value)
        : null,
    );
    const readyDate = computed(() =>
      monthsToTarget.value !== null
        ? addMonths(startDate.value, monthsToTarget.value)
        : null,
    );
    const progressPercent = computed(() =>
      Math.min(
        100,
        Math.round((existingSavings.value / grandTotal.value) * 100),
      ),
    );

    // ── Milestones ────────────────────────────────────────────
    const milestones = computed<Milestone[]>(() => {
      const targets = [25000, 50000, 75000, 100000, 125000, grandTotal.value];
      return targets
        .map((amount) => {
          const needed = Math.max(0, amount - existingSavings.value);
          const months =
            adjustedMonthlySavings.value > 0
              ? Math.ceil(needed / adjustedMonthlySavings.value)
              : null;
          return {
            label:
              amount === grandTotal.value
                ? "Target reached"
                : `€${(amount / 1000).toFixed(0)}k saved`,
            amount,
            months,
            date: months !== null ? addMonths(startDate.value, months) : null,
          };
        })
        .filter((m) => m.amount <= grandTotal.value);
    });

    // ── Scenarios ─────────────────────────────────────────────
    const scenarios = computed(() => {
      const rates = [
        settings.conservativeRate,
        adjustedMonthlySavings.value,
        settings.optimisticRate,
      ];
      const labels = ["Conservative", "Base case", "Optimistic"];
      return rates.map((rate, i) => {
        const months = rate > 0 ? Math.ceil(remaining.value / rate) : null;
        return {
          label: labels[i],
          rate,
          months,
          date: months !== null ? addMonths(startDate.value, months) : null,
          isBase: i === 1,
        };
      });
    });

    // ── Chart data ────────────────────────────────────────────
    const chartData = computed(() => {
      const target = monthsToTarget.value;
      if (target === null) return { labels: [], data: [] }; // ← guard here, not just falsy check
      const totalMonths = target + 6;
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = 0; i <= totalMonths; i++) {
        const d = addMonths(startDate.value, i);
        labels.push(
          d.toLocaleString("en-GB", { month: "short", year: "numeric" }),
        );
        data.push(
          Math.min(
            existingSavings.value + adjustedMonthlySavings.value * i,
            grandTotal.value + 10000,
          ),
        );
      }
      return { labels, data };
    });

    // ── Reset ─────────────────────────────────────────────────
    function resetToDefaults() {
      incomeYou.value = 4000;
      incomePartner.value = 3500;
      transferUSD.value = 2000;
      eurUsdRate.value = 1.09;
      destCurrencyRate.value = 52;
      destCurrencyCode.value = "MUR";
      rent.value = 45000;
      electricity.value = 4500;
      internet.value = 29;
      mobilePhones.value = 29;
      groceries.value = 400;
      diningOut.value = 77;
      transport.value = 96;
      petMonthly.value = 80;
      personalCare.value = 58;
      leisureBuffer.value = 58;
      healthInsurance.value = 200;
      tripsYouPerYear.value = 2;
      flightPriceYou.value = 800;
      numDependants.value = 2;
      tripsVisitorsPerYear.value = 1;
      flightPriceVisitors.value = 800;
      optionalExpenses.value = structuredClone(DEFAULT_OPTIONAL_EXPENSES);
      propertyPrice.value = 130000;
      relocationCosts.value = 1200;
      existingSavings.value = 0;
    }

    return {
      // income
      incomeYou,
      incomePartner,
      totalIncome,
      // transfer
      transferUSD,
      eurUsdRate,
      destCurrencyRate,
      destCurrencyCode,
      transferEUR,
      // destination expenses
      rent,
      electricity,
      internet,
      mobilePhones,
      groceries,
      diningOut,
      transport,
      petMonthly,
      personalCare,
      leisureBuffer,
      totalDestExpenses,
      transferSurplus,
      transferDeficit,
      // home expenses
      healthInsurance,
      tripsYouPerYear,
      flightPriceYou,
      numDependants,
      tripsVisitorsPerYear,
      flightPriceVisitors,
      flightsYouAnnual,
      flightsVisitorsAnnual,
      flightsYouMonthly,
      flightsVisitorsMonthly,
      totalFlightsMonthly,
      totalHomeDeductions,
      monthlySavings,
      // optional
      optionalExpenses,
      totalOptionalActive,
      activeOptionalCount,
      adjustedMonthlySavings,
      // target
      propertyPrice,
      purchaseFees,
      relocationCosts,
      existingSavings,
      startDate,
      grandTotal,
      remaining,
      monthsToTarget,
      readyDate,
      progressPercent,
      milestones,
      scenarios,
      chartData,
      // actions
      resetToDefaults,
    };
  },
  {
    persist: {
      key: "meridian-budget-v1",
    },
  },
);
