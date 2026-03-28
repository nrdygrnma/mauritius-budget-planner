<template>
  <UTooltip
    :content="{ side: side ?? 'top', sideOffset: 6 }"
    :delay-duration="150"
    :text="text"
  >
    <button
      class="cursor-help inline-flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
      type="button"
    >
      <UIcon class="w-3.5 h-3.5" name="i-lucide-info" />
    </button>
  </UTooltip>
</template>

<script lang="ts" setup>
defineProps<{
  text: string;
  side?: "top" | "bottom" | "left" | "right";
}>();
</script>
