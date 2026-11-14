export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface CityRef {
  id: number;
  name: string;
  country: string;
}

export interface CurrentWeatherResponse {
  city: CityRef;
  current: {
    time: string;
    temperature: number | null;
    precipitation: number | null;
    windSpeed: number | null;
    cloudCover: number | null;
    weatherCode: number | null;
    condition: string | null;
    sunrise: string | null;
    sunset: string | null;
  };
  units: { temperature: string; precipitation: string; windSpeed: string; cloudCover: string };
}

export interface HistoricalWeatherResponse {
  city: CityRef;
  date: string;
  available: boolean;
  message: string | null;
  daily: {
    temperatureMax: number | null;
    temperatureMin: number | null;
    precipitation: number | null;
    cloudCover: number | null;
    windSpeed: number | null;
    weatherCode: number | null;
    condition: string | null;
    sunrise: string | null;
    sunset: string | null;
  };
  units: { temperature: string; precipitation: string; cloudCover: string; windSpeed: string };
}

export interface ForecastDayResponse {
  date: string;
  available: boolean;
  temperatureMax: number | null;
  temperatureMin: number | null;
  precipitation: number | null;
  precipitationProbability: number | null;
  cloudCover: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  condition: string | null;
  sunrise: string | null;
  sunset: string | null;
}

export interface ForecastWeatherResponse {
  city: CityRef;
  mode: "days" | "dates";
  days: ForecastDayResponse[];
  units: {
    temperature: string;
    precipitation: string;
    precipitationProbability: string;
    cloudCover: string;
    windSpeed: string;
  };
}