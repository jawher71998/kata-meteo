export const MIN_HISTORICAL_DATE = "2000-01-01";
export const MAX_FORECAST_DAYS = 15;
export const MAX_FORECAST_DATES = 3;

// Date du jour en UTC, comme le serveur
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysUtc(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

export function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}