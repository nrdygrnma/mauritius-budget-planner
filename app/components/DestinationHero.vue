<template>
  <div v-if="settings.destCountry" class="max-w-7xl mx-auto px-6 pt-8">
    <div
      class="relative w-full overflow-hidden rounded-2xl shadow-md"
      style="height: 220px"
    >
      <!-- Photo or skeleton -->
      <Transition name="fade">
        <img
          v-if="photoUrl"
          :alt="settings.destCountry.name"
          :src="photoUrl"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          v-else
          :class="loading ? 'animate-pulse' : ''"
          class="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700"
        />
      </Transition>

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      <!-- Content -->
      <div
        class="absolute bottom-0 left-0 right-0 px-6 pb-5 flex items-end justify-between"
      >
        <div>
          <p
            class="text-white/60 text-xs font-medium uppercase tracking-widest mb-1"
          >
            Destination
          </p>
          <h2
            class="text-white text-2xl font-bold leading-tight tracking-tight"
          >
            {{ settings.destCountry.flag }} {{ settings.destCountry.name }}
          </h2>
        </div>

        <div class="text-right">
          <p
            class="text-white/60 text-xs font-medium uppercase tracking-widest mb-1"
          >
            From
          </p>
          <p class="text-white text-sm font-semibold">
            {{ settings.originCountry?.flag }}
            {{ settings.originCountry?.name }}
          </p>
          <p class="text-white/50 text-xs mt-0.5">
            {{
              settings.relocationDate.toLocaleString("en-GB", {
                month: "long",
                year: "numeric",
              })
            }}
          </p>
        </div>
      </div>

      <!-- Photo credit -->
      <div class="absolute top-3 right-4">
        <a
          class="text-white/40 text-[10px] hover:text-white/70 transition-colors"
          href="https://unsplash.com"
          rel="noopener"
          target="_blank"
        >
          Photo: Unsplash
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const settings = useSettingsStore();
const { fetchPhotoUrl } = useDestinationPhoto();

const photoUrl = ref<string | null>(null);
const loading = ref(false);

async function loadPhoto() {
  if (!settings.destCountry?.name) return;
  loading.value = true;
  photoUrl.value = null;
  try {
    photoUrl.value = await fetchPhotoUrl(settings.destCountry.name);
  } finally {
    loading.value = false;
  }
}

onMounted(loadPhoto);
watch(() => settings.destCountryCode, loadPhoto);
</script>


<style scoped>
.fade-enter-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>