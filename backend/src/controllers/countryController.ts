import { Request, Response } from "express";
import { getCountries } from "../services/countryService";

export async function listCountries(_req: Request, res: Response): Promise<void> {
  const countries = await getCountries();
  res.json(countries);
}