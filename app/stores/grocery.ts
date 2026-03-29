import { defineStore } from "pinia";
import type {
  GrocerySnapshot,
  GrocerySource,
  LibraryItem,
  ShoppingList,
} from "~/types/grocery";

export const useGroceryStore = defineStore(
  "grocery",
  () => {
    // ── State ──────────────────────────────────────────────────
    const rate = ref(54);
    const libraryItems = ref<LibraryItem[]>([]);
    const sources = ref<GrocerySource[]>([]);
    const lists = ref<ShoppingList[]>([]);
    const history = ref<GrocerySnapshot[]>([]);
    const categoryTotalsFromLibrary = computed(() => {
      const counts: Record<string, number> = {};
      for (const item of libraryItems.value) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => ({ category, count }));
    });

    // ── Library computed ────────────────────────────────────────

    /** All unique store names from sources */
    const storeNames = computed(() =>
      [...new Set(sources.value.map((s) => s.store))].sort(),
    );

    /** All unique categories in the library */
    const libraryCategories = computed(() =>
      [...new Set(libraryItems.value.map((i) => i.category))].sort(),
    );

    /**
     * Groups library items by normalizedName so the same product
     * across multiple stores can be compared.
     * Returns a map: normalizedName → LibraryItem[]
     */
    const itemsByNormalizedName = computed(() => {
      const map = new Map<string, LibraryItem[]>();
      for (const item of libraryItems.value) {
        const key = item.normalizedName;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(item);
      }
      return map;
    });

    /** Items that appear in more than one source (comparable) */
    const comparableItems = computed(() => {
      const result: LibraryItem[][] = [];
      for (const group of itemsByNormalizedName.value.values()) {
        if (group.length > 1) result.push(group);
      }
      return result;
    });

    // ── Shopping list computed ──────────────────────────────────

    /** The list flagged as monthly baseline, if any */
    const baselineList = computed(
      () => lists.value.find((l) => l.isMonthlyBaseline) ?? null,
    );

    /** Total MUR for the baseline list at cheapest available prices */
    const baselineTotalMur = computed(() => {
      if (!baselineList.value) return 0;
      return listTotalMur(baselineList.value.id, "cheapest");
    });

    const baselineTotalEur = computed(() =>
      rate.value > 0 ? baselineTotalMur.value / rate.value : 0,
    );

    // ── Library actions ─────────────────────────────────────────

    function addLibraryItem(item: Omit<LibraryItem, "id" | "normalizedName">) {
      libraryItems.value.push({
        ...item,
        id: crypto.randomUUID(),
        normalizedName: normalise(item.name),
      });
    }

    function addLibraryItems(
      items: Omit<LibraryItem, "id" | "normalizedName">[],
    ) {
      for (const item of items) {
        libraryItems.value.push({
          ...item,
          id: crypto.randomUUID(),
          normalizedName: normalise(item.name),
        });
      }
    }

    function deleteLibraryItem(id: string) {
      libraryItems.value = libraryItems.value.filter((i) => i.id !== id);
      // Remove from any lists too
      for (const list of lists.value) {
        list.items = list.items.filter((i) => i.libraryItemId !== id);
      }
    }

    function deleteLibraryItemsBySource(sourceId: string) {
      const removedIds = new Set(
        libraryItems.value
          .filter((i) => i.sourceId === sourceId)
          .map((i) => i.id),
      );
      libraryItems.value = libraryItems.value.filter(
        (i) => i.sourceId !== sourceId,
      );
      for (const list of lists.value) {
        list.items = list.items.filter((i) => !removedIds.has(i.libraryItemId));
      }
    }

    // ── Source actions ──────────────────────────────────────────

    function addSource(source: Omit<GrocerySource, "id">): string {
      const id = crypto.randomUUID();
      sources.value.push({ ...source, id });
      return id;
    }

    function deleteSource(id: string) {
      sources.value = sources.value.filter((s) => s.id !== id);
      deleteLibraryItemsBySource(id);
    }

    // ── Shopping list actions ───────────────────────────────────

    function createList(name: string, description = ""): string {
      const id = crypto.randomUUID();
      lists.value.push({
        id,
        name,
        description,
        isMonthlyBaseline: false,
        items: [],
        createdAt: new Date().toISOString(),
      });
      return id;
    }

    function deleteList(id: string) {
      lists.value = lists.value.filter((l) => l.id !== id);
    }

    function renameList(id: string, name: string, description?: string) {
      const list = lists.value.find((l) => l.id === id);
      if (!list) return;
      list.name = name;
      if (description !== undefined) list.description = description;
    }

    function setBaselineList(id: string | null) {
      for (const list of lists.value) {
        list.isMonthlyBaseline = list.id === id;
      }
    }

    function addItemToList(listId: string, libraryItemId: string, qty = 1) {
      const list = lists.value.find((l) => l.id === listId);
      if (!list) return;
      const existing = list.items.find(
        (i) => i.libraryItemId === libraryItemId,
      );
      if (existing) {
        existing.qty += qty;
      } else {
        list.items.push({ libraryItemId, qty });
      }
    }

    function removeItemFromList(listId: string, libraryItemId: string) {
      const list = lists.value.find((l) => l.id === listId);
      if (!list) return;
      list.items = list.items.filter((i) => i.libraryItemId !== libraryItemId);
    }

    function updateListItemQty(
      listId: string,
      libraryItemId: string,
      qty: number,
    ) {
      const list = lists.value.find((l) => l.id === listId);
      if (!list) return;
      const item = list.items.find((i) => i.libraryItemId === libraryItemId);
      if (item) item.qty = Math.max(0, qty);
    }

    // ── Price comparison helpers ────────────────────────────────

    /**
     * For a given list, returns the total MUR cost.
     * mode:
     *   'cheapest'  — use the cheapest available price per item
     *   sourceId    — use prices from a specific source only
     */
    function listTotalMur(listId: string, mode: "cheapest" | string): number {
      const list = lists.value.find((l) => l.id === listId);
      if (!list) return 0;
      let total = 0;
      for (const listItem of list.items) {
        const price = resolvePrice(listItem.libraryItemId, mode);
        if (price !== null) total += price * listItem.qty;
      }
      return total;
    }

    /**
     * For a given list, returns a comparison table across all sources.
     * Returns rows with per-source prices and the cheapest option.
     */
    function listComparison(listId: string): ComparisonRow[] {
      const list = lists.value.find((l) => l.id === listId);
      if (!list) return [];

      const rows: ComparisonRow[] = [];

      for (const listItem of list.items) {
        const baseItem = libraryItems.value.find(
          (i) => i.id === listItem.libraryItemId,
        );
        if (!baseItem) continue;

        // Find all library items with the same normalizedName
        const matches = itemsByNormalizedName.value.get(
          baseItem.normalizedName,
        ) ?? [baseItem];

        // Build per-source price map
        const pricesBySource: Record<
          string,
          { price: number; itemId: string }
        > = {};
        for (const match of matches) {
          const src = sources.value.find((s) => s.id === match.sourceId);
          if (src) {
            // If multiple items from same source match, take the cheapest
            if (
              !pricesBySource[match.sourceId] ||
              match.unitMur < pricesBySource[match.sourceId]!.price
            ) {
              pricesBySource[match.sourceId] = {
                price: match.unitMur,
                itemId: match.id,
              };
            }
          }
        }

        const allPrices = Object.values(pricesBySource).map((p) => p.price);
        const cheapestPrice = allPrices.length ? Math.min(...allPrices) : null;
        const cheapestSourceId =
          cheapestPrice !== null
            ? (Object.entries(pricesBySource).find(
                ([, v]) => v.price === cheapestPrice,
              )?.[0] ?? null)
            : null;

        rows.push({
          libraryItemId: listItem.libraryItemId,
          name: baseItem.name,
          normalizedName: baseItem.normalizedName,
          category: baseItem.category,
          unit: baseItem.unit,
          qty: listItem.qty,
          pricesBySource,
          cheapestPrice,
          cheapestSourceId,
        });
      }

      return rows;
    }

    /**
     * Resolves the price for a library item given a mode.
     * Returns null if no price available.
     */
    function resolvePrice(
      libraryItemId: string,
      mode: "cheapest" | string,
    ): number | null {
      const baseItem = libraryItems.value.find((i) => i.id === libraryItemId);
      if (!baseItem) return null;

      if (mode === "cheapest") {
        const matches = itemsByNormalizedName.value.get(
          baseItem.normalizedName,
        ) ?? [baseItem];
        const prices = matches.map((m) => m.unitMur).filter((p) => p > 0);
        return prices.length ? Math.min(...prices) : null;
      }

      // mode is a sourceId — find matching item from that source
      const matches = itemsByNormalizedName.value.get(
        baseItem.normalizedName,
      ) ?? [baseItem];
      const fromSource = matches.filter((m) => m.sourceId === mode);
      if (!fromSource.length) return null;
      return Math.min(...fromSource.map((m) => m.unitMur));
    }

    // ── History ─────────────────────────────────────────────────

    function saveSnapshot(listId?: string) {
      const month = new Date().toLocaleString("en-GB", {
        month: "long",
        year: "numeric",
      });
      const totalMur = listId
        ? listTotalMur(listId, "cheapest")
        : baselineTotalMur.value;
      const list = listId
        ? lists.value.find((l) => l.id === listId)
        : baselineList.value;

      const snapshot: GrocerySnapshot = {
        id: crypto.randomUUID(),
        month,
        listName: list?.name ?? "Basket",
        totalMur,
        totalEur: rate.value > 0 ? totalMur / rate.value : 0,
        rate: rate.value,
        itemCount: list?.items.length ?? 0,
        savedAt: new Date().toISOString(),
      };
      const existing = history.value.findIndex(
        (h) => h.month === month && h.listName === snapshot.listName,
      );
      if (existing >= 0) history.value[existing] = snapshot;
      else history.value.push(snapshot);
    }

    function deleteSnapshot(id: string) {
      history.value = history.value.filter((h) => h.id !== id);
    }

    return {
      // State
      rate,
      libraryItems,
      sources,
      lists,
      history,
      // Library computed
      categoryTotalsFromLibrary,
      storeNames,
      libraryCategories,
      itemsByNormalizedName,
      comparableItems,
      // List computed
      baselineList,
      baselineTotalMur,
      baselineTotalEur,
      // Library actions
      addLibraryItem,
      addLibraryItems,
      deleteLibraryItem,
      deleteLibraryItemsBySource,
      // Source actions
      addSource,
      deleteSource,
      // List actions
      createList,
      deleteList,
      renameList,
      setBaselineList,
      addItemToList,
      removeItemFromList,
      updateListItemQty,
      // Helpers
      listTotalMur,
      listComparison,
      resolvePrice,
      // History
      saveSnapshot,
      deleteSnapshot,
    };
  },
  {
    persist: { key: "panier-v2" },
  },
);

// ── Types used internally ────────────────────────────────────

export interface ComparisonRow {
  libraryItemId: string;
  name: string;
  normalizedName: string;
  category: string;
  unit: string;
  qty: number;
  pricesBySource: Record<string, { price: number; itemId: string }>;
  cheapestPrice: number | null;
  cheapestSourceId: string | null;
}

// ── Normalisation helper ─────────────────────────────────────

export function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
