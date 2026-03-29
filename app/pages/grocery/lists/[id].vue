<template>
  <div class="flex h-full overflow-hidden">
    <!-- Main list panel -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
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
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ list?.name }}
              </span>
              <UBadge
                v-if="list?.isMonthlyBaseline"
                color="info"
                size="xs"
                variant="subtle"
              >
                Monthly baseline
              </UBadge>
            </div>
            <p v-if="list?.description" class="text-xs text-gray-400">
              {{ list.description }}
            </p>
          </div>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            size="sm"
            @click="showAddPanel = !showAddPanel"
          >
            Add items
          </UButton>
        </div>

        <!-- Empty list state -->
        <div
          v-if="!resolvedItems.length"
          class="py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
        >
          <UIcon
            class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3"
            name="i-lucide-shopping-cart"
          />
          <p class="text-sm text-gray-400">This list is empty</p>
          <p class="text-xs text-gray-400 mt-1">
            Click "Add items" to pick from the price library
          </p>
        </div>

        <!-- Items table -->
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
                  Item
                </th>
                <th
                  class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell"
                >
                  Category
                </th>
                <th
                  class="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell"
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
                  Line total
                </th>
                <th class="px-2 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in resolvedItems"
                :key="item.libraryItemId"
                class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors last:border-0"
              >
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ item.lib.name }}
                  </p>
                  <p class="text-xs text-gray-400">{{ item.lib.unit }}</p>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <UBadge color="neutral" size="xs" variant="subtle">
                    {{ item.lib.category }}
                  </UBadge>
                </td>
                <td class="px-4 py-3 text-right hidden lg:table-cell">
                  <span class="font-mono text-xs text-gray-500">
                    {{ fmtMur(item.cheapest) }}
                  </span>
                  <span
                    v-if="item.lib.unitMur !== item.cheapest"
                    class="text-xs text-teal-500 ml-1"
                  >
                    (cheapest)
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:hover:bg-white dark:hover:text-gray-900 transition-all text-sm leading-none"
                      @click="updateQty(item.libraryItemId, -1)"
                    >
                      −
                    </button>
                    <span class="font-mono text-sm w-5 text-center select-none">
                      {{ item.qty }}
                    </span>
                    <button
                      class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:hover:bg-white dark:hover:text-gray-900 transition-all text-sm leading-none"
                      @click="updateQty(item.libraryItemId, 1)"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <p
                    class="font-mono text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ fmtMur(item.cheapest * item.qty) }}
                  </p>
                  <p class="font-mono text-xs text-gray-400">
                    {{ fmtEur((item.cheapest * item.qty) / store.rate) }}
                  </p>
                </td>
                <td class="px-2 py-3">
                  <button
                    class="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
                    @click="
                      store.removeItemFromList(listId, item.libraryItemId)
                    "
                  >
                    ×
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer summary -->
      <div
        class="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
      >
        <div class="flex gap-8">
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total (MUR)
            </p>
            <p
              class="text-xl font-bold tabular-nums text-gray-900 dark:text-white"
            >
              {{ fmtMur(totalMur) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total (EUR)
            </p>
            <p
              class="text-xl font-bold tabular-nums text-teal-600 dark:text-teal-400"
            >
              {{ fmtEur(totalEur) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Items
            </p>
            <p class="text-xl font-bold tabular-nums">
              {{ resolvedItems.length }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <UButton
            :to="`/grocery/compare/${listId}`"
            color="neutral"
            icon="i-lucide-bar-chart-2"
            size="sm"
            variant="outline"
          >
            Compare prices
          </UButton>
          <UButton
            color="info"
            icon="i-lucide-bookmark"
            size="sm"
            variant="outline"
            @click="saveMonth"
          >
            Save snapshot
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
    </div>

    <!-- Add items slide-in panel -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        v-if="showAddPanel"
        class="w-80 shrink-0 border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col overflow-hidden"
      >
        <!-- Panel header -->
        <div
          class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
        >
          <p class="text-sm font-medium">Add from library</p>
          <button
            class="text-gray-400 hover:text-gray-600 text-lg leading-none"
            @click="showAddPanel = false"
          >
            ×
          </button>
        </div>

        <!-- Search + filter -->
        <div
          class="px-3 py-3 space-y-2 border-b border-gray-100 dark:border-gray-800"
        >
          <UInput
            v-model="addSearch"
            class="w-full"
            icon="i-lucide-search"
            placeholder="Search products…"
            size="sm"
          />
          <div class="flex gap-1 flex-wrap">
            <button
              v-for="cat in addCategories"
              :key="cat"
              :class="
                addFilterCat === cat
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
              "
              class="px-2 py-0.5 rounded-full text-xs transition-all border"
              @click="addFilterCat = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Library items list -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-if="!libraryFiltered.length"
            class="py-10 text-center text-sm text-gray-400"
          >
            No items match
          </div>
          <div
            v-for="item in libraryFiltered"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
            @click="toggleItem(item)"
          >
            <div
              :class="
                inList(item.normalizedName)
                  ? 'bg-teal-500 border-teal-500'
                  : 'border-gray-300 dark:border-gray-600'
              "
              class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
            >
              <UIcon
                v-if="inList(item.normalizedName)"
                class="w-3 h-3 text-white"
                name="i-lucide-check"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-xs font-medium text-gray-900 dark:text-white truncate"
              >
                {{ item.name }}
              </p>
              <p class="text-xs text-gray-400">{{ item.unit }}</p>
            </div>
            <span class="text-xs font-mono text-gray-500 shrink-0">
              {{ fmtMur(item.unitMur) }}
            </span>
          </div>
        </div>

        <!-- Panel footer -->
        <div
          class="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-center"
        >
          {{ list?.items.length ?? 0 }} items in list ·
          {{ libraryFiltered.length }} shown
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import type { LibraryItem } from "~/types/grocery";

definePageMeta({ ssr: false });

const route = useRouter();
const currentRoute = useRoute();
const store = useGroceryStore();
const toast = useToast();
const { fmtMur, fmtEur } = useGroceryFormatters();

const listId = currentRoute.params.id as string;
const list = computed(() => store.lists.find((l) => l.id === listId));

// Redirect if list not found
watchEffect(() => {
  if (!list.value) route.push("/grocery/lists");
});

// ── Resolved list items ───────────────────────────────────────
const resolvedItems = computed(() => {
  if (!list.value) return [];
  return list.value.items
    .map((li) => {
      const lib = store.libraryItems.find((i) => i.id === li.libraryItemId);
      if (!lib) return null;
      const cheapest =
        store.resolvePrice(li.libraryItemId, "cheapest") ?? lib.unitMur;
      return { ...li, lib, cheapest };
    })
    .filter(Boolean) as Array<{
    libraryItemId: string;
    qty: number;
    lib: LibraryItem;
    cheapest: number;
  }>;
});

const totalMur = computed(() =>
  resolvedItems.value.reduce((s, i) => s + i.cheapest * i.qty, 0),
);
const totalEur = computed(() =>
  store.rate > 0 ? totalMur.value / store.rate : 0,
);

// ── Add items from library ────────────────────────────────────
const showAddPanel = ref(false);
const addSearch = ref("");
const addFilterCat = ref("All");

// One representative item per normalizedName for display
// Track which normalizedNames are already in the list
const listNormalizedNames = computed(() => {
  if (!list.value) return new Set<string>();
  return new Set(
    list.value.items
      .map((li) => {
        const lib = store.libraryItems.find((i) => i.id === li.libraryItemId);
        return lib?.normalizedName ?? "";
      })
      .filter(Boolean),
  );
});

const libraryFiltered = computed(() => {
  // Deduplicate by normalizedName — keep cheapest as representative
  const map = new Map<string, (typeof store.libraryItems)[0]>();
  for (const item of store.libraryItems) {
    const existing = map.get(item.normalizedName);
    if (!existing || item.unitMur < existing.unitMur) {
      map.set(item.normalizedName, item);
    }
  }
  let items = [...map.values()];

  if (addFilterCat.value !== "All")
    items = items.filter((i) => i.category === addFilterCat.value);

  if (addSearch.value.trim()) {
    const q = addSearch.value.toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(q));
  }

  return items;
});

const addCategories = computed(() => ["All", ...store.libraryCategories]);

// Check if item is already in this list
function inList(normalizedName: string) {
  return listNormalizedNames.value.has(normalizedName);
}

function toggleItem(item: (typeof store.libraryItems)[0]) {
  if (!list.value) return;
  if (inList(item.normalizedName)) {
    // Find the actual list item to remove
    const toRemove = list.value.items.find((li) => {
      const lib = store.libraryItems.find((i) => i.id === li.libraryItemId);
      return lib?.normalizedName === item.normalizedName;
    });
    if (toRemove) store.removeItemFromList(listId, toRemove.libraryItemId);
  } else {
    store.addItemToList(listId, item.id, 1);
  }
}

function updateQty(libraryItemId: string, delta: number) {
  const item = list.value?.items.find((i) => i.libraryItemId === libraryItemId);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty <= 0) {
    store.removeItemFromList(listId, libraryItemId);
  } else {
    store.updateListItemQty(listId, libraryItemId, newQty);
  }
}

// ── Save snapshot ─────────────────────────────────────────────
function saveMonth() {
  store.saveSnapshot(listId);
  toast.add({
    title: "Snapshot saved",
    description: `${list.value?.name} — ${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}`,
    color: "success",
  });
}

// ── Meridian link ─────────────────────────────────────────────
const budgetStore = useBudgetStore();
function sendToMeridian() {
  const eur = Math.round(totalEur.value);
  budgetStore.groceries = eur;
  toast.add({
    title: "Meridian updated",
    description: `Groceries slider set to €${eur}`,
    color: "success",
  });
}
</script>
