import { env } from "../config/env";
import { ExternalServiceError } from "../errors/AppError";
import { getCityById } from "./cityService";
import { fetchFromOpenMeteo } from "./openMeteoClient";
import { describeWeatherCode } from "./weatherCodes";

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