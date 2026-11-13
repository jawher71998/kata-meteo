import { Request, Response } from "express";
import { parseId } from "../validators/idValidator";
import { getCitiesByCountry, getCityById } from "../services/cityService";

export async function listCitiesByCountry(req: Request, res: Response): Promise<void> {
  const countryId = parseId(String(req.params.id), "du pays");
  res.json(await getCitiesByCountry(countryId));
}

export async function getCity(req: Request, res: Response): Promise<void> {
  const cityId = parseId(String(req.params.id), "de la ville");
  res.json(await getCityById(cityId));
}