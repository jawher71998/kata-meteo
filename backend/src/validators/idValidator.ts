import { BadRequestError } from "../errors/AppError";

// label : "du pays", "de la ville"... pour un message précis
export function parseId(value: string, label: string): number {
  const message = `L'identifiant ${label} doit être un entier positif.`;

  if (!/^[1-9]\d*$/.test(value)) throw new BadRequestError(message);

  const id = Number(value);
  // 2147483647 est le plus grand entier accepté par une colonne INTEGER
  if (id > 2147483647) throw new BadRequestError(message);

  return id;
}