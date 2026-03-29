<template>
  <div class="h-full overflow-y-auto p-6 space-y-6">
    <!-- Metrics -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <UCard
        class="bg-gray-900! dark:bg-gray-950! border-gray-900 dark:border-gray-900"
      >
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Baseline monthly
        </p>
        <p class="text-3xl font-bold text-white tracking-tight">
          {{
            store.baselineTotalEur > 0 ? fmtEur(store.baselineTotalEur) : "—"
          }}
        </p>
        <p class="text-xs text-gray-600 mt-1">
          {{
            store.baselineTotalMur > 0
              ? fmtMur(store.baselineTotalMur)
              : "No baseline list set"
          }}
        </p>
      </UCard>

      <UCard>
        <p
          class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"
        >
          Library items
        </p>
        <p class="text-3xl font-bold tracking-tight">
          {{ store.libraryItems.length.toLocaleString() }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          across {{ store.sources.length }} sources
        </p>
      </UCard>

      <UCard>
        <p
          class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"
        >
          Shopping lists
        </p>
        <p class="text-3xl font-bold tracking-tight">
          {{ store.lists.length }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          {{
            store.lists.filter((l) => l.isMonthlyBaseline).length > 0
              ? "1 baseline set"
              : "No baseline set"
          }}
        </p>
      </UCard>

      <UCard>
        <p
          class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"
        >
          Comparable products
        </p>
        <p
          class="text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400"
        >
          {{ store.comparableItems.length }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          across {{ store.storeNames.length }} stores
        </p>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Category breakdown from library -->
      <UCard>
        <template #header>
          <p class="text-sm font-medium">Library by category</p>
        </template>
        <div v-if="store.libraryItems.length" class="space-y-3">
          <div
            v-for="cat in store.categoryTotalsFromLibrary"
            :key="cat.category"
            class="flex items-center gap-3"
          >
            <span
              class="text-sm text-gray-500 dark:text-gray-400 w-28 shrink-0 truncate"
            >
              {{ cat.category }}
            </span>
            <div
              class="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                :style="{
                  width: `${Math.round((cat.count / store.libraryItems.length) * 100)}%`,
                }"
                class="h-full rounded-full bg-teal-500 transition-all duration-500"
              />
            </div>
            <span
              class="text-xs font-mono text-gray-500 w-10 text-right shrink-0"
            >
              {{ cat.count }}
            </span>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-gray-400">No items in library yet</p>
          <UButton
            class="mt-2"
            color="primary"
            size="xs"
            to="/grocery/sources"
            variant="ghost"
          >
            Import a source
          </UButton>
        </div>
      </UCard>

      <!-- Shopping lists summary -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium">Shopping lists</p>
            <UButton
              color="neutral"
              size="xs"
              to="/grocery/lists"
              variant="ghost"
            >
              View all
            </UButton>
          </div>
        </template>
        <div v-if="store.lists.length" class="space-y-2">
          <div
            v-for="list in store.lists.slice(0, 5)"
            :key="list.id"
            class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="$router.push(`/grocery/lists/${list.id}`)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <UIcon
                v-if="list.isMonthlyBaseline"
                class="w-3.5 h-3.5 text-teal-500 shrink-0"
                name="i-lucide-star"
              />
              <span class="text-sm truncate text-gray-800 dark:text-gray-200">{{
                list.name
              }}</span>
              <UBadge
                v-if="list.isMonthlyBaseline"
                color="info"
                size="xs"
                variant="subtle"
              >
                baseline
              </UBadge>
            </div>
            <div class="text-right shrink-0 ml-3">
              <p class="text-xs font-mono text-gray-500">
                {{ list.items.length }} items
              </p>
              <p class="text-xs font-mono text-teal-600 dark:text-teal-400">
                {{
                  fmtEur(store.listTotalMur(list.id, "cheapest") / store.rate)
                }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-gray-400">No lists yet</p>
          <UButton
            class="mt-2"
            color="primary"
            size="xs"
            to="/grocery/lists"
            variant="ghost"
          >
            Create a list
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- History -->
    <UCard v-if="store.history.length">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">Recent snapshots</p>
          <UButton
            color="neutral"
            size="xs"
            to="/grocery/history"
            variant="ghost"
          >
            View all
          </UButton>
        </div>
      </template>
      <div class="space-y-2">
        <div
          v-for="snap in [...store.history].reverse().slice(0, 4)"
          :key="snap.id"
          class="flex items-center justify-between py-2 px-2 rounded-lg"
        >
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ snap.month }}
            </p>
            <p class="text-xs text-gray-400">
              {{ snap.listName }} · {{ snap.itemCount }} items
            </p>
          </div>
          <div class="text-right">
            <p class="font-mono text-sm font-medium">
              {{ fmtMur(snap.totalMur) }}
            </p>
            <p class="font-mono text-xs text-teal-600 dark:text-teal-400">
              {{ fmtEur(snap.totalEur) }}
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ ssr: false });

const store = useGroceryStore();
const { fmtMur, fmtEur } = useGroceryFormatters();
</script>
