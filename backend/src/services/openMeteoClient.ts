import { ExternalServiceError } from "../errors/AppError";

type Params = Record<string, string | number>;

export async function fetchFromOpenMeteo<T>(baseUrl: string, params: Params): Promise<T> {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    console.error("Open-Meteo injoignable :", err);
    throw new ExternalServiceError("Le service météo est momentanément indisponible.", 503);
  }

  if (!response.ok) {
    console.error(`Open-Meteo a répondu ${response.status} :`, await response.text());
    throw new ExternalServiceError("Le service météo a renvoyé une erreur.", 502);
  }

  return (await response.json()) as T;
}