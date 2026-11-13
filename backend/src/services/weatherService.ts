import { env } from "../config/env";
import { ExternalServiceError } from "../errors/AppError";
import { getCityById } from "./cityService";
import { fetchFromOpenMeteo } from "./openMeteoClient";
import { describeWeatherCode } from "./weatherCodes";
import { CityDetails } from "../repositories/cityRepository";

interface OpenMeteoCurrentResponse {
  current?: {
    time: string;
    temperature_2m: number | null;
    precipitation: number | null;
    cloud_cover: number | null;
    wind_speed_10m: number | null;
    weather_code: number | null;
  };
  current_units?: {
    temperature_2m: string;
    precipitation: string;
    cloud_cover: string;
    wind_speed_10m: string;
  };
  daily?: {
    sunrise?: (string | null)[];
    sunset?: (string | null)[];
  };
}

// "2026-10-30T06:41" devient "06:41"
function toHourMinute(iso: string | null | undefined): string | null {
  const match = iso?.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : null;
}

export async function getCurrentWeather(cityId: number) {
  const city = await getCityById(cityId);

  const data = await fetchFromOpenMeteo<OpenMeteoCurrentResponse>(env.openMeteo.forecastUrl, {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: "auto",
    forecast_days: 1,
    current: "temperature_2m,precipitation,cloud_cover,wind_speed_10m,weather_code",
    daily: "sunrise,sunset",
  });

  const current = data.current;
  const units = data.current_units;
  if (!current || !units) {
    throw new ExternalServiceError("Réponse inattendue du service météo.", 502);
  }

  return {
    city: { id: city.id, name: city.name, country: city.country.name },
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      cloudCover: current.cloud_cover,
      weatherCode: current.weather_code,
      condition:
        current.weather_code === null ? null : describeWeatherCode(current.weather_code),
      sunrise: toHourMinute(data.daily?.sunrise?.[0]),
      sunset: toHourMinute(data.daily?.sunset?.[0]),
    },
    units: {
      temperature: units.temperature_2m,
      precipitation: units.precipitation,
      windSpeed: units.wind_speed_10m,
      cloudCover: units.cloud_cover,
    },
  };
}

interface OpenMeteoDailyResponse {
  daily?: {
    time?: string[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_sum?: (number | null)[];
    cloud_cover_mean?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    weather_code?: (number | null)[];
    sunrise?: (string | null)[];
    sunset?: (string | null)[];
  };
  daily_units?: {
    temperature_2m_max: string;
    precipitation_sum: string;
    cloud_cover_mean: string;
    wind_speed_10m_max: string;
  };
}

export async function getHistoricalWeather(cityId: number, date: string) {
  const city = await getCityById(cityId);

  const data = await fetchFromOpenMeteo<OpenMeteoDailyResponse>(env.openMeteo.archiveUrl, {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: "auto",
    start_date: date,
    end_date: date,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,cloud_cover_mean," +
      "wind_speed_10m_max,sunrise,sunset,weather_code",
  });

  const daily = data.daily;
  const units = data.daily_units;
  if (!daily || !units) {
    throw new ExternalServiceError("Réponse inattendue du service météo.", 502);
  }

  const values = {
    temperatureMax: daily.temperature_2m_max?.[0] ?? null,
    temperatureMin: daily.temperature_2m_min?.[0] ?? null,
    precipitation: daily.precipitation_sum?.[0] ?? null,
    cloudCover: daily.cloud_cover_mean?.[0] ?? null,
    windSpeed: daily.wind_speed_10m_max?.[0] ?? null,
  };
  const weatherCode = daily.weather_code?.[0] ?? null;
  const available = Object.values(values).some((value) => value !== null);

  return {
    city: { id: city.id, name: city.name, country: city.country.name },
    date,
    available,
    message: available ? null : "Aucune donnée météo disponible pour cette date.",
    daily: {
      ...values,
      weatherCode,
      condition: weatherCode === null ? null : describeWeatherCode(weatherCode),
      sunrise: toHourMinute(daily.sunrise?.[0]),
      sunset: toHourMinute(daily.sunset?.[0]),
    },
    units: {
      temperature: units.temperature_2m_max,
      precipitation: units.precipitation_sum,
      cloudCover: units.cloud_cover_mean,
      windSpeed: units.wind_speed_10m_max,
    },
  };
}

interface OpenMeteoForecastResponse {
  daily?: {
    time?: string[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_sum?: (number | null)[];
    precipitation_probability_max?: (number | null)[];
    cloud_cover_mean?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    weather_code?: (number | null)[];
    sunrise?: (string | null)[];
    sunset?: (string | null)[];
  };
  daily_units?: {
    temperature_2m_max: string;
    precipitation_sum: string;
    precipitation_probability_max: string;
    cloud_cover_mean: string;
    wind_speed_10m_max: string;
  };
}

type ForecastDaily = NonNullable<OpenMeteoForecastResponse["daily"]>;

const FORECAST_DAILY_VARIABLES =
  "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max," +
  "cloud_cover_mean,wind_speed_10m_max,sunrise,sunset,weather_code";

function buildForecastDay(daily: ForecastDaily, index: number, date: string) {
  // index vaut -1 si la date n'est pas dans la réponse : toutes les valeurs restent null
  const at = <T>(values: (T | null)[] | undefined): T | null =>
    index >= 0 ? (values?.[index] ?? null) : null;

  const values = {
    temperatureMax: at(daily.temperature_2m_max),
    temperatureMin: at(daily.temperature_2m_min),
    precipitation: at(daily.precipitation_sum),
    precipitationProbability: at(daily.precipitation_probability_max),
    cloudCover: at(daily.cloud_cover_mean),
    windSpeed: at(daily.wind_speed_10m_max),
  };
  const weatherCode = at(daily.weather_code);

  return {
    date,
    available: Object.values(values).some((value) => value !== null),
    ...values,
    weatherCode,
    condition: weatherCode === null ? null : describeWeatherCode(weatherCode),
    sunrise: toHourMinute(at(daily.sunrise)),
    sunset: toHourMinute(at(daily.sunset)),
  };
}

function formatForecast(
  city: CityDetails,
  mode: "days" | "dates",
  data: OpenMeteoForecastResponse,
  requestedDates?: string[]
) {
  const daily = data.daily;
  const units = data.daily_units;
  const time = daily?.time;
  if (!daily || !units || !time) {
    throw new ExternalServiceError("Réponse inattendue du service météo.", 502);
  }

  const dates = requestedDates ?? time;

  return {
    city: { id: city.id, name: city.name, country: city.country.name },
    mode,
    days: dates.map((date) => buildForecastDay(daily, time.indexOf(date), date)),
    units: {
      temperature: units.temperature_2m_max,
      precipitation: units.precipitation_sum,
      precipitationProbability: units.precipitation_probability_max,
      cloudCover: units.cloud_cover_mean,
      windSpeed: units.wind_speed_10m_max,
    },
  };
}

export async function getForecastByDays(cityId: number, days: number) {
  const city = await getCityById(cityId);

  const data = await fetchFromOpenMeteo<OpenMeteoForecastResponse>(env.openMeteo.forecastUrl, {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: "auto",
    forecast_days: days,
    daily: FORECAST_DAILY_VARIABLES,
  });

  return formatForecast(city, "days", data);
}

// dates doit être triée par ordre croissant (garanti par parseForecastDates)
export async function getForecastByDates(cityId: number, dates: string[]) {
  const city = await getCityById(cityId);

  const data = await fetchFromOpenMeteo<OpenMeteoForecastResponse>(env.openMeteo.forecastUrl, {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: "auto",
    start_date: dates[0],
    end_date: dates[dates.length - 1],
    daily: FORECAST_DAILY_VARIABLES,
  });

  return formatForecast(city, "dates", data, dates);
}