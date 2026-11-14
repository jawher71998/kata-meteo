import type { WeatherState } from "../hooks/useWeather";
import type { CategoryId } from "../lib/categories";
import CategoryFilter from "./CategoryFilter";
import WeatherCard from "./WeatherCard";

interface WeatherResultsProps {
  state: WeatherState;
  categories: CategoryId[];
  onCategoriesChange: (categories: CategoryId[]) => void;
}

export default function WeatherResults({
  state,
  categories,
  onCategoriesChange,
}: WeatherResultsProps) {
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
          <CategoryFilter selected={categories} onChange={onCategoriesChange} />
          {categories.length === 0 ? (
            <p role="alert">Sélectionnez au moins une donnée à afficher.</p>
          ) : (
            <div className="weather-grid">
              {state.data.items.map((item) => (
                <WeatherCard
                  key={item.id}
                  item={item}
                  units={state.data.units}
                  categories={categories}
                />
              ))}
            </div>
          )}
        </section>
      );
  }
}