import type { WeatherState } from "../hooks/useWeather";
import WeatherCard from "./WeatherCard";

interface WeatherResultsProps {
  state: WeatherState;
}

export default function WeatherResults({ state }: WeatherResultsProps) {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return <p role="status">Chargement de la météo…</p>;
    case "error":
      return <p role="alert">{state.message}</p>;
    case "success":
      return (
        <section aria-label="Résultats météo">
          <h2>
            {state.data.cityName} ({state.data.countryName})
          </h2>
          <div className="weather-grid">
            {state.data.items.map((item) => (
              <WeatherCard key={item.id} item={item} units={state.data.units} />
            ))}
          </div>
        </section>
      );
  }
}