<template>
  <div class="h-full overflow-y-auto p-6">
    <div v-if="!store.sources.length" class="py-24 text-center">
      <UIcon
        class="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4"
        name="i-lucide-file-text"
      />
      <p class="text-gray-500 dark:text-gray-400 font-medium">No sources yet</p>
      <p class="text-sm text-gray-400 mt-1 mb-6">
        Import a CSV brochure to populate the price library
      </p>
      <UButton color="primary" icon="i-lucide-plus" @click="showModal = true">
        Add first source
      </UButton>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <UCard v-for="src in store.sources" :key="src.id" class="relative group">
        <div class="flex items-start justify-between mb-3">
          <div
            class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center"
          >
            <UIcon
              class="w-5 h-5 text-teal-600 dark:text-teal-400"
              name="i-lucide-file-spreadsheet"
            />
          </div>
          <button
            class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 text-lg leading-none"
            title="Delete source and all its items"
            @click="confirmDelete(src.id, src.name)"
          >
            ×
          </button>
        </div>

        <p class="font-medium text-sm text-gray-900 dark:text-white mb-0.5">
          {{ src.name }}
        </p>
        <p class="text-xs text-gray-400 mb-3">
          {{ src.store }} · {{ src.date }}
        </p>

        <div class="flex items-center gap-2 flex-wrap">
          <UBadge color="info" size="xs" variant="subtle">
            {{ itemCount(src.id) }} items
          </UBadge>
          <UBadge
            v-if="itemCount(src.id) === 0"
            color="warning"
            size="xs"
            variant="subtle"
          >
            empty
          </UBadge>
        </div>
      </UCard>

      <!-- Add source card -->
      <div
        class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer min-h-35 transition-all hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/30"
        @click="showModal = true"
      >
        <UIcon class="w-6 h-6 text-gray-400" name="i-lucide-plus-circle" />
        <span class="text-sm text-gray-400">Add source</span>
      </div>
    </div>

    <GroceryAddItemModal v-model:open="showModal" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ ssr: false });

const store = useGroceryStore();
const showModal = ref(false);
const toast = useToast();

function itemCount(sourceId: string) {
  return store.libraryItems.filter((i) => i.sourceId === sourceId).length;
}

function confirmDelete(id: string, name: string) {
  store.deleteSource(id);
  toast.add({
    title: `"${name}" deleted`,
    description:
      "All items from this source have been removed from the library",
    color: "neutral",
  });
}
</script>
