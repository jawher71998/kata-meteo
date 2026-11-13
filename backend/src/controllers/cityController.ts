import { Request, Response } from "express";
import { parseId } from "../validators/idValidator";
import { getCitiesByCountry, getCityById } from "../services/cityService";

export async function listCitiesByCountry(req: Request, res: Response): Promise<void> {
  const countryId = parseId(String(req.params.id));
  if (countryId === null) {
    res.status(400).json({ error: "L'identifiant du pays doit être un entier positif." });
    return;
  }

  const cities = await getCitiesByCountry(countryId);
  if (cities === null) {
    res.status(404).json({ error: "Pays introuvable." });
    return;
  }

  res.json(cities);
}

export async function getCity(req: Request, res: Response): Promise<void> {
  const cityId = parseId(String(req.params.id));
  if (cityId === null) {
    res.status(400).json({ error: "L'identifiant de la ville doit être un entier positif." });
    return;
  }

  const city = await getCityById(cityId);
  if (city === null) {
    res.status(404).json({ error: "Ville introuvable." });
    return;
  }

  res.json(city);
}