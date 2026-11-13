import { Request, Response } from "express";
import { BadRequestError } from "../errors/AppError";
import { parseId } from "../validators/idValidator";
import { getCurrentWeather } from "../services/weatherService";

export async function getCurrent(req: Request, res: Response): Promise<void> {
  const rawCityId = req.query.cityId;
  if (typeof rawCityId !== "string") {
    throw new BadRequestError("Le paramètre cityId est obligatoire.");
  }
  const cityId = parseId(rawCityId, "de la ville");
  res.json(await getCurrentWeather(cityId));
}