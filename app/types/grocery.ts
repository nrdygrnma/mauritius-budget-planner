export interface LibraryItem {
  id: string;
  name: string;
  normalizedName: string; // auto-generated on import
  category: string;
  unit: string;
  unitMur: number;
  sourceId: string;
}

export interface GrocerySource {
  id: string;
  name: string;
  store: string;
  date: string;
  itemCount: number;
}

export interface ShoppingListItem {
  libraryItemId: string;
  qty: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  description: string;
  isMonthlyBaseline: boolean;
  items: ShoppingListItem[];
  createdAt: string;
}

export interface GrocerySnapshot {
  id: string;
  month: string;
  listName: string;
  totalMur: number;
  totalEur: number;
  rate: number;
  itemCount: number;
  savedAt: string;
}

export const CATEGORIES = [
  "Dairy & eggs",
  "Meat & fish",
  "Fruits & veg",
  "Dry goods",
  "Drinks",
  "Cleaning",
  "Personal care",
  "Pet",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Dairy & eggs": "sky",
  "Meat & fish": "red",
  "Fruits & veg": "green",
  "Dry goods": "amber",
  Drinks: "teal",
  Cleaning: "violet",
  "Personal care": "pink",
  Pet: "orange",
  Other: "neutral",
};
