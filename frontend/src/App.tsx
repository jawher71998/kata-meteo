import { useState } from "react";
import type { City } from "./api/types";
import LocationPicker from "./components/LocationPicker";
import WeatherForm from "./components/WeatherForm";
import WeatherResults from "./components/WeatherResults";
import { useWeather } from "./hooks/useWeather";
import { ALL_CATEGORIES } from "./lib/categories";
import type { CategoryId } from "./lib/categories";
import type { WeatherQuery } from "./lib/weatherQuery";

export default function App() {
  const [city, setCity] = useState<City | null>(null);
  const [query, setQuery] = useState<WeatherQuery | null>(null);
  const [categories, setCategories] = useState<CategoryId[]>(ALL_CATEGORIES);
  const weather = useWeather(query);

  function handleCityChange(newCity: City | null) {
    setCity(newCity);
    setQuery(null); // changer de ville efface les résultats précédents
  }

  return (
    <main>
      <h1>KATA Météo</h1>
      <LocationPicker onCityChange={handleCityChange} />
      <WeatherForm city={city} onSubmit={setQuery} />
      <WeatherResults
        state={weather}
        categories={categories}
        onCategoriesChange={setCategories}
      />
    </main>
  );
}