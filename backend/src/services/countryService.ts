import { findAllCountries } from "../repositories/countryRepository";

export async function getCountries() {
  return findAllCountries();
}