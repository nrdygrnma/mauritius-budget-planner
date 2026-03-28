const FRANKFURTER_SUPPORTED = new Set([
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
]);

const FRANKFURTER_BASE = "https://api.frankfurter.dev/v1";
const FAWAZ_CDN =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FAWAZ_FALLBACK = "https://latest.currency-api.pages.dev/v1/currencies";

interface FetchState {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  source: "frankfurter" | "fawazahmed0" | null;
}

// Fetch a single rate from fawazahmed0 — tries CDN first, falls back to Pages
async function fetchFawaz(base: string, target: string): Promise<number> {
  const baseLower = base.toLowerCase();
  const targetLower = target.toLowerCase();

  const urls = [
    `${FAWAZ_CDN}/${baseLower}.min.json`,
    `${FAWAZ_FALLBACK}/${baseLower}.min.json`,
    `${FAWAZ_CDN}/${baseLower}.json`,
    `${FAWAZ_FALLBACK}/${baseLower}.json`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const rate = data?.[baseLower]?.[targetLower];
      if (typeof rate === "number" && rate > 0) return rate;
    } catch {}
  }
  throw new Error(`Could not fetch ${base}→${target} from any source`);
}

// Fetch a single rate from Frankfurter
async function fetchFrankfurter(base: string, target: string): Promise<number> {
  if (base === target) return 1;
  const res = await fetch(
    `${FRANKFURTER_BASE}/latest?base=${base}&symbols=${target}`,
  );
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
  const data = await res.json();
  const rate = data?.rates?.[target];
  if (typeof rate !== "number" || rate <= 0)
    throw new Error("Invalid rate from Frankfurter");
  return rate;
}

export const useExchangeRates = () => {
  const settings = useSettingsStore();

  const state = reactive<FetchState>({
    loading: false,
    error: null,
    lastUpdated: null,
    source: null,
  });

  // Whether both currencies can use Frankfurter
  const bothFrankfurter = computed(
    () =>
      FRANKFURTER_SUPPORTED.has(settings.originCurrencyCode) &&
      FRANKFURTER_SUPPORTED.has(settings.destCurrencyCode),
  );

  // Always true — fawazahmed0 covers 200+ currencies
  const canFetch = computed(() => true);

  async function fetchRates() {
    state.loading = true;
    state.error = null;

    const origin = settings.originCurrencyCode;
    const dest = settings.destCurrencyCode;

    try {
      let usdRate: number;
      let destRate: number;

      if (bothFrankfurter.value) {
        // Both in Frankfurter — use it for both (more authoritative ECB data)
        [usdRate, destRate] = await Promise.all([
          origin === "USD"
            ? Promise.resolve(1)
            : fetchFrankfurter(origin, "USD"),
          origin === dest ? Promise.resolve(1) : fetchFrankfurter(origin, dest),
        ]);
        state.source = "frankfurter";
      } else {
        // At least one currency not in Frankfurter — use fawazahmed0 for both
        // (keeps rates consistent from one source)
        [usdRate, destRate] = await Promise.all([
          origin === "USD" ? Promise.resolve(1) : fetchFawaz(origin, "USD"),
          origin === dest ? Promise.resolve(1) : fetchFawaz(origin, dest),
        ]);
        state.source = "fawazahmed0";
      }

      settings.originToUsdRate = parseFloat(usdRate.toFixed(4));
      settings.destUnitsPerOrigin = parseFloat(destRate.toFixed(4));
      state.lastUpdated = new Date();
    } catch (err) {
      state.error =
        "Failed to fetch rates. Check your connection or set manually below.";
      console.error("[useExchangeRates]", err);
    } finally {
      state.loading = false;
    }
  }

  const isStale = computed(() => {
    if (!state.lastUpdated) return true;
    const hours = (Date.now() - state.lastUpdated.getTime()) / 1000 / 60 / 60;
    return hours > 24;
  });

  const sourceLabel = computed(() => {
    if (!state.source) return null;
    return state.source === "frankfurter"
      ? "Frankfurter (ECB)"
      : "fawazahmed0 (200+ currencies)";
  });

  return {
    state,
    canFetch,
    bothFrankfurter,
    isStale,
    sourceLabel,
    fetchRates,
  };
};
