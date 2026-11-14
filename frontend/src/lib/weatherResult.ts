import type {
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  HistoricalWeatherResponse,
} from "../api/types";

export interface DisplayUnits {
  temperature: string;
  precipitation: string;
  precipitationProbability: string;
  cloudCover: string;
  windSpeed: string;
}

// Une "carte" météo. Un champ absent (undefined) n'existe pas dans ce mode ;
// un champ null existe mais la donnée est indisponible.
export interface WeatherItem {
  id: string;
  title: string;
  available: boolean;
  message: string | null;
  temperature?: number | null;
  temperatureMin?: number | null;
  temperatureMax?: number | null;
  precipitation: number | null;
  precipitationProbability?: number | null;
  cloudCover: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  condition: string | null;
  sunrise: string | null;
  sunset: string | null;
}

export interface WeatherResult {
  cityName: string;
  countryName: string;
  items: WeatherItem[];
  units: DisplayUnits;
}

const NO_DATA_MESSAGE = "Aucune donnée météo disponible.";

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function mapCurrent(response: CurrentWeatherResponse): WeatherResult {
  const { current, units } = response;
  const available = [
    current.temperature,
    current.precipitation,
    current.windSpeed,
    current.cloudCover,
    current.weatherCode,
  ].some((value) => value !== null);

  return {
    cityName: response.city.name,
    countryName: response.city.country,
    units: {
      temperature: units.temperature,
      precipitation: units.precipitation,
      precipitationProbability: "%",
      cloudCover: units.cloudCover,
      windSpeed: units.windSpeed,
    },
    items: [
      {
        id: "current",
        title: `Maintenant (${current.time.slice(11, 16)}, heure locale)`,
        available,
        message: available ? null : NO_DATA_MESSAGE,
        temperature: current.temperature,
        precipitation: current.precipitation,
        cloudCover: current.cloudCover,
        windSpeed: current.windSpeed,
        weatherCode: current.weatherCode,
        condition: current.condition,
        sunrise: current.sunrise,
        sunset: current.sunset,
      },
    ],
  };
}

export function mapHistorical(response: HistoricalWeatherResponse): WeatherResult {
  const { daily, units } = response;

  return {
    cityName: response.city.name,
    countryName: response.city.country,
    units: {
      temperature: units.temperature,
      precipitation: units.precipitation,
      precipitationProbability: "%",
      cloudCover: units.cloudCover,
      windSpeed: units.windSpeed,
    },
    items: [
      {
        id: response.date,
        title: formatDate(response.date),
        available: response.available,
        message: response.message,
        temperatureMax: daily.temperatureMax,
        temperatureMin: daily.temperatureMin,
        precipitation: daily.precipitation,
        cloudCover: daily.cloudCover,
        windSpeed: daily.windSpeed,
        weatherCode: daily.weatherCode,
        condition: daily.condition,
        sunrise: daily.sunrise,
        sunset: daily.sunset,
      },
    ],
  };
}

export function mapForecast(response: ForecastWeatherResponse): WeatherResult {
  return {
    cityName: response.city.name,
    countryName: response.city.country,
    units: response.units,
    items: response.days.map((day) => ({
      id: day.date,
      title: formatDate(day.date),
      available: day.available,
      message: day.available ? null : NO_DATA_MESSAGE,
      temperatureMax: day.temperatureMax,
      temperatureMin: day.temperatureMin,
      precipitation: day.precipitation,
      precipitationProbability: day.precipitationProbability,
      cloudCover: day.cloudCover,
      windSpeed: day.windSpeed,
      weatherCode: day.weatherCode,
      condition: day.condition,
      sunrise: day.sunrise,
      sunset: day.sunset,
    })),
  };
}