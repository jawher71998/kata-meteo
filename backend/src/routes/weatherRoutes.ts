import { Router } from "express";
import { getCurrent } from "../controllers/weatherController";

export const weatherRoutes = Router();

weatherRoutes.get("/current", getCurrent);