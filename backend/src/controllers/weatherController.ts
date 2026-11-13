import { Request, Response } from "express";
import { parseId } from "../validators/idValidator";
import { parseHistoricalDate } from "../validators/dateValidator";
import { requireString } from "../validators/queryValidator";
import { getCurrentWeather, getHistoricalWeather } from "../services/weatherService";

export async function getCurrent(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");
  res.json(await getCurrentWeather(cityId));
}

export async function getHistorical(req: Request, res: Response): Promise<void> {
  const cityId = parseId(requireString(req.query.cityId, "cityId"), "de la ville");
  const date = parseHistoricalDate(requireString(req.query.date, "date"));
  res.json(await getHistoricalWeather(cityId, date));
}