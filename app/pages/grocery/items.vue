<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <!-- Toolbar -->
      <div class="flex items-center gap-3 flex-wrap">
        <UInput
          v-model="search"
          class="w-64"
          icon="i-lucide-search"
          placeholder="Search items…"
          size="sm"
        />
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
      </div>

      <!-- Table -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Item
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell"
              >
                Category
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell"
              >
                Unit price
              </th>
              <th
                class="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Qty / month
              </th>
              <th
                class="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Total
              </th>
              <th class="px-2 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filtered"
              :key="item.id"
              class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors last:border-0"
            >
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ item.name }}
                </p>
                <p class="text-xs text-gray-400">{{ item.unit }}</p>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <UBadge color="neutral" size="xs" variant="subtle">{{
                  item.category
                }}</UBadge>
              </td>
              <td
                class="px-4 py-3 hidden lg:table-cell font-mono text-xs text-gray-500"
              >
                Rs {{ item.unitMur.toLocaleString("en-GB") }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:hover:bg-white dark:hover:text-gray-900 transition-all text-sm leading-none"
                    @click="store.updateQty(item.id, -1)"
                  >
                    −
                  </button>
                  <span class="font-mono text-sm w-5 text-center select-none">{{
                    item.qty
                  }}</span>
                  <button
                    class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:hover:bg-white dark:hover:text-gray-900 transition-all text-sm leading-none"
                    @click="store.updateQty(item.id, 1)"
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <p
                  class="font-mono text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ fmtMur(item.unitMur * item.qty) }}
                </p>
                <p class="font-mono text-xs text-gray-400">
                  {{ fmtEur((item.unitMur * item.qty) / store.rate) }}
                </p>
              </td>
              <td class="px-2 py-3">
                <button
                  class="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
                  title="Remove item"
                  @click="store.deleteItem(item.id)"
                >
                  ×
                </button>
              </td>
            </tr>

            <tr v-if="!filtered.length">
              <td
                class="px-4 py-16 text-center text-sm text-gray-400"
                colspan="6"
              >
                {{
                  store.items.length === 0
                    ? "No items yet — click Add items to get started"
                    : "No items match your search or filter"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sticky footer summary -->
    <div
      class="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
    >
      <div class="flex gap-8">
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Monthly (MUR)
          </p>
          <p
            class="text-xl font-bold tabular-nums text-gray-900 dark:text-white"
          >
            {{ fmtMur(store.totalMur) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Monthly (EUR)
          </p>
          <p
            class="text-xl font-bold tabular-nums text-teal-600 dark:text-teal-400"
          >
            {{ fmtEur(store.totalEur) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Active items
          </p>
          <p class="text-xl font-bold tabular-nums">
            {{ store.activeItems.length }}
          </p>
        </div>
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
          color="primary"
          icon="i-lucide-bookmark"
          size="sm"
          @click="saveMonth"
        >
          Save this month
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ ssr: false });

const store = useGroceryStore();
const { fmtMur, fmtEur } = useGroceryFormatters();
const toast = useToast();

const search = ref("");
const filterCat = ref("All");

const categories = computed(() => [
  "All",
  ...new Set(store.items.map((i) => i.category)),
]);

const filtered = computed(() => {
  let list = store.items;
  if (filterCat.value !== "All")
    list = list.filter((i) => i.category === filterCat.value);
  if (search.value)
    list = list.filter((i) =>
      i.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  return list;
});

function saveMonth() {
  store.saveSnapshot();
  const month = new Date().toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
  toast.add({
    title: "Saved",
    description: `Basket saved for ${month}`,
    color: "success",
  });
}

function exportCSV() {
  const rows = [
    [
      "Name",
      "Category",
      "Unit",
      "Unit price (MUR)",
      "Qty",
      "Total (MUR)",
      "Total (EUR)",
    ],
    ...store.items.map((it) => [
      it.name,
      it.category,
      it.unit,
      it.unitMur.toString(),
      it.qty.toString(),
      Math.round(it.unitMur * it.qty).toString(),
      (Math.round(((it.unitMur * it.qty) / store.rate) * 10) / 10).toString(),
    ]),
    [
      "",
      "",
      "",
      "",
      "TOTAL",
      Math.round(store.totalMur).toString(),
      (Math.round(store.totalEur * 10) / 10).toString(),
    ],
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `panier-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
</script>
