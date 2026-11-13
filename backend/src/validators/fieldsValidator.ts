import { BadRequestError } from "../errors/AppError";
import { CATEGORIES, Category } from "../models/weatherCategories";

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

function parseCategoryList(value: unknown, name: string): Category[] {
  if (typeof value !== "string" || value === "") {
    throw new BadRequestError(`Le paramètre ${name} doit contenir au moins une catégorie.`);
  }

  const items = value.split(",").map((item) => item.trim());
  const unknownItems = items.filter((item) => !isCategory(item));
  if (unknownItems.length > 0) {
    throw new BadRequestError(
      `Catégorie inconnue : ${unknownItems.join(", ")}. ` +
        `Catégories autorisées : ${CATEGORIES.join(", ")}.`
    );
  }

  return [...new Set(items)] as Category[];
}

// Renvoie la liste des catégories à retourner
export function parseCategories(fields: unknown, exclude: unknown): Category[] {
  if (fields !== undefined && exclude !== undefined) {
    throw new BadRequestError("Utilisez soit le paramètre fields, soit le paramètre exclude, pas les deux.");
  }

  if (fields !== undefined) {
    return parseCategoryList(fields, "fields");
  }

  if (exclude !== undefined) {
    const excluded = parseCategoryList(exclude, "exclude");
    const remaining = CATEGORIES.filter((category) => !excluded.includes(category));
    if (remaining.length === 0) {
      throw new BadRequestError(
        "Vous ne pouvez pas exclure toutes les catégories : sélectionnez au moins une donnée."
      );
    }
    return remaining;
  }

  return [...CATEGORIES];
}