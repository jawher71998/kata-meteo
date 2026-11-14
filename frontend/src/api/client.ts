import type {
  City,
  Country,
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  HistoricalWeatherResponse,
} from "./types";
import { toApiPath } from "../lib/weatherQuery";
import type { WeatherQuery } from "../lib/weatherQuery";
import { mapCurrent, mapForecast, mapHistorical } from "../lib/weatherResult";
import type { WeatherResult } from "../lib/weatherResult";

export class ApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path);
  } catch {
    throw new ApiError("Impossible de joindre le serveur. Vérifiez que l'API est démarrée.");
  }

  if (!response.ok) {
    let message =
      response.status >= 500
        ? "Le serveur est momentanément indisponible."
        : "La requête a échoué.";

    try {
      const body: unknown = await response.json();
      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error; // le message en français renvoyé par notre API
      }
    } catch {
      // corps de réponse non JSON : on garde le message générique
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function getCountries(): Promise<Country[]> {
  return apiGet<Country[]>("/api/countries");
}

export function getCitiesByCountry(countryId: number): Promise<City[]> {
  return apiGet<City[]>(`/api/countries/${countryId}/cities`);
}

export async function getWeather(query: WeatherQuery): Promise<WeatherResult> {
  const path = toApiPath(query);

  switch (query.mode) {
    case "current":
      return mapCurrent(await apiGet<CurrentWeatherResponse>(path));
    case "historical":
      return mapHistorical(await apiGet<HistoricalWeatherResponse>(path));
    case "forecast":
      return mapForecast(await apiGet<ForecastWeatherResponse>(path));
  }
}