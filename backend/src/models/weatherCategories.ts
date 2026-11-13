export const CATEGORIES = [
  "temperature",
  "condition",
  "rain",
  "clouds",
  "wind",
  "sunrise",
  "sunset",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Clés de la réponse JSON associées à chaque catégorie (tous modes confondus)
export const CATEGORY_KEYS: Record<Category, string[]> = {
  temperature: ["temperature", "temperatureMax", "temperatureMin"],
  condition: ["weatherCode", "condition"],
  rain: ["precipitation", "precipitationProbability"],
  clouds: ["cloudCover"],
  wind: ["windSpeed"],
  sunrise: ["sunrise"],
  sunset: ["sunset"],
};