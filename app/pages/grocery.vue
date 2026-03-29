<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <aside
      class="w-52 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col"
    >
      <div class="px-5 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div class="font-serif text-2xl tracking-tight">Panier</div>
        <div class="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">
          Grocery tracker
        </div>
      </div>

      <nav class="flex-1 px-2.5 py-3 space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :class="
            (
              item.exact
                ? route.path === item.to
                : route.path.startsWith(item.to)
            )
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
          "
          :to="item.to"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
        >
          <UIcon :name="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div
        class="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3"
      >
        <div class="bg-teal-50 dark:bg-teal-950 rounded-lg p-3">
          <p
            class="text-xs text-teal-700 dark:text-teal-400 font-medium uppercase tracking-wider mb-2"
          >
            EUR / MUR
          </p>
          <div class="flex items-center gap-1.5">
            <UInputNumber
              v-model="store.rate"
              :format-options="{
                useGrouping: false,
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }"
              :max="200"
              :min="1"
              :step="0.5"
              class="flex-1"
              size="xs"
            />
            <span class="text-xs text-teal-600 dark:text-teal-400">MUR/€</span>
          </div>
        </div>
        <UButton
          class="w-full justify-start"
          color="neutral"
          icon="i-lucide-arrow-left"
          size="xs"
          to="/"
          variant="ghost"
        >
          Back to Meridian
        </UButton>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header
        class="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0"
      >
        <h1 class="text-sm font-medium">{{ pageTitle }}</h1>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          size="sm"
          @click="showModal = true"
        >
          Add items
        </UButton>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-hidden">
        <NuxtPage />
      </main>
    </div>

    <GroceryAddItemModal v-model:open="showModal" />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Panier — Grocery Tracker" });
definePageMeta({ ssr: false });

const store = useGroceryStore();
const route = useRoute();
const showModal = ref(false);

const navItems = [
  {
    label: "Dashboard",
    to: "/grocery",
    icon: "i-lucide-layout-dashboard",
    exact: true,
  },
  { label: "Price library", to: "/grocery/library", icon: "i-lucide-library" },
  { label: "Lists", to: "/grocery/lists", icon: "i-lucide-list-checks" },
  { label: "Sources", to: "/grocery/sources", icon: "i-lucide-file-text" },
  { label: "History", to: "/grocery/history", icon: "i-lucide-clock" },
];

const pageTitle = computed(() => {
  if (route.path === "/grocery") return "Dashboard";
  if (route.path.startsWith("/grocery/library")) return "Price library";
  if (route.path.startsWith("/grocery/lists")) return "Shopping lists";
  if (route.path.startsWith("/grocery/compare")) return "Price comparison";
  if (route.path.startsWith("/grocery/sources")) return "Sources";
  if (route.path.startsWith("/grocery/history")) return "History";
  return "Panier";
});
</script>
