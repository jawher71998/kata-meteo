import { useEffect, useRef, useState } from "react";
import { getCitiesByCountry, getCountries } from "../api/client";
import type { City, Country } from "../api/types";

interface LocationPickerProps {
  onCityChange: (city: City | null) => void;
}

export default function LocationPicker({ onCityChange }: LocationPickerProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retient le dernier pays demandé, pour ignorer les réponses devenues périmées
  const latestCountryRequest = useRef("");

  useEffect(() => {
    let cancelled = false;

    getCountries()
      .then((data) => {
        if (!cancelled) setCountries(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingCountries(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleCountryChange(value: string) {
    setCountryId(value);
    setCityId("");
    setCities([]);
    setError(null);
    setLoadingCities(value !== "");
    onCityChange(null);
    latestCountryRequest.current = value;

    if (value === "") return;

    getCitiesByCountry(Number(value))
      .then((data) => {
        if (latestCountryRequest.current === value) setCities(data);
      })
      .catch((err: Error) => {
        if (latestCountryRequest.current === value) setError(err.message);
      })
      .finally(() => {
        if (latestCountryRequest.current === value) setLoadingCities(false);
      });
  }

  function handleCityChange(value: string) {
    setCityId(value);
    onCityChange(cities.find((city) => String(city.id) === value) ?? null);
  }

  return (
    <section aria-label="Choix du lieu">
      <div>
        <label htmlFor="country">Pays</label>
        <select
          id="country"
          value={countryId}
          onChange={(event) => handleCountryChange(event.target.value)}
          disabled={loadingCountries || countries.length === 0}
        >
          <option value="">{loadingCountries ? "Chargement…" : "Choisir un pays"}</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city">Ville</label>
        <select
          id="city"
          value={cityId}
          onChange={(event) => handleCityChange(event.target.value)}
          disabled={countryId === "" || loadingCities}
        >
          <option value="">
            {countryId === ""
              ? "Choisissez d'abord un pays"
              : loadingCities
                ? "Chargement…"
                : "Choisir une ville"}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p role="alert">{error}</p>}
    </section>
  );
}