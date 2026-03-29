<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Empty state -->
    <div v-if="!store.lists.length" class="py-24 text-center">
      <UIcon
        class="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4"
        name="i-lucide-list-checks"
      />
      <p class="text-gray-500 dark:text-gray-400 font-medium">
        No shopping lists yet
      </p>
      <p class="text-sm text-gray-400 mt-1 mb-6">
        Create a list to build a basket from the price library
      </p>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        @click="showCreateModal = true"
      >
        Create first list
      </UButton>
    </div>

    <!-- Lists grid -->
    <div v-else class="space-y-4">
      <!-- Baseline callout -->
      <div
        v-if="store.baselineList"
        class="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <UIcon
            class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0"
            name="i-lucide-star"
          />
          <div>
            <p class="text-sm font-medium text-teal-800 dark:text-teal-200">
              Monthly baseline: {{ store.baselineList.name }}
            </p>
            <p class="text-xs text-teal-600 dark:text-teal-400 mt-0.5">
              {{ fmtMur(store.baselineTotalMur) }} ·
              {{ fmtEur(store.baselineTotalEur) }} at cheapest prices
            </p>
          </div>
        </div>
        <UButton
          :to="`/grocery/compare/${store.baselineList.id}`"
          color="info"
          icon="i-lucide-arrow-right"
          size="xs"
          variant="outline"
        >
          View comparison
        </UButton>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <UCard
          v-for="list in store.lists"
          :key="list.id"
          :class="
            list.isMonthlyBaseline
              ? 'ring-2 ring-teal-400 dark:ring-teal-600'
              : ''
          "
          class="relative group"
        >
          <!-- Baseline badge -->
          <div
            v-if="list.isMonthlyBaseline"
            class="absolute -top-2.5 left-4 bg-teal-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium"
          >
            Monthly baseline
          </div>

          <template #header>
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">
                  {{ list.name }}
                </p>
                <p
                  v-if="list.description"
                  class="text-xs text-gray-400 mt-0.5 truncate"
                >
                  {{ list.description }}
                </p>
              </div>
              <!-- Actions menu -->
              <UDropdownMenu
                :items="[
                  [
                    {
                      label: list.isMonthlyBaseline
                        ? 'Remove baseline'
                        : 'Set as monthly baseline',
                      icon: list.isMonthlyBaseline
                        ? 'i-lucide-star-off'
                        : 'i-lucide-star',
                      onSelect: () => toggleBaseline(list),
                    },
                    {
                      label: 'View comparison',
                      icon: 'i-lucide-bar-chart-2',
                      onSelect: () =>
                        router.push(`/grocery/compare/${list.id}`),
                    },
                  ],
                  [
                    {
                      label: 'Delete list',
                      icon: 'i-lucide-trash-2',
                      color: 'error' as const,
                      onSelect: () => deleteList(list.id, list.name),
                    },
                  ],
                ]"
              >
                <UButton
                  color="neutral"
                  icon="i-lucide-more-horizontal"
                  size="xs"
                  variant="ghost"
                />
              </UDropdownMenu>
            </div>
          </template>

          <!-- Stats -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Items</span>
              <span class="font-medium">{{ list.items.length }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400"
                >Total (cheapest)</span
              >
              <div class="text-right">
                <p
                  class="font-mono text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ fmtMur(listTotal(list.id).mur) }}
                </p>
                <p class="font-mono text-xs text-teal-600 dark:text-teal-400">
                  {{ fmtEur(listTotal(list.id).eur) }}
                </p>
              </div>
            </div>
            <div class="text-xs text-gray-400">
              Created
              {{
                new Date(list.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              }}
            </div>
          </div>

          <template #footer>
            <div class="flex gap-2">
              <UButton
                :to="`/grocery/lists/${list.id}`"
                class="flex-1"
                color="neutral"
                icon="i-lucide-pencil"
                size="sm"
                variant="outline"
              >
                Edit list
              </UButton>
              <UButton
                :to="`/grocery/compare/${list.id}`"
                class="flex-1"
                color="primary"
                icon="i-lucide-bar-chart-2"
                size="sm"
              >
                Compare
              </UButton>
            </div>
          </template>
        </UCard>

        <!-- Add card -->
        <div
          class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer min-h-50 transition-all hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/30"
          @click="showCreateModal = true"
        >
          <UIcon class="w-6 h-6 text-gray-400" name="i-lucide-plus-circle" />
          <span class="text-sm text-gray-400">New list</span>
        </div>
      </div>
    </div>

    <!-- Create modal -->
    <UModal
      v-model:open="showCreateModal"
      description="Give your list a name — you can add items from the price library next"
      title="New shopping list"
    >
      <template #content>
        <UCard>
          <template #header>
            <p class="font-semibold text-gray-900 dark:text-white">
              New shopping list
            </p>
          </template>

          <div class="space-y-3">
            <UFormField label="List name">
              <UInput
                v-model="newName"
                class="w-full"
                placeholder="e.g. Monthly staples, Weekly shop"
                @keyup.enter="createList"
              />
            </UFormField>
            <UFormField label="Description (optional)">
              <UInput
                v-model="newDescription"
                class="w-full"
                placeholder="e.g. Core groceries for two people"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                @click="showCreateModal = false"
              >
                Cancel
              </UButton>
              <UButton color="primary" @click="createList">
                Create list
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { ShoppingList } from "~/types/grocery";

definePageMeta({ ssr: false });

const store = useGroceryStore();
const router = useRouter();
const toast = useToast();
const { fmtMur, fmtEur } = useGroceryFormatters();

// ── Create list ───────────────────────────────────────────────
const showCreateModal = ref(false);
const newName = ref("");
const newDescription = ref("");

function createList() {
  if (!newName.value.trim()) {
    toast.add({ title: "Name required", color: "warning" });
    return;
  }
  const id = store.createList(
    newName.value.trim(),
    newDescription.value.trim(),
  );
  toast.add({
    title: "List created",
    description: newName.value.trim(),
    color: "success",
  });
  newName.value = "";
  newDescription.value = "";
  showCreateModal.value = false;
  router.push(`/grocery/lists/${id}`);
}

// ── Delete list ───────────────────────────────────────────────
function deleteList(id: string, name: string) {
  store.deleteList(id);
  toast.add({ title: `"${name}" deleted`, color: "neutral" });
}

// ── Baseline ──────────────────────────────────────────────────
function toggleBaseline(list: ShoppingList) {
  store.setBaselineList(list.isMonthlyBaseline ? null : list.id);
}

// ── Per-list totals ───────────────────────────────────────────
function listTotal(id: string) {
  const mur = store.listTotalMur(id, "cheapest");
  return { mur, eur: store.rate > 0 ? mur / store.rate : 0 };
}
</script>
