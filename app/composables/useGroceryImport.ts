import type { LibraryItem } from "~/types/grocery";
import { CATEGORIES } from "~/types/grocery";

type ImportedItem = Omit<LibraryItem, "id" | "normalizedName">;

function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (
    /milk|cheese|yogurt|yaourt|butter|beurre|egg|oeuf|fromage|lait|cream|crème/.test(
      n,
    )
  )
    return "Dairy & eggs";
  if (
    /chicken|poulet|beef|boeuf|fish|poisson|pork|porc|tuna|thon|salmon|saumon|lamb|viande|meat/.test(
      n,
    )
  )
    return "Meat & fish";
  if (
    /vegeta|légume|fruit|tomate|carrot|oignon|salad|banana|pomme|orange|citron/.test(
      n,
    )
  )
    return "Fruits & veg";
  if (
    /flour|farine|sugar|sucre|oil|huile|pasta|pâtes|rice|riz|cereal|biscuit|chocolat|café|coffee|tea|thé|sauce|spice/.test(
      n,
    )
  )
    return "Dry goods";
  if (
    /water|eau|juice|jus|soda|beer|bière|wine|vin|drink|boisson|limonade/.test(
      n,
    )
  )
    return "Drinks";
  if (
    /deterg|lessive|javel|nettoy|vaisselle|toilet|essuie|savon|soap|cleaning/.test(
      n,
    )
  )
    return "Cleaning";
  if (
    /shampoo|deo|déodor|dentifrice|toothpaste|body|gel|lotion|cosmetic|parfum/.test(
      n,
    )
  )
    return "Personal care";
  if (/dog|chien|cat|chat|croquette|animal|pet/.test(n)) return "Pet";
  return "Other";
}

function normaliseCategory(raw: string): string {
  const trimmed = raw.trim();
  const found = CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase(),
  );
  return found ?? guessCategory(trimmed);
}

export function parseCSV(text: string, sourceId: string): ImportedItem[] {
  const lines = text
    .trim()
    .split("\n")
    .filter((l) => l.trim());
  const results: ImportedItem[] = [];

  const firstLine = lines[0] ?? "";
  const firstPrice = firstLine.split(",")[1]?.replace(/"/g, "").trim();
  const looksLikeHeader = isNaN(parseFloat(firstPrice ?? ""));
  const startIdx = looksLikeHeader ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;

    const row = line
      .split(",")
      .map((f) => f.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
    if (row.length < 2) continue;

    const name = row[0]?.trim();
    const price = parseFloat(row[1]?.trim().replace(/[^\d.]/g, "") ?? "");
    if (!name || isNaN(price) || price <= 0) continue;

    results.push({
      name,
      unitMur: price,
      category: row[2] ? normaliseCategory(row[2].trim()) : guessCategory(name),
      unit: row[3]?.trim() || "each",
      sourceId,
    });
  }
  return results;
}

export function parseText(text: string, sourceId: string): ImportedItem[] {
  const lines = text
    .trim()
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"));
  const results: ImportedItem[] = [];

  for (const line of lines) {
    if (line.includes(",")) {
      const parts = line.split(",").map((s) => s.trim());
      const price = parseFloat(parts[1]?.replace(/[^\d.]/g, "") ?? "");
      if (parts[0] && !isNaN(price) && price > 0) {
        results.push({
          name: parts[0],
          unitMur: price,
          category: parts[2]
            ? normaliseCategory(parts[2])
            : guessCategory(parts[0]),
          unit: parts[3] || "each",
          sourceId,
        });
        continue;
      }
    }

    const priceMatch = line.match(/\b(\d+(?:\.\d+)?)\b/);
    if (!priceMatch) continue;
    const price = parseFloat(priceMatch[1] ?? "");
    if (price <= 0) continue;
    const name = line.replace(priceMatch[0], "").replace(/[,;]+/g, " ").trim();
    if (!name) continue;

    results.push({
      name,
      unitMur: price,
      category: guessCategory(name),
      unit: "each",
      sourceId,
    });
  }
  return results;
}

export const useGroceryImport = () => ({ parseCSV, parseText });
