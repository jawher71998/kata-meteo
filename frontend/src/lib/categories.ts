export const CATEGORIES = [
  { id: "temperature", label: "Température" },
  { id: "rain", label: "Pluie" },
  { id: "clouds", label: "Nuages" },
  { id: "wind", label: "Vent" },
  { id: "sunrise", label: "Lever du soleil" },
  { id: "sunset", label: "Coucher du soleil" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const ALL_CATEGORIES: CategoryId[] = CATEGORIES.map((category) => category.id);