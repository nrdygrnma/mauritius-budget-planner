<template>
  <div class="flex items-center gap-2.5">
    <div
      class="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shrink-0"
    >
      <svg
        fill="none"
        height="18"
        viewBox="0 0 18 18"
        width="18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 2L15.5 13.5H2.5L9 2Z" fill="white" fill-opacity="0.9" />
        <circle cx="9" cy="13" fill="white" fill-opacity="0.6" r="2.5" />
      </svg>
    </div>
    <div class="flex items-baseline gap-1.5">
      <span
        class="text-sm font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Meridian
      </span>
      <span
        class="text-xs text-gray-400 dark:text-gray-500 font-normal hidden sm:block"
      >
        {{ settings.plannerName || "relocation planner" }}
      </span>
    </div>
  </div>
</template>

How it all connects The settings store is the single source of truth for global
configuration. The budget store reads originToUsdRate, destUnitsPerOrigin,
relocationDate, conservativeRate, and optimisticRate from settings rather than
keeping its own copies. When the user changes the destination country on the
settings page, the currency auto-fills; exchange rates update independently. The
planner page sliders for EUR/USD rate and dest currency rate now act as
fine-tuning on top of whatever the settings page established. The plannerName
shows in the logo subtitle so if someone configures "Move to Thailand 2026",
it's always visible in the header as a reminder of which plan they're working
on.

<script lang="ts" setup>
const settings = useSettingsStore();
</script>
