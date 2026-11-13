import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

// Le .env est à la racine du dépôt, trois dossiers au-dessus de src/config/
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});