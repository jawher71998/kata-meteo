import { BadRequestError } from "../errors/AppError";

export function requireString(value: unknown, name: string): string {
  if (typeof value !== "string" || value === "") {
    throw new BadRequestError(`Le paramètre ${name} est obligatoire.`);
  }
  return value;
}