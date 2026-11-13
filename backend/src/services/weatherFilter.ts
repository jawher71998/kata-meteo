import { CATEGORY_KEYS, Category } from "../models/weatherCategories";

// Retire de la réponse les clés des catégories non demandées.
// Les clés de structure (city, date, available...) ne sont jamais retirées.
export function filterByCategories(data: unknown, categories: Category[]): unknown {
  const allowed = new Set<string>(categories.flatMap((category) => CATEGORY_KEYS[category]));
  const filterable = new Set<string>(Object.values(CATEGORY_KEYS).flat());

  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);

    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !filterable.has(key) || allowed.has(key))
          .map(([key, inner]) => [key, walk(inner)])
      );
    }

    return value;
  };

  return walk(data);
}