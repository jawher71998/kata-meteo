export function parseId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  // 2147483647 est le plus grand entier accepté par une colonne INTEGER
  return id <= 2147483647 ? id : null;
}