import { BadRequestError } from "../errors/AppError";
import { MAX_FORECAST_DAYS, addDaysUtc, parseDate, todayUtc } from "./dateValidator";

const MAX_DATES = 3;

export function parseForecastDays(value: string): number {
  const days = /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isInteger(days) || days < 1 || days > MAX_FORECAST_DAYS) {
    throw new BadRequestError(
      `Le nombre de jours doit être un entier compris entre 1 et ${MAX_FORECAST_DAYS}.`
    );
  }
  return days;
}

export function parseForecastDates(value: string): string[] {
  const parts = value.split(",");
  if (parts.length > MAX_DATES) {
    throw new BadRequestError(`Vous pouvez demander entre 1 et ${MAX_DATES} dates.`);
  }

  const dates = parts.map((part) => parseDate(part));
  if (new Set(dates).size !== dates.length) {
    throw new BadRequestError("Les dates demandées doivent être différentes.");
  }

  const min = todayUtc();
  const max = addDaysUtc(min, MAX_FORECAST_DAYS - 1);
  if (dates.some((date) => date < min || date > max)) {
    throw new BadRequestError(
      `Chaque date doit être comprise entre ${min} et ${max} (${MAX_FORECAST_DAYS} jours à partir d'aujourd'hui).`
    );
  }

  return [...dates].sort();
}