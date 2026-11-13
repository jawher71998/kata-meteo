import { Router } from "express";
import { listCountries } from "../controllers/countryController";
import { listCitiesByCountry } from "../controllers/cityController";

export const countryRoutes = Router();

countryRoutes.get("/", listCountries);
countryRoutes.get("/:id/cities", listCitiesByCountry);