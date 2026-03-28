// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  runtimeConfig: {
    public: {
      unsplashAccessKey: "",
    },
  },
  css: ["~/assets/css/main.css"],
  ui: {
    theme: {
      colors: ["primary", "success", "warning", "error", "info"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "date-fns",
        "vue-chartjs",
        "chart.js",
        "chartjs-plugin-annotation",
      ],
    },
  },
});
