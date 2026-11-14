import { useState } from "react";
import type { City } from "./api/types";
import LocationPicker from "./components/LocationPicker";

export default function App() {
  const [city, setCity] = useState<City | null>(null);

  return (
    <main>
      <h1>KATA Météo</h1>
      <LocationPicker onCityChange={setCity} />
      {city ? (
        <p>
          Ville sélectionnée : {city.name} (latitude {city.latitude}, longitude {city.longitude})
        </p>
      ) : (
        <p>Sélectionnez un pays puis une ville.</p>
      )}
    </main>
  );
}