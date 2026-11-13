import { Router } from "express";
import { getCity } from "../controllers/cityController";

export const cityRoutes = Router();

cityRoutes.get("/:id", getCity);