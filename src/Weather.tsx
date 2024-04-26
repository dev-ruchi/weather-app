type Clouds = {
  all: number;
};

type Coord = {
  lon: number;
  lat: number;
};

type Main = {
  feels_like: number;
  grnd_level: number;
  humidity: number;
  pressure: number;
  sea_level: number;
  temp: number;
  temp_max: number;
  temp_min: number;
};

type Sys = {
  country: string;
  sunrise: number;
  sunset: number;
};

type Weather = {
  description: string;
  icon: string;
  id: number;
  main: string;
};

type Wind = {
  deg: number;
  gust: number;
  speed: number;
};

type WeatherData = {
  base: string;
  clouds: Clouds;
  cod: number;
  coord: Coord;
  dt: number;
  id: number;
  main: Main;
  name: string;
  sys: Sys;
  timezone: number;
  visibility: number;
  weather: Weather[];
  wind: Wind;
};

import { useEffect, useState } from "react";
import WeatherIcon from "./img/weather-icon.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get("lat");
    const lon = urlParams.get("lon");
    const weather_api = "cb5d2ca7fb233e093338ce60d003ce8e";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api}
      `
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="weather-container">
      {weatherData && (
        <>
          <div className="bg-purple-400 min-h-screen flex items-center justify-center">
            <div className="p-8 bg-white rounded shadow-lg text-gray-800 w-full lg:max-w-full lg:w-2/3 xl:w-1/2">
              <div className="mb-8">
                <p className="text-2xl font-semibold">
                  {weatherData.name}, {weatherData.sys.country}
                </p>
              </div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center mb-4 lg:mb-0">
                  <img
                    src={WeatherIcon}
                    alt="weather icon"
                    className="w-8 h-8 mb-4 mr-2"
                  />
                  <div>
                    <p className="text-5xl font-bold">
                      {(weatherData.main.temp - 273.15).toFixed(1)}°C
                    </p>
                    <p className="text-sm">
                      Feels Like:{" "}
                      {(weatherData.main.feels_like - 273.15).toFixed(1)}°C
                    </p>
                  </div>
                  <p className="text-2xl ml-2">{weatherData.weather[0].main}</p>
                </div>
              </div>
              <p className="mb-4">{weatherData.weather[0].description}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Humidity</p>
                  <p>{weatherData.main.humidity}%</p>
                </div>
                <div>
                  <p className="font-semibold">Wind</p>
                  <p>{weatherData.wind.speed} m/s</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Location</p>
                <p>Latitude: {weatherData.coord.lat}</p>
                <p>Longitude: {weatherData.coord.lon}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
