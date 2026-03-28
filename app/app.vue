<template>
  <UApp>
    <header
      class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 h-(--ui-header-height)"
    >
      <div
        class="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4"
      >
        <NuxtLink class="shrink-0" to="/">
          <AppLogo />
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-1">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :color="route.path === item.to ? 'primary' : 'neutral'"
            :icon="item.icon"
            :label="item.label"
            :to="item.to"
            :variant="route.path === item.to ? 'soft' : 'ghost'"
            size="sm"
          />
        </nav>

        <div class="flex items-center gap-2">
          <UColorModeButton color="neutral" size="sm" variant="ghost" />
          <button
            :aria-expanded="mobileMenuOpen"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            class="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <UIcon
              :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1"
      >
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :color="route.path === item.to ? 'primary' : 'neutral'"
          :icon="item.icon"
          :label="item.label"
          :to="item.to"
          :variant="route.path === item.to ? 'soft' : 'ghost'"
          class="w-full justify-start"
          size="sm"
          @click="mobileMenuOpen = false"
        />
      </div>
    </header>

    <NuxtPage />
  </UApp>
</template>

<script lang="ts" setup>
const route = useRoute();
const mobileMenuOpen = ref(false);

const navItems = [
  {
    label: "Planner",
    icon: "i-lucide-sliders-horizontal",
    to: "/",
  },
  {
    label: "Docs",
    icon: "i-lucide-book-open",
    to: "/docs",
  },
];

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  },
);
</script>
