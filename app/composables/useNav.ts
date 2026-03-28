export const useNav = () => {
  const route = useRoute();

  const items = [
    { label: "Planner", icon: "i-lucide-sliders-horizontal", to: "/" },
    { label: "Settings", icon: "i-lucide-settings", to: "/settings" },
    { label: "Docs", icon: "i-lucide-book-open", to: "/docs" },
  ];

  const isActive = (to: string) =>
    to === "/" ? route.path === "/" : route.path.startsWith(to);

  return { items, isActive };
};
