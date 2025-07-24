import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import './weather.css';
import search_icon from '../assets/search-icon.png';
import clear_icon from '../assets/clearsun.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/windicon.png';
import cloud_icon from '../assets/cloud.png';
import scattered_icon from '../assets/scatterdcloud.png';
import broken_icon from '../assets/brokencloud.png';
import rain_icon from '../assets/rain.png';
import showerrain_icon from '../assets/shower-rain.png';
import thunder_icon from '../assets/thunder.png';
import snow_icon from '../assets/snow.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);

  const allIcons = useMemo(() => ({
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": scattered_icon,
    "03n": scattered_icon,
    "04d": broken_icon,
    "04n": broken_icon,
    "09d": showerrain_icon,
    "09n": showerrain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": thunder_icon,
    "11n": thunder_icon,  
    "13d": snow_icon,
    "13n": snow_icon,
  }), []);

  const search = useCallback(async (city) => {
    try {
      if (city === "") {
        alert("Enter City Name");
        return;
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=be1e3b1036af271e5d591c5a6bf5ea7c`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data:", error);
    }
  }, [allIcons]);

  useEffect(() => {
    search("London");
  }, [search]);

  return (
    <div className="Weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
               <b> <p>{weatherData.humidity}%</p></b>
               <b><span>Humidity</span></b>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt=""height={40}/>
              <div>
              <b><p>{weatherData.windspeed} km/h</p></b>
                <b><span>Wind</span></b>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="error">No weather data available. Try searching for a city.</p>
      )}
    </div>
  );
};

export default Weather;
