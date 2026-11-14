import { useState } from "react";
import type { City } from "./api/types";
import LocationPicker from "./components/LocationPicker";
import WeatherForm from "./components/WeatherForm";
import { toApiPath } from "./lib/weatherQuery";
import type { WeatherQuery } from "./lib/weatherQuery";

export default function App() {
  const [city, setCity] = useState<City | null>(null);
  const [query, setQuery] = useState<WeatherQuery | null>(null);

  function handleCityChange(newCity: City | null) {
    setCity(newCity);
    setQuery(null); // l'ancienne requête ne correspond plus à la ville
  }

  return (
    <main>
      <h1>KATA Météo</h1>
      <LocationPicker onCityChange={handleCityChange} />
      <WeatherForm city={city} onSubmit={setQuery} />
      {query && (
        <p>
          Requête prête : <code>{toApiPath(query)}</code>
        </p>
      )}
    </main>
  );
}