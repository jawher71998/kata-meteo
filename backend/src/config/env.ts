import path from "path";
import dotenv from "dotenv";

// Le .env est à la racine du dépôt, trois dossiers au-dessus de src/config/
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: required("DB_HOST"),
    port: Number(required("DB_PORT")),
    name: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
  },
  openMeteo: {
    forecastUrl: required("OPEN_METEO_FORECAST_URL"),
    archiveUrl: required("OPEN_METEO_ARCHIVE_URL"),
  },
};