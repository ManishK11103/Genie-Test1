import { useState } from "react";
import axios from "axios";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./App.css";

function App() {
  const { user, signOut } = useAuthenticator();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "4eb3703790b356562054106543b748b2"; // Replace with your OpenWeatherMap key

  const getWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
    } catch {
      setWeather(null);
      setError("City not found or API error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🌦️ Weather App</h1>

        <div className="input-group">
          <input
            className="city-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <button className="search-button" onClick={getWeather}>Search</button>
        </div>

        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <p className="description">{weather.weather[0].description}</p>
            <p>🌡️ {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
          </div>
        )}
      </div>

      <div className="user-info">
        <p>{user?.signInDetails?.loginId}'s session</p>
        <button className="signout-button" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default App;
