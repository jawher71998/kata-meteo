import { Router } from "express";
import { listCountries } from "../controllers/countryController";

export const countryRoutes = Router();

countryRoutes.get("/", listCountries);