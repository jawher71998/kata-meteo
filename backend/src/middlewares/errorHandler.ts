import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

// Appelé quand aucune route ne correspond à l'adresse demandée
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route introuvable." });
}

// Appelé dès qu'une erreur est lancée quelque part dans l'application
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Erreur imprévue : le détail reste dans le terminal, jamais envoyé au client
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur." });
}