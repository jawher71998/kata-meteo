import { useEffect, useState } from "react";
import { getWeather } from "../api/client";
import type { WeatherQuery } from "../lib/weatherQuery";
import type { WeatherResult } from "../lib/weatherResult";

export type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: WeatherResult };

interface Outcome {
  query: WeatherQuery;
  data?: WeatherResult;
  error?: string;
}

export function useWeather(query: WeatherQuery | null): WeatherState {
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (query !== null) {
      getWeather(query)
        .then((data) => {
          if (!cancelled) setOutcome({ query, data });
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setOutcome({
              query,
              error: err instanceof Error ? err.message : "Une erreur inattendue est survenue.",
            });
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (query === null) return { status: "idle" };
  if (outcome === null || outcome.query !== query) return { status: "loading" };
  if (outcome.error !== undefined) return { status: "error", message: outcome.error };
  if (outcome.data !== undefined) return { status: "success", data: outcome.data };
  return { status: "loading" };
}