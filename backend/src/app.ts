import express from "express";
import cors from "cors";
import { countryRoutes } from "./routes/countryRoutes";
import { cityRoutes } from "./routes/cityRoutes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { weatherRoutes } from "./routes/weatherRoutes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/countries", countryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/weather", weatherRoutes);

// L'ordre compte : ces deux lignes doivent rester TOUJOURS en dernier
app.use(notFoundHandler);
app.use(errorHandler);