export default defineAppConfig({
  ui: {
    colors: {
      primary: "teal",
      neutral: "slate",
    },
    card: {
      slots: {
        root: "rounded-md",
        header: "px-6 py-5",
        body: "px-6 py-5",
        footer: "px-6 py-4",
      },
    },
  },
});
