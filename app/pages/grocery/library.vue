<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <!-- Toolbar -->
      <div class="flex items-start gap-3 flex-wrap">
        <UInput
          v-model="search"
          class="w-64"
          icon="i-lucide-search"
          placeholder="Search library…"
          size="sm"
        />

        <div class="flex gap-1.5 flex-wrap flex-1">
          <!-- Store filter -->
          <template v-if="storeNames.length > 2">
            <UButton
              v-for="s in storeNames"
              :key="s"
              :color="filterStore === s ? 'primary' : 'neutral'"
              :variant="filterStore === s ? 'solid' : 'outline'"
              size="xs"
              @click="filterStore = s"
            >
              {{ s }}
            </UButton>
            <div class="w-px bg-gray-200 dark:bg-gray-700 self-stretch mx-1" />
          </template>

          <!-- Category filter -->
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

        <div class="flex items-center gap-2 ml-auto shrink-0">
          <label
            class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none"
          >
            <USwitch v-model="showOnlyComparable" size="xs" />
            Comparable only
          </label>
          <UButton
            color="neutral"
            icon="i-lucide-download"
            size="sm"
            variant="outline"
            @click="exportCSV"
          >
            Export
          </UButton>
        </div>
      </div>

      <!-- Stats row -->
      <div class="flex items-center gap-6 text-xs text-gray-400">
        <span>{{ filtered.length.toLocaleString() }} items</span>
        <span>{{ store.sources.length }} sources</span>
        <span>{{ store.comparableItems.length }} comparable products</span>
        <span>{{ store.storeNames.length }} stores</span>
      </div>

      <!-- Empty state -->
      <div v-if="!store.libraryItems.length" class="py-24 text-center">
        <UIcon
          class="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4"
          name="i-lucide-library"
        />
        <p class="text-gray-500 dark:text-gray-400 font-medium">
          Price library is empty
        </p>
        <p class="text-sm text-gray-400 mt-1">
          Import a CSV from a supermarket brochure to get started
        </p>
      </div>

      <!-- Table -->
      <div
        v-else
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell"
              >
                Category
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell"
              >
                Store
              </th>
              <th
                class="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Price (MUR)
              </th>
              <th
                class="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell"
              >
                Price range
              </th>
              <th class="px-2 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filtered"
              :key="item.id"
              class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors last:border-0"
            >
              <!-- Product name + unit -->
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ item.name }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">{{ item.unit }}</p>
              </td>

              <!-- Category -->
              <td class="px-4 py-3 hidden md:table-cell">
                <UBadge color="neutral" size="xs" variant="subtle">
                  {{ item.category }}
                </UBadge>
              </td>

              <!-- Store -->
              <td class="px-4 py-3 hidden lg:table-cell">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ sourceName(item.sourceId) }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ sourceDate(item.sourceId) }}
                </p>
              </td>

              <!-- Unit price -->
              <td class="px-4 py-3 text-right">
                <span
                  class="font-mono text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ fmtMur(item.unitMur) }}
                </span>
              </td>

              <!-- Price range across stores -->
              <td class="px-4 py-3 text-right hidden md:table-cell">
                <template v-if="priceRange(item)">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Cheapest indicator -->
                    <UTooltip
                      v-if="item.unitMur === priceRange(item)!.min"
                      text="Cheapest across stores"
                    >
                      <UIcon
                        class="w-3.5 h-3.5 text-teal-500"
                        name="i-lucide-trending-down"
                      />
                    </UTooltip>
                    <!-- Most expensive indicator -->
                    <UTooltip
                      v-else-if="item.unitMur === priceRange(item)!.max"
                      text="Most expensive across stores"
                    >
                      <UIcon
                        class="w-3.5 h-3.5 text-red-400"
                        name="i-lucide-trending-up"
                      />
                    </UTooltip>
                    <span class="text-xs text-gray-400 font-mono">
                      {{ fmtMur(priceRange(item)!.min) }}–{{
                        fmtMur(priceRange(item)!.max)
                      }}
                    </span>
                    <UBadge color="info" size="xs" variant="subtle">
                      {{ priceRange(item)!.count }} stores
                    </UBadge>
                  </div>
                </template>
                <span v-else class="text-xs text-gray-300 dark:text-gray-600"
                  >—</span
                >
              </td>

              <!-- Delete -->
              <td class="px-2 py-3">
                <button
                  class="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
                  title="Remove from library"
                  @click="deleteItem(item.id)"
                >
                  ×
                </button>
              </td>
            </tr>

            <tr v-if="filtered.length === 0 && store.libraryItems.length > 0">
              <td
                class="px-4 py-12 text-center text-sm text-gray-400"
                colspan="6"
              >
                No items match your filters
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer summary -->
    <div
      class="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3 flex items-center justify-between gap-4"
    >
      <div class="flex gap-6 text-xs text-gray-400">
        <span>
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ store.libraryItems.length.toLocaleString() }}
          </span>
          items in library
        </span>
        <span>
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ store.comparableItems.length }}
          </span>
          products comparable across stores
        </span>
      </div>
      <p class="text-xs text-gray-400 hidden md:block">
        Import more brochures via Sources to enable price comparison
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { LibraryItem } from "~/types/grocery";

definePageMeta({ ssr: false });

const store = useGroceryStore();
const { fmtMur } = useGroceryFormatters();

// ── Filters ──────────────────────────────────────────────────
const search = ref("");
const filterCat = ref("All");
const filterStore = ref("All");
const showOnlyComparable = ref(false);

const categories = computed(() => ["All", ...store.libraryCategories]);
const storeNames = computed(() => ["All", ...store.storeNames]);

const filtered = computed(() => {
  let items = store.libraryItems;

  if (filterStore.value !== "All") {
    const srcIds = store.sources
      .filter((s) => s.store === filterStore.value)
      .map((s) => s.id);
    items = items.filter((i) => srcIds.includes(i.sourceId));
  }

  if (filterCat.value !== "All") {
    items = items.filter((i) => i.category === filterCat.value);
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(q));
  }

  if (showOnlyComparable.value) {
    const comparableNames = new Set(
      [...store.itemsByNormalizedName.entries()]
        .filter(([, group]) => group.length > 1)
        .map(([key]) => key),
    );
    items = items.filter((i) => comparableNames.has(i.normalizedName));
  }

  return items;
});

// ── Price range helper ────────────────────────────────────────
function priceRange(
  item: LibraryItem,
): { min: number; max: number; count: number } | null {
  const group = store.itemsByNormalizedName.get(item.normalizedName);
  if (!group || group.length < 2) return null;
  const prices = group.map((i) => i.unitMur);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    count: group.length,
  };
}

function sourceName(sourceId: string): string {
  return store.sources.find((s) => s.id === sourceId)?.store ?? "—";
}

function sourceDate(sourceId: string): string {
  return store.sources.find((s) => s.id === sourceId)?.date ?? "";
}

// ── Delete ────────────────────────────────────────────────────
function deleteItem(id: string) {
  store.deleteLibraryItem(id);
}

// ── Export CSV ────────────────────────────────────────────────
function exportCSV() {
  const rows = [
    ["Name", "Category", "Unit", "Price (MUR)", "Store", "Source date"],
  ];
  for (const item of store.libraryItems) {
    rows.push([
      item.name,
      item.category,
      item.unit,
      item.unitMur.toString(),
      sourceName(item.sourceId),
      sourceDate(item.sourceId),
    ]);
  }
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `panier-library-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
</script>
