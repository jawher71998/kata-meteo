import { Request, Response } from "express";
import { BadRequestError } from "../errors/AppError";
import { parseId } from "../validators/idValidator";
import { parseHistoricalDate } from "../validators/dateValidator";
import { parseCategories } from "../validators/fieldsValidator";
import { parseForecastDates, parseForecastDays } from "../validators/forecastValidator";
import { requireString } from "../validators/queryValidator";
import {
  getCurrentWeather,
  getForecastByDates,
  getForecastByDays,
  getHistoricalWeather,
} from "../services/weatherService";
import { filterByCategories } from "../services/weatherFilter";

export async function getCurrent(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");
  const categories = parseCategories(req.query.fields, req.query.exclude);
  res.json(filterByCategories(await getCurrentWeather(cityId), categories));
}

export async function getHistorical(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");
  const date = parseHistoricalDate(requireString(req.query.date, "date"));
  const categories = parseCategories(req.query.fields, req.query.exclude);
  res.json(filterByCategories(await getHistoricalWeather(cityId, date), categories));
}

export async function getForecast(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");

  const hasDays = req.query.days !== undefined;
  const hasDates = req.query.dates !== undefined;

  if (hasDays && hasDates) {
    throw new BadRequestError("Utilisez soit le paramètre days, soit le paramètre dates, pas les deux.");
  }
  if (!hasDays && !hasDates) {
    throw new BadRequestError("Précisez le paramètre days (1 à 15) ou dates (1 à 3 dates).");
  }

  const days = hasDays ? parseForecastDays(requireString(req.query.days, "days")) : null;
  const dates = hasDates ? parseForecastDates(requireString(req.query.dates, "dates")) : null;
  const categories = parseCategories(req.query.fields, req.query.exclude);

  const result =
    days !== null
      ? await getForecastByDays(cityId, days)
      : await getForecastByDates(cityId, dates as string[]);

  res.json(filterByCategories(result, categories));
}