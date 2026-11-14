import {
  MAX_FORECAST_DAYS,
  MIN_HISTORICAL_DATE,
  addDaysUtc,
  isRealDate,
  todayUtc,
} from "./dates";

export type Mode = "current" | "historical" | "forecast";
export type ForecastKind = "days" | "dates";

// Une requête météo complète et déjà validée
export type WeatherQuery =
  | { mode: "current"; cityId: number }
  | { mode: "historical"; cityId: number; date: string }
  | { mode: "forecast"; cityId: number; days: number }
  | { mode: "forecast"; cityId: number; dates: string[] };

// Ce que l'utilisateur a saisi dans le formulaire
export interface FormValues {
  cityId: number | null;
  mode: Mode;
  historicalDate: string;
  forecastKind: ForecastKind;
  days: string;
  dates: string[];
}

export type BuildResult = { ok: true; query: WeatherQuery } | { ok: false; error: string };

const fail = (error: string): BuildResult => ({ ok: false, error });

export function buildQuery(values: FormValues): BuildResult {
  const { cityId } = values;
  if (cityId === null) return fail("Sélectionnez d'abord une ville.");

  if (values.mode === "current") {
    return { ok: true, query: { mode: "current", cityId } };
  }

  if (values.mode === "historical") {
    const date = values.historicalDate;
    if (date === "") return fail("Choisissez une date.");
    if (!isRealDate(date)) return fail("La date n'est pas valide.");
    if (date < MIN_HISTORICAL_DATE) {
      return fail(`La date doit être postérieure ou égale au ${MIN_HISTORICAL_DATE}.`);
    }
    if (date > todayUtc()) return fail("La date ne peut pas être dans le futur.");
    return { ok: true, query: { mode: "historical", cityId, date } };
  }

  if (values.forecastKind === "days") {
    const days = /^\d+$/.test(values.days) ? Number(values.days) : NaN;
    if (!Number.isInteger(days) || days < 1 || days > MAX_FORECAST_DAYS) {
      return fail(`Le nombre de jours doit être un entier compris entre 1 et ${MAX_FORECAST_DAYS}.`);
    }
    return { ok: true, query: { mode: "forecast", cityId, days } };
  }

  const { dates } = values;
  if (dates.some((date) => date === "")) {
    return fail("Renseignez toutes les dates ou retirez les champs vides.");
  }
  if (dates.some((date) => !isRealDate(date))) return fail("Une des dates n'est pas valide.");
  if (new Set(dates).size !== dates.length) return fail("Les dates doivent être différentes.");

  const min = todayUtc();
  const max = addDaysUtc(min, MAX_FORECAST_DAYS - 1);
  if (dates.some((date) => date < min || date > max)) {
    return fail(`Chaque date doit être comprise entre ${min} et ${max}.`);
  }

  return { ok: true, query: { mode: "forecast", cityId, dates: [...dates].sort() } };
}

// Le chemin d'API correspondant à une requête
export function toApiPath(query: WeatherQuery): string {
  const params = new URLSearchParams({ cityId: String(query.cityId) });

  if (query.mode === "historical") {
    params.set("date", query.date);
  } else if (query.mode === "forecast") {
    if ("days" in query) {
      params.set("days", String(query.days));
    } else {
      params.set("dates", query.dates.join(","));
    }
  }

  return `/api/weather/${query.mode}?${params.toString()}`;
}