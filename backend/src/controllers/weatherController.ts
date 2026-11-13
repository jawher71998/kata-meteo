import { Request, Response } from "express";
import { BadRequestError } from "../errors/AppError";
import { parseId } from "../validators/idValidator";
import { parseHistoricalDate } from "../validators/dateValidator";
import { parseForecastDates, parseForecastDays } from "../validators/forecastValidator";
import { requireString } from "../validators/queryValidator";
import {
  getCurrentWeather,
  getForecastByDates,
  getForecastByDays,
  getHistoricalWeather,
} from "../services/weatherService";

export async function getCurrent(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");
  res.json(await getCurrentWeather(cityId));
}

export async function getHistorical(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");
  const date = parseHistoricalDate(requireString(req.query.date, "date"));
  res.json(await getHistoricalWeather(cityId, date));
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

  if (hasDays) {
    const days = parseForecastDays(requireString(req.query.days, "days"));
    res.json(await getForecastByDays(cityId, days));
    return;
  }

  const dates = parseForecastDates(requireString(req.query.dates, "dates"));
  res.json(await getForecastByDates(cityId, dates));
}