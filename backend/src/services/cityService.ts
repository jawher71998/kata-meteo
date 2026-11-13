import { findCountryById } from "../repositories/countryRepository";
import {
  City,
  CityDetails,
  findCitiesByCountryId,
  findCityById,
} from "../repositories/cityRepository";

// Renvoie null si le pays n'existe pas
export async function getCitiesByCountry(countryId: number): Promise<City[] | null> {
  const country = await findCountryById(countryId);
  if (!country) return null;
  return findCitiesByCountryId(countryId);
}

// Renvoie null si la ville n'existe pas
export async function getCityById(id: number): Promise<CityDetails | null> {
  return findCityById(id);
}