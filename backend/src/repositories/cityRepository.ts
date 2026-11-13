import { pool } from "../config/database";
import { Country } from "./countryRepository";

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface CityDetails extends City {
  country: Country;
}

interface CityRow extends City {
  country_id: number;
  country_name: string;
  country_code: string;
}

export async function findCitiesByCountryId(countryId: number): Promise<City[]> {
  const result = await pool.query<City>(
    `SELECT id, name, latitude::float8 AS latitude, longitude::float8 AS longitude
     FROM cities
     WHERE country_id = $1
     ORDER BY name`,
    [countryId]
  );
  return result.rows;
}

export async function findCityById(id: number): Promise<CityDetails | null> {
  const result = await pool.query<CityRow>(
    `SELECT v.id, v.name,
            v.latitude::float8 AS latitude, v.longitude::float8 AS longitude,
            c.id AS country_id, c.name AS country_name, c.code AS country_code
     FROM cities v
     JOIN countries c ON c.id = v.country_id
     WHERE v.id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    country: { id: row.country_id, name: row.country_name, code: row.country_code },
  };
}