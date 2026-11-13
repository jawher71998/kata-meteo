import { BadRequestError } from "../errors/AppError";

const MIN_HISTORICAL_DATE = "2000-01-01";

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Un 30 février serait "corrigé" en mars par JavaScript : on vérifie que la date n'a pas bougé
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

// Vérifie le format et l'existence du jour. Réutilisé plus tard pour les prévisions.
export function parseDate(value: string): string {
  if (!isRealDate(value)) {
    throw new BadRequestError(
      "La date doit être au format YYYY-MM-DD et correspondre à un jour existant."
    );
  }
  return value;
}

export function parseHistoricalDate(value: string): string {
  const date = parseDate(value);
  // Le format YYYY-MM-DD se compare correctement comme du texte
  if (date < MIN_HISTORICAL_DATE) {
    throw new BadRequestError("La date doit être postérieure ou égale au 2000-01-01.");
  }
  if (date > todayUtc()) {
    throw new BadRequestError("La date ne peut pas être dans le futur.");
  }
  return date;
}