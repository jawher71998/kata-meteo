import { useState } from "react";
import type { City } from "../api/types";
import {
  MAX_FORECAST_DATES,
  MAX_FORECAST_DAYS,
  MIN_HISTORICAL_DATE,
  addDaysUtc,
  todayUtc,
} from "../lib/dates";
import { buildQuery } from "../lib/weatherQuery";
import type { ForecastKind, Mode, WeatherQuery } from "../lib/weatherQuery";

interface WeatherFormProps {
  city: City | null;
  onSubmit: (query: WeatherQuery) => void;
}

const MODES: { value: Mode; label: string }[] = [
  { value: "current", label: "Météo actuelle" },
  { value: "historical", label: "Historique" },
  { value: "forecast", label: "Prévisions" },
];

export default function WeatherForm({ city, onSubmit }: WeatherFormProps) {
  const [mode, setMode] = useState<Mode>("current");
  const [historicalDate, setHistoricalDate] = useState("");
  const [forecastKind, setForecastKind] = useState<ForecastKind>("days");
  const [days, setDays] = useState("7");
  const [dates, setDates] = useState<string[]>([""]);
  const [showErrors, setShowErrors] = useState(false);

  const today = todayUtc();
  const lastForecastDate = addDaysUtc(today, MAX_FORECAST_DAYS - 1);

  const result = buildQuery({
    cityId: city?.id ?? null,
    mode,
    historicalDate,
    forecastKind,
    days,
    dates,
  });

  function handleModeChange(value: Mode) {
    setMode(value);
    setShowErrors(false);
  }

  function updateDate(index: number, value: string) {
    setDates((previous) => previous.map((date, i) => (i === index ? value : date)));
  }

  function addDate() {
    setDates((previous) => (previous.length < MAX_FORECAST_DATES ? [...previous, ""] : previous));
  }

  function removeDate(index: number) {
    setDates((previous) => previous.filter((_, i) => i !== index));
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (result.ok) {
      setShowErrors(false);
      onSubmit(result.query);
    } else {
      setShowErrors(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Mode de consultation</legend>
        {MODES.map((item) => (
          <label key={item.value}>
            <input
              type="radio"
              name="mode"
              value={item.value}
              checked={mode === item.value}
              onChange={() => handleModeChange(item.value)}
            />{" "}
            {item.label}
          </label>
        ))}
      </fieldset>

      {mode === "historical" && (
        <div>
          <label htmlFor="historical-date">Date</label>
          <input
            id="historical-date"
            type="date"
            min={MIN_HISTORICAL_DATE}
            max={today}
            value={historicalDate}
            onChange={(event) => setHistoricalDate(event.target.value)}
          />
        </div>
      )}

      {mode === "forecast" && (
        <fieldset>
          <legend>Période des prévisions</legend>

          <label>
            <input
              type="radio"
              name="forecast-kind"
              checked={forecastKind === "days"}
              onChange={() => setForecastKind("days")}
            />{" "}
            Nombre de jours
          </label>
          <label>
            <input
              type="radio"
              name="forecast-kind"
              checked={forecastKind === "dates"}
              onChange={() => setForecastKind("dates")}
            />{" "}
            Dates précises
          </label>

          {forecastKind === "days" ? (
            <div>
              <label htmlFor="forecast-days">Nombre de jours (1 à {MAX_FORECAST_DAYS})</label>
              <input
                id="forecast-days"
                type="number"
                min={1}
                max={MAX_FORECAST_DAYS}
                value={days}
                onChange={(event) => setDays(event.target.value)}
              />
            </div>
          ) : (
            <div>
              {dates.map((date, index) => (
                <div key={index}>
                  <label htmlFor={`forecast-date-${index}`}>Date {index + 1}</label>
                  <input
                    id={`forecast-date-${index}`}
                    type="date"
                    min={today}
                    max={lastForecastDate}
                    value={date}
                    onChange={(event) => updateDate(index, event.target.value)}
                  />
                  {dates.length > 1 && (
                    <button type="button" onClick={() => removeDate(index)}>
                      Retirer
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addDate} disabled={dates.length >= MAX_FORECAST_DATES}>
                Ajouter une date
              </button>
            </div>
          )}
        </fieldset>
      )}

      <button type="submit" disabled={!city}>
        Afficher la météo
      </button>
      {!city && <p>Sélectionnez d'abord une ville.</p>}
      {showErrors && !result.ok && <p role="alert">{result.error}</p>}
    </form>
  );
}