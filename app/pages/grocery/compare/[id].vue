<script lang="ts" setup>
import type { ComparisonRow } from "~/stores/grocery";

definePageMeta({ ssr: false });

const currentRoute = useRoute();
const router = useRouter();
const store = useGroceryStore();
const budgetStore = useBudgetStore();
const toast = useToast();
const { fmtMur, fmtEur } = useGroceryFormatters();

const listId = currentRoute.params.id as string;
const list = computed(() => store.lists.find((l) => l.id === listId));

watchEffect(() => {
  if (!list.value) router.push("/grocery/lists");
});

// ── Comparison data ───────────────────────────────────────────
const rows = computed<ComparisonRow[]>(() => store.listComparison(listId));

// All source ids that appear in the comparison
const activeSourceIds = computed(() => {
  const ids = new Set<string>();
  for (const row of rows.value) {
    for (const sid of Object.keys(row.pricesBySource)) {
      ids.add(sid);
    }
  }
  return [...ids];
});

// Ordered sources for column headers
const activeSources = computed(
  () =>
    activeSourceIds.value
      .map((id) => store.sources.find((s) => s.id === id))
      .filter(Boolean) as typeof store.sources,
);

// Per-source basket totals (only items available at that source)
const sourceTotals = computed(() => {
  const totals: Record<string, { mur: number; coverage: number }> = {};
  for (const src of activeSources.value) {
    let total = 0;
    let covered = 0;
    for (const row of rows.value) {
      const entry = row.pricesBySource[src.id];
      if (entry) {
        total += entry.price * row.qty;
        covered += 1;
      }
    }
    totals[src.id] = { mur: total, coverage: covered };
  }
  return totals;
});

// Cheapest full-basket total (mixing stores)
const cheapestMixed = computed(() =>
  rows.value.reduce((s, row) => {
    return s + (row.cheapestPrice ?? 0) * row.qty;
  }, 0),
);

// Which source wins on total basket cost (items available there)
const winningSourceId = computed(() => {
  let minTotal = Infinity;
  let winner = "";
  for (const [sid, data] of Object.entries(sourceTotals.value)) {
    if (data.mur > 0 && data.mur < minTotal) {
      minTotal = data.mur;
      winner = sid;
    }
  }
  return winner;
});

// ── Filters ───────────────────────────────────────────────────
const filterCat = ref("All");
const showMissing = ref(true);

const categories = computed(() => [
  "All",
  ...new Set(rows.value.map((r) => r.category)),
]);

const filteredRows = computed(() => {
  let r = rows.value;
  if (filterCat.value !== "All")
    r = r.filter((row) => row.category === filterCat.value);
  if (!showMissing.value)
    r = r.filter((row) => Object.keys(row.pricesBySource).length > 1);
  return r;
});

// ── Helpers ───────────────────────────────────────────────────
function sourceName(id: string) {
  return store.sources.find((s) => s.id === id)?.store ?? id;
}

function sourceDate(id: string) {
  return store.sources.find((s) => s.id === id)?.date ?? "";
}

function savings(sourceId: string): number {
  const totals = Object.values(sourceTotals.value)
    .map((t) => t.mur)
    .filter((t) => t > 0);
  if (totals.length < 2) return 0;
  const max = Math.max(...totals);
  return max - (sourceTotals.value[sourceId]?.mur ?? 0);
}

function coveragePct(sourceId: string): number {
  const total = rows.value.length;
  const covered = sourceTotals.value[sourceId]?.coverage ?? 0;
  return total > 0 ? Math.round((covered / total) * 100) : 0;
}

// ── Export ────────────────────────────────────────────────────
function exportCSV() {
  const headers = [
    "Product",
    "Category",
    "Unit",
    "Qty",
    ...activeSources.value.map((s) => `${s.store} (${s.date})`),
    "Cheapest price",
    "Cheapest store",
  ];
  const dataRows = rows.value.map((row) => [
    row.name,
    row.category,
    row.unit,
    row.qty.toString(),
    ...activeSources.value.map((s) => {
      const entry = row.pricesBySource[s.id];
      return entry ? entry.price.toString() : "";
    }),
    row.cheapestPrice?.toString() ?? "",
    row.cheapestSourceId ? sourceName(row.cheapestSourceId) : "",
  ]);
  const csv = [headers, ...dataRows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `comparison-${list.value?.name ?? listId}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// ── Meridian ──────────────────────────────────────────────────

function sendToMeridian() {
  const eur = Math.round(cheapestMixed.value / store.rate);
  budgetStore.groceries = eur;
  toast.add({
    title: "Meridian updated",
    description: `Groceries slider set to €${eur}`,
    color: "success",
  });
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <UButton
            color="neutral"
            icon="i-lucide-arrow-left"
            size="xs"
            to="/grocery/lists"
            variant="ghost"
          >
            Lists
          </UButton>
          <span class="text-gray-300 dark:text-gray-600">/</span>
          <UButton
            :to="`/grocery/lists/${listId}`"
            color="neutral"
            size="xs"
            variant="ghost"
          >
            {{ list?.name }}
          </UButton>
          <span class="text-gray-300 dark:text-gray-600">/</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            Compare prices
          </span>
        </div>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ rows.length }} items · {{ activeSources.length }} stores
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          icon="i-lucide-download"
          size="sm"
          variant="outline"
          @click="exportCSV"
        >
          Export CSV
        </UButton>
        <UButton
          v-if="list?.isMonthlyBaseline"
          color="primary"
          icon="i-lucide-arrow-right"
          size="sm"
          @click="sendToMeridian"
        >
          Send to Meridian
        </UButton>
      </div>
    </div>

    <!-- No data state -->
    <div v-if="!activeSources.length" class="py-20 text-center">
      <UIcon
        class="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4"
        name="i-lucide-bar-chart-2"
      />
      <p class="text-gray-500 dark:text-gray-400 font-medium">
        No comparison data yet
      </p>
      <p class="text-sm text-gray-400 mt-1 mb-4">
        Import brochures from at least two stores to compare prices
      </p>
      <UButton color="primary" icon="i-lucide-file-text" to="/grocery/sources">
        Go to sources
      </UButton>
    </div>

    <template v-else>
      <!-- Store summary cards -->
      <div
        :style="`grid-template-columns: repeat(${Math.min(activeSources.length + 1, 4)}, minmax(0, 1fr))`"
        class="grid gap-4"
      >
        <!-- Mixed cheapest card -->
        <div
          class="bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 rounded-xl p-4"
        >
          <p
            class="text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 font-medium"
          >
            Cheapest mix
          </p>
          <p
            class="text-2xl font-bold text-teal-700 dark:text-teal-300 tabular-nums"
          >
            {{ fmtMur(cheapestMixed) }}
          </p>
          <p class="text-sm font-mono text-teal-600 dark:text-teal-400 mt-0.5">
            {{ fmtEur(cheapestMixed / store.rate) }}
          </p>
          <p class="text-xs text-teal-500 dark:text-teal-500 mt-2">
            Best price per item across all stores
          </p>
        </div>

        <!-- Per-store cards -->
        <div
          v-for="src in activeSources"
          :key="src.id"
          :class="
            src.id === winningSourceId
              ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white'
              : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
          "
          class="rounded-xl p-4 border-2 transition-all"
        >
          <div class="flex items-start justify-between mb-1">
            <p
              :class="
                src.id === winningSourceId
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-400'
              "
              class="text-xs uppercase tracking-wider font-medium"
            >
              {{ src.store }}
            </p>
            <UBadge
              v-if="src.id === winningSourceId"
              color="info"
              size="xs"
              variant="subtle"
            >
              Cheapest
            </UBadge>
          </div>
          <p
            :class="
              src.id === winningSourceId
                ? 'text-white dark:text-gray-900'
                : 'text-gray-900 dark:text-white'
            "
            class="text-2xl font-bold tabular-nums"
          >
            {{ fmtMur(sourceTotals[src.id]?.mur ?? 0) }}
          </p>
          <p
            :class="
              src.id === winningSourceId
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-400'
            "
            class="text-sm font-mono mt-0.5"
          >
            {{ fmtEur((sourceTotals[src.id]?.mur ?? 0) / store.rate) }}
          </p>
          <div class="flex items-center justify-between mt-2">
            <p
              :class="
                src.id === winningSourceId
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-400'
              "
              class="text-xs"
            >
              {{ coveragePct(src.id) }}% coverage · {{ src.date }}
            </p>
            <p
              v-if="savings(src.id) > 0"
              class="text-xs font-mono text-teal-500"
            >
              saves {{ fmtMur(savings(src.id)) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex gap-1.5 flex-wrap">
          <UButton
            v-for="cat in categories"
            :key="cat"
            :color="filterCat === cat ? 'primary' : 'neutral'"
            :variant="filterCat === cat ? 'solid' : 'outline'"
            size="xs"
            @click="filterCat = cat"
          >
            {{ cat }}
          </UButton>
        </div>
        <label
          class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none ml-auto"
        >
          <USwitch v-model="showMissing" size="xs" />
          Show items missing from some stores
        </label>
      </div>

      <!-- Comparison table -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-x-auto"
      >
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider min-w-48"
              >
                Product
              </th>
              <th
                class="text-center px-3 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-12"
              >
                Qty
              </th>
              <th
                v-for="src in activeSources"
                :key="src.id"
                :class="
                  src.id === winningSourceId ? 'text-teal-500' : 'text-gray-400'
                "
                class="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider min-w-32"
              >
                {{ src.store }}
              </th>
              <th
                class="text-right px-4 py-3 text-xs font-medium text-teal-500 uppercase tracking-wider min-w-32"
              >
                Cheapest
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in filteredRows" :key="row.libraryItemId">
              <tr
                class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors last:border-0"
              >
                <!-- Product -->
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ row.name }}
                  </p>
                  <p class="text-xs text-gray-400">{{ row.unit }}</p>
                </td>

                <!-- Qty -->
                <td class="px-3 py-3 text-center">
                  <span class="font-mono text-sm text-gray-500"
                    >{{ row.qty }}×</span
                  >
                </td>

                <!-- Per-source price cells -->
                <td
                  v-for="src in activeSources"
                  :key="src.id"
                  class="px-4 py-3 text-right"
                >
                  <template v-if="row.pricesBySource[src.id]">
                    <div class="flex flex-col items-end gap-0.5">
                      <!-- Unit price -->
                      <span
                        :class="
                          src.id === row.cheapestSourceId
                            ? 'text-teal-600 dark:text-teal-400 font-semibold'
                            : 'text-gray-700 dark:text-gray-300'
                        "
                        class="font-mono text-sm"
                      >
                        {{ fmtMur(row.pricesBySource[src.id]!.price) }}
                      </span>
                      <!-- Line total -->
                      <span class="font-mono text-xs text-gray-400">
                        =
                        {{
                          fmtMur(row.pricesBySource[src.id]!.price * row.qty)
                        }}
                      </span>
                      <!-- Cheapest badge -->
                      <UBadge
                        v-if="
                          src.id === row.cheapestSourceId &&
                          activeSources.length > 1
                        "
                        color="info"
                        size="xs"
                        variant="subtle"
                      >
                        cheapest
                      </UBadge>
                    </div>
                  </template>
                  <span v-else class="text-gray-300 dark:text-gray-600 text-sm"
                    >—</span
                  >
                </td>

                <!-- Cheapest column -->
                <td class="px-4 py-3 text-right">
                  <template v-if="row.cheapestPrice !== null">
                    <p
                      class="font-mono text-sm font-semibold text-teal-600 dark:text-teal-400"
                    >
                      {{ fmtMur(row.cheapestPrice) }}
                    </p>
                    <p class="font-mono text-xs text-gray-400">
                      = {{ fmtMur(row.cheapestPrice * row.qty) }}
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ sourceName(row.cheapestSourceId ?? "") }}
                    </p>
                  </template>
                  <span v-else class="text-gray-300 dark:text-gray-600 text-sm"
                    >—</span
                  >
                </td>
              </tr>
            </template>
          </tbody>

          <!-- Totals row -->
          <tfoot>
            <tr
              class="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
              <td
                class="px-4 py-4 font-medium text-gray-900 dark:text-white"
                colspan="2"
              >
                Total
              </td>
              <td
                v-for="src in activeSources"
                :key="src.id"
                class="px-4 py-4 text-right"
              >
                <p
                  :class="
                    src.id === winningSourceId
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-gray-700 dark:text-gray-300'
                  "
                  class="font-mono text-sm font-bold"
                >
                  {{ fmtMur(sourceTotals[src.id]?.mur ?? 0) }}
                </p>
                <p class="font-mono text-xs text-gray-400">
                  {{ fmtEur((sourceTotals[src.id]?.mur ?? 0) / store.rate) }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ coveragePct(src.id) }}% of items
                </p>
              </td>
              <td class="px-4 py-4 text-right">
                <p
                  class="font-mono text-sm font-bold text-teal-600 dark:text-teal-400"
                >
                  {{ fmtMur(cheapestMixed) }}
                </p>
                <p class="font-mono text-xs text-gray-400">
                  {{ fmtEur(cheapestMixed / store.rate) }}
                </p>
                <p class="text-xs text-teal-500 mt-0.5">best mix</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Insight callout -->
      <div
        v-if="activeSources.length > 1 && winningSourceId"
        class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3"
      >
        <UIcon
          class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
          name="i-lucide-lightbulb"
        />
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ sourceName(winningSourceId) }}
            </span>
            is cheapest for this basket at
            <span class="font-mono font-medium">
              {{ fmtMur(sourceTotals[winningSourceId]?.mur ?? 0) }}
            </span>
            ({{
              fmtEur((sourceTotals[winningSourceId]?.mur ?? 0) / store.rate)
            }}).
          </p>
          <p v-if="!(savings(winningSourceId) > 0) && activeSources.length > 1">
            Shopping the cheapest item per store saves
            <span
              class="font-mono font-medium text-teal-600 dark:text-teal-400"
            >
              {{
                fmtMur(
                  Math.max(...Object.values(sourceTotals).map((t) => t.mur)) -
                    cheapestMixed,
                )
              }}
            </span>
            vs the most expensive option.
          </p>
          <p v-if="coveragePct(winningSourceId) < 100">
            Note: {{ sourceName(winningSourceId) }} only stocks
            {{ coveragePct(winningSourceId) }}% of your list items — you may
            need to supplement from another store.
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
