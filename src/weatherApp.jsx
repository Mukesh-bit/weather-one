import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests to APIs

const weatherApp = () => {
  const [city, setCity] = useState(""); // State to store the city name input by the user
  const [weather, setWeather] = useState(null); // State to store the weather data retrieved from API
  const [error, setError] = useState(null); // State to store any error messages


  const OPENCAGE_API_KEY = "a059bf750aba4615a53761bdde4177d7"; // OpenCage API key

  // Function to get latitude and longitude of the city using OpenCage API
  const getCoordinates = async (city) => {
    const geoCodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${OPENCAGE_API_KEY}`;
    try {
      const res = await axios.get(geoCodeUrl);
      const { lat, lng } = res.data.results[0].geometry; // Extract latitude and longitude
      return { lat, lng }; // Return the coordinates
    } catch (error) {
      setError("City not found"); // Set error if city not found
      return null;
    }
  };

  // Function to get weather data using Open-Meteo API with latitude and longitude
  const getWeather = async (lat, lng) => {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    try {
      const res = await axios.get(weatherUrl); // Make request to Open-Meteo API
      setWeather(res.data.current_weather); // Set the current weather data in state
    } catch (error) {
      console.log("Weather API error", error);
      setError("Try after sometime..."); // Set error message in state
    }
  };

  // Handler function called when user clicks "Check Weather"
  const handleSearch = async () => {
    setError(null); // Reset error state
    setWeather(null); // Reset weather data

    const coordinates = await getCoordinates(city); // Get coordinates from city name
    if (coordinates) {
      await getWeather(coordinates.lat, coordinates.lng); // Fetch weather data for those coordinates
    }
  };

  return (
    <div className="container">
      <div className="weather-app" style={{ textAlign: "center" }}>
        <h1 style={{ color: "white", marginBlock: "20px" }}>Weather App</h1>
        <input
          className="input"
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)} // Update city name as user types
        />

        <button className="btn" onClick={handleSearch}>
          Check Weather
        </button>

        {/* Display error message if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ color: "white" }}>{city}</h2>
            <p
              style={{
                fontSize: "2rem",
                marginBlock: "10px",
                color: "white",
                fontWeight: "600",
              }}
            >
              {weather.temperature} °C
            </p>
            <div className="weather-details" >
              <p>Wind <br /> {weather.windspeed} km/h</p>

              <p>Weather Code: {weather.weathercode}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default weatherApp;
