import { defineStore } from "pinia";
import { addMonths, format } from "date-fns";
import type { Milestone, OptionalExpense } from "~/types/budget";

export const useBudgetStore = defineStore(
  "budget",
  () => {
    // ── Income ────────────────────────────────────────────────
    const incomeYou = ref(4000);
    const incomePartner = ref(3500);
    const totalIncome = computed(() => incomeYou.value + incomePartner.value);

    // ── Permit transfer ───────────────────────────────────────
    const transferUSD = ref(2000);
    const eurUsdRate = ref(1.09);
    const murEurRate = ref(52);
    const transferEUR = computed(() =>
      Math.round(transferUSD.value / eurUsdRate.value),
    );

    // ── Mauritius living expenses ──────────────────────────────
    const rent = ref(45000); // Rs
    const electricity = ref(4500); // Rs
    const internet = ref(29); // €
    const mobilePhones = ref(29); // €
    const groceries = ref(400); // €
    const diningOut = ref(77); // €
    const transport = ref(96); // €
    const dogMonthly = ref(80); // €
    const personalCare = ref(58); // €
    const leisureBuffer = ref(58); // €

    const totalMuExpenses = computed(
      () =>
        Math.round((rent.value + electricity.value) / murEurRate.value) +
        internet.value +
        mobilePhones.value +
        groceries.value +
        diningOut.value +
        transport.value +
        dogMonthly.value +
        personalCare.value +
        leisureBuffer.value,
    );

    const transferSurplus = computed(
      () => transferEUR.value - totalMuExpenses.value,
    );
    const transferDeficit = computed(() => transferSurplus.value < 0);

    // ── European expenses ──────────────────────────────────────
    const healthInsurance = ref(200);
    const tripsYouPerYear = ref(2);
    const flightPriceYou = ref(800);
    const numChildren = ref(2);
    const tripsKidsPerYear = ref(1);
    const flightPriceKids = ref(800);

    const flightsYouAnnual = computed(
      () => tripsYouPerYear.value * 2 * flightPriceYou.value,
    );
    const flightsKidsAnnual = computed(
      () => numChildren.value * tripsKidsPerYear.value * flightPriceKids.value,
    );
    const flightsYouMonthly = computed(() =>
      Math.round(flightsYouAnnual.value / 12),
    );
    const flightsKidsMonthly = computed(() =>
      Math.round(flightsKidsAnnual.value / 12),
    );
    const totalFlightsMonthly = computed(
      () => flightsYouMonthly.value + flightsKidsMonthly.value,
    );
    const totalEuDeductions = computed(
      () =>
        transferEUR.value + healthInsurance.value + totalFlightsMonthly.value,
    );
    const monthlySavings = computed(
      () => totalIncome.value - totalEuDeductions.value,
    );

    // ── Optional future expenses ───────────────────────────────
    const optionalExpenses = ref<Record<string, OptionalExpense>>({
      carRental: {
        enabled: false,
        value: 300,
        label: "Car rental / lease",
        min: 100,
        max: 800,
        step: 50,
        description: "Year 2+ when you move off public transport",
      },
      carInsurance: {
        enabled: false,
        value: 80,
        label: "Car insurance + road tax",
        min: 30,
        max: 200,
        step: 10,
        description: "Annual cost amortised monthly",
      },
      fuel: {
        enabled: false,
        value: 60,
        label: "Fuel",
        min: 20,
        max: 200,
        step: 10,
        description: "Only applicable once you have a car",
      },
      healthTopUp: {
        enabled: false,
        value: 100,
        label: "Private healthcare top-up",
        min: 0,
        max: 400,
        step: 10,
        description: "Specialist visits beyond base insurance",
      },
      syndicFees: {
        enabled: false,
        value: 170,
        label: "Syndic fees",
        min: 50,
        max: 500,
        step: 10,
        description: "Monthly building management fee once you own",
      },
      professionalSubs: {
        enabled: false,
        value: 80,
        label: "Professional subscriptions",
        min: 0,
        max: 300,
        step: 10,
        description: "Tools, certifications, CT-AI study materials",
      },
      consultingCosts: {
        enabled: false,
        value: 100,
        label: "Consulting business costs",
        min: 0,
        max: 400,
        step: 10,
        description: "Software, accounting, backup internet",
      },
      emergencyFund: {
        enabled: false,
        value: 200,
        label: "Emergency fund contribution",
        min: 50,
        max: 500,
        step: 50,
        description: "Monthly target toward a 3-month reserve",
      },
      familySupport: {
        enabled: false,
        value: 0,
        label: "Family support / remittances",
        min: 0,
        max: 500,
        step: 50,
        description: "Support to family remaining in Europe",
      },
    });

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

    // ── Property target ────────────────────────────────────────
    const propertyPrice = ref(130000);
    const purchaseFees = ref(13000);
    const dogRelocation = ref(1200);
    const existingSavings = ref(0);
    const startDate = ref(new Date(2027, 0, 1));

    const grandTotal = computed(
      () => propertyPrice.value + purchaseFees.value + dogRelocation.value,
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

    // ── Milestones ─────────────────────────────────────────────
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

    // ── Scenarios ──────────────────────────────────────────────
    const scenarios = computed(() => {
      const rates = [4200, adjustedMonthlySavings.value, 6500];
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

    // ── Savings chart data ─────────────────────────────────────
    const chartData = computed(() => {
      if (!monthsToTarget.value) return { labels: [], data: [] };
      const totalMonths = monthsToTarget.value + 6;
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = 0; i <= totalMonths; i++) {
        const d = addMonths(startDate.value, i);
        labels.push(format(d, "MMM yyyy"));
        data.push(
          Math.min(
            existingSavings.value + adjustedMonthlySavings.value * i,
            grandTotal.value + 10000,
          ),
        );
      }
      return { labels, data };
    });

    // ── Reset ──────────────────────────────────────────────────
    function resetToDefaults() {
      incomeYou.value = 4000;
      incomePartner.value = 3500;
      transferUSD.value = 2000;
      eurUsdRate.value = 1.09;
      murEurRate.value = 52;
      rent.value = 45000;
      electricity.value = 4500;
      internet.value = 29;
      mobilePhones.value = 29;
      groceries.value = 400;
      diningOut.value = 77;
      transport.value = 96;
      dogMonthly.value = 80;
      personalCare.value = 58;
      leisureBuffer.value = 58;
      healthInsurance.value = 200;
      tripsYouPerYear.value = 2;
      flightPriceYou.value = 800;
      numChildren.value = 2;
      tripsKidsPerYear.value = 1;
      flightPriceKids.value = 800;
      Object.values(optionalExpenses.value).forEach((e) => {
        e.enabled = false;
      });
      propertyPrice.value = 130000;
      purchaseFees.value = 13000;
      dogRelocation.value = 1200;
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
      murEurRate,
      transferEUR,
      // MU expenses
      rent,
      electricity,
      internet,
      mobilePhones,
      groceries,
      diningOut,
      transport,
      dogMonthly,
      personalCare,
      leisureBuffer,
      totalMuExpenses,
      transferSurplus,
      transferDeficit,
      // EU expenses
      healthInsurance,
      tripsYouPerYear,
      flightPriceYou,
      numChildren,
      tripsKidsPerYear,
      flightPriceKids,
      flightsYouAnnual,
      flightsKidsAnnual,
      flightsYouMonthly,
      flightsKidsMonthly,
      totalFlightsMonthly,
      totalEuDeductions,
      monthlySavings,
      // optional
      optionalExpenses,
      totalOptionalActive,
      activeOptionalCount,
      adjustedMonthlySavings,
      // target
      propertyPrice,
      purchaseFees,
      dogRelocation,
      existingSavings,
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
      key: "mauritius-budget-v1",
    },
  },
);
