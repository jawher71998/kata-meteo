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