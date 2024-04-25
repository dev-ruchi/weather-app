import { useEffect, useState } from "react";

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const weather_api = "cb5d2ca7fb233e093338ce60d003ce8e";

  function fetchData() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${-36.77265}&lon=${144.25271}&appid=${weather_api}
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
  }

  return (
    <div className="weather-container">
      {weatherData && (
        <>
          <div className="flex">
            <p className="weather-info text-xl font-semibold px-2">{weatherData.name},</p>
            <p className="weather-info text-xl font-semibold">{weatherData.sys.country}</p>
          </div>
          <p className="weather-info px-2 mt-4 text-xl">{((weatherData.main.temp)-273.15).toFixed(2)}°C</p>
          <div className="flex">
            <p className="weather-info px-2">
              feels_like: {((weatherData.main.feels_like)-273.15).toFixed(2)}°C
            </p>
            <p className="weather-info">{weatherData.weather[0].main}</p>
          </div>

          <p className="weather-info px-2">{weatherData.weather[0].description}</p>
          <p className="weather-info px-2">humidity: {weatherData.main.humidity}</p>
          <p className="weather-info px-2">Wind: {weatherData.wind.speed}</p>
          <p className="weather-info px-2">Latitude: {weatherData.coord.lat}</p>
          <p className="weather-info px-2">Longitude: {weatherData.coord.lon}</p>
        </>
      )}
    </div>
  );
};

export default Weather;
