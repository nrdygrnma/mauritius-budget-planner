<template>
  <div
    :class="
      topBorder ? 'border-t border-gray-100 dark:border-gray-800 mt-1' : ''
    "
    class="flex items-baseline justify-between gap-4 py-2"
  >
    <span
      :class="large ? 'text-sm font-medium' : 'text-sm'"
      class="text-gray-500 dark:text-gray-400"
    >
      {{ label }}
    </span>
    <span
      :class="[
        large ? 'text-base' : 'text-sm',
        tone === 'positive'
          ? 'text-teal-600 dark:text-teal-400'
          : tone === 'negative'
            ? 'text-red-500 dark:text-red-400'
            : tone === 'strong'
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400',
      ]"
      class="tabular-nums font-semibold shrink-0"
    >
      {{ value }}
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral" | "strong";
  large?: boolean;
  topBorder?: boolean;
}>();
</script>
