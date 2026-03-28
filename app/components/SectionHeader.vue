<template>
  <div class="flex items-center gap-3">
    <div
      v-if="icon"
      class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0"
    >
      <UIcon :name="icon" class="w-4 h-4 text-primary-500" />
    </div>
    <div>
      <p
        class="text-sm font-semibold text-gray-900 dark:text-white leading-tight"
      >
        {{ title }}
      </p>
      <p
        v-if="description"
        class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  icon?: string;
  description?: string;
}>();
</script>