import { pool } from "../config/database";

export interface Country {
  id: number;
  name: string;
  code: string;
}

export async function findAllCountries(): Promise<Country[]> {
  const result = await pool.query<Country>(
    "SELECT id, name, code FROM countries ORDER BY name"
  );
  return result.rows;
}

export async function findCountryById(id: number): Promise<Country | null> {
  const result = await pool.query<Country>(
    "SELECT id, name, code FROM countries WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}