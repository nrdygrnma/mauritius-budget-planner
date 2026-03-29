<template>
  <div class="h-full overflow-y-auto p-6">
    <div v-if="!store.history.length" class="py-24 text-center">
      <UIcon
        class="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4"
        name="i-lucide-calendar"
      />
      <p class="text-gray-500 dark:text-gray-400 font-medium">
        No monthly snapshots yet
      </p>
      <p class="text-sm text-gray-400 mt-1">
        Open a shopping list and click "Save snapshot" to track spending over
        time
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="snap in [...store.history].reverse()"
        :key="snap.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between gap-4"
      >
        <div>
          <p class="font-bold text-lg text-gray-900 dark:text-white">
            {{ snap.month }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ snap.listName }} · {{ snap.itemCount }} items · rate
            {{ snap.rate }} MUR/€ · saved {{ fmtDate(snap.savedAt) }}
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <p
              class="font-mono text-base font-medium text-gray-900 dark:text-white"
            >
              {{ fmtMur(snap.totalMur) }}
            </p>
            <p class="font-mono text-sm text-teal-600 dark:text-teal-400">
              {{ fmtEur(snap.totalEur) }}
            </p>
          </div>
          <button
            class="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
            title="Delete snapshot"
            @click="deleteSnapshot(snap.id)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ ssr: false });

const store = useGroceryStore();
const { fmtMur, fmtEur, fmtDate } = useGroceryFormatters();
const toast = useToast();

function deleteSnapshot(id: string) {
  store.deleteSnapshot(id);
  toast.add({ title: "Snapshot deleted", color: "neutral" });
}
</script>
