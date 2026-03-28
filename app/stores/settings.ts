import { defineStore } from "pinia";
import { getCurrency } from "~/utils/currencies";
import { getCountry } from "~/utils/countries";
import type { Currency } from "~/types";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const lastRatesFetch = ref<string | null>(null); // ISO string for persistence
    const acquisitionFeePercent = ref(10); // percentage of purchase price

    // ── Location ───────────────────────────────────────────────
    const originCountryCode = ref("AT"); // where you live now
    const destCountryCode = ref("MU"); // where you're moving to

    const originCountry = computed(() => getCountry(originCountryCode.value));
    const destCountry = computed(() => getCountry(destCountryCode.value));

    // ── Currencies ─────────────────────────────────────────────
    const originCurrencyCode = ref("EUR");
    const destCurrencyCode = ref("MUR");
    const originCurrency = computed<Currency>(() =>
      getCurrency(originCurrencyCode.value),
    );
    const destCurrency = computed<Currency>(() =>
      getCurrency(destCurrencyCode.value),
    );

    // ── Exchange rates ─────────────────────────────────────────
    // These mirror budget store sliders but live here as the
    // "authoritative" source — budget store reads from settings
    const originToUsdRate = ref(1.09); // e.g. 1 EUR = 1.09 USD
    const destUnitsPerOrigin = ref(52); // e.g. 52 MUR = 1 EUR

    // ── Relocation ─────────────────────────────────────────────
    const relocationYear = ref(2027);
    const relocationMonth = ref(1); // 1-based
    const relocationDate = computed(
      () => new Date(relocationYear.value, relocationMonth.value - 1, 1),
    );

    // ── Planner settings ───────────────────────────────────────
    const plannerName = ref(""); // optional custom label
    const conservativeRate = ref(4200); // €/mo for conservative scenario
    const optimisticRate = ref(6500); // €/mo for optimistic scenario

    // ── Display ────────────────────────────────────────────────
    const showDestCurrencyInSliders = ref(true); // show Rs / local amounts

    // ── Sync helpers — called when country changes ─────────────
    function applyOriginCountry(code: string) {
      originCountryCode.value = code;
      const country = getCountry(code);
      if (country) originCurrencyCode.value = country.currency;
    }

    function applyDestCountry(code: string) {
      destCountryCode.value = code;
      const country = getCountry(code);
      if (country) destCurrencyCode.value = country.currency;
    }

    function resetToDefaults() {
      acquisitionFeePercent.value = 10;
      originCountryCode.value = "AT";
      destCountryCode.value = "MU";
      originCurrencyCode.value = "EUR";
      destCurrencyCode.value = "MUR";
      originToUsdRate.value = 1.09;
      destUnitsPerOrigin.value = 52;
      relocationYear.value = 2027;
      relocationMonth.value = 1;
      plannerName.value = "";
      conservativeRate.value = 4200;
      optimisticRate.value = 6500;
      showDestCurrencyInSliders.value = true;
    }

    return {
      acquisitionFeePercent,
      lastRatesFetch,
      originCountryCode,
      destCountryCode,
      originCountry,
      destCountry,
      originCurrencyCode,
      destCurrencyCode,
      originCurrency,
      destCurrency,
      originToUsdRate,
      destUnitsPerOrigin,
      relocationYear,
      relocationMonth,
      relocationDate,
      plannerName,
      conservativeRate,
      optimisticRate,
      showDestCurrencyInSliders,
      applyOriginCountry,
      applyDestCountry,
      resetToDefaults,
    };
  },
  {
    persist: { key: "meridian-settings-v1" },
  },
);
