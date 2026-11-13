import { Router } from "express";
import { getCurrent, getForecast, getHistorical } from "../controllers/weatherController";

export const weatherRoutes = Router();

weatherRoutes.get("/current", getCurrent);
weatherRoutes.get("/historical", getHistorical);
weatherRoutes.get("/forecast", getForecast);