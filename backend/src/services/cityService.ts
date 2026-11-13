import { NotFoundError } from "../errors/AppError";
import { findCountryById } from "../repositories/countryRepository";
import {
  City,
  CityDetails,
  findCitiesByCountryId,
  findCityById,
} from "../repositories/cityRepository";

export async function getCitiesByCountry(countryId: number): Promise<City[]> {
  const country = await findCountryById(countryId);
  if (!country) throw new NotFoundError("Pays introuvable.");
  return findCitiesByCountryId(countryId);
}

export async function getCityById(id: number): Promise<CityDetails> {
  const city = await findCityById(id);
  if (!city) throw new NotFoundError("Ville introuvable.");
  return city;
}