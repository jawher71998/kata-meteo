import { weatherIcon } from "../lib/weatherIcons";
import type { DisplayUnits, WeatherItem } from "../lib/weatherResult";

interface WeatherCardProps {
  item: WeatherItem;
  units: DisplayUnits;
}

// Une donnée absente s'affiche "Non disponible", jamais 0
function show(value: number | string | null | undefined, unit = ""): string {
  if (value === null || value === undefined) return "Non disponible";
  return unit ? `${value} ${unit}` : String(value);
}

export default function WeatherCard({ item, units }: WeatherCardProps) {
  if (!item.available) {
    return (
      <article className="weather-card">
        <h3>{item.title}</h3>
        <p>{item.message ?? "Aucune donnée météo disponible."}</p>
      </article>
    );
  }

  const condition = item.condition ?? "Condition inconnue";
  const rows: { label: string; value: string }[] = [];

  if (item.temperature !== undefined) {
    rows.push({ label: "Température", value: show(item.temperature, units.temperature) });
  }
  if (item.temperatureMax !== undefined) {
    rows.push({ label: "Température max", value: show(item.temperatureMax, units.temperature) });
  }
  if (item.temperatureMin !== undefined) {
    rows.push({ label: "Température min", value: show(item.temperatureMin, units.temperature) });
  }
  rows.push({ label: "Pluie", value: show(item.precipitation, units.precipitation) });
  if (item.precipitationProbability !== undefined) {
    rows.push({
      label: "Probabilité de pluie",
      value: show(item.precipitationProbability, units.precipitationProbability),
    });
  }
  rows.push({ label: "Nuages", value: show(item.cloudCover, units.cloudCover) });
  rows.push({ label: "Vent", value: show(item.windSpeed, units.windSpeed) });
  rows.push({ label: "Lever du soleil", value: show(item.sunrise) });
  rows.push({ label: "Coucher du soleil", value: show(item.sunset) });

  return (
    <article className="weather-card">
      <h3>{item.title}</h3>
      <p>
        <span className="weather-icon" role="img" aria-label={condition}>
          {weatherIcon(item.weatherCode)}
        </span>{" "}
        {condition}
      </p>
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="weather-row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}