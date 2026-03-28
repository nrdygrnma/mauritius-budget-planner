<template>
  <div
    :class="
      topBorder
        ? 'border-t border-gray-100 dark:border-gray-800 mt-1 pt-2.5'
        : ''
    "
    class="flex items-center justify-between py-1.5 gap-4"
  >
    <div class="flex items-center gap-1.5 min-w-0">
      <span
        :class="
          large
            ? 'font-semibold text-gray-700 dark:text-gray-300'
            : 'text-gray-500 dark:text-gray-400'
        "
        class="text-sm truncate"
      >
        {{ label }}
      </span>
      <InfoTip v-if="tip" :text="tip" />
    </div>
    <span
      :class="[
        large ? 'text-sm font-bold' : 'text-sm font-medium',
        tone === 'positive'
          ? 'text-teal-600 dark:text-teal-400'
          : tone === 'negative'
            ? 'text-red-600 dark:text-red-400'
            : tone === 'strong'
              ? 'text-gray-900 dark:text-white font-bold'
              : 'text-gray-700 dark:text-gray-300',
      ]"
      class="tabular-nums shrink-0"
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
  tip?: string;
}>();
</script>
