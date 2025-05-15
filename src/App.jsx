import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&type=city&appid=868cb662d0dab5f84e2447d3b55dad0d&units=metric`
        );
        const data = await res.json();

        const citySuggestions = data.list.map((city) => city.name);
        setSuggestions(citySuggestions);
      } catch (error) {
        console.error("Gabim gjatë fetch:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (city) => {
    setCity(city);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (!city) return;

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      const next12Hours = data.list.slice(0, 4);

      setWeather(next12Hours);
      setCity("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
    }
    console.log("Search for", city);
  };

  const renderWeatherIcon = (main) => {
    const iconMap = {
      Clear: "/icons/sunny.png",
      Clouds: "/icons/cloud.png",
      Rain: "/icons/rain.png",
      Snow: "/icons/snow.png",
      Thunderstorm: "/icons/thunderstorm.png",
      Fog: "/icons/fog.png",
      Mist: "/icons/mist.png",
      Haze: "/icons/haze.png",
    };
    const iconPath = iconMap[main] || "/icons/clear.png";
    return <img src={iconPath} alt={main} className="w-16 h-16" />;
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
        🌦️ Weather App
      </h1>

      {/* Search bar */}
      <div className="flex items-center gap-2 w-72 relative">
        <input
          type="text"
          value={city}
          onChange={handleChange}
          placeholder="Enter city name"
          className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          Search
        </button>
        {/* Suggestions bar */}

        {suggestions.length > 0 && (
          <div className="absolute top-16 left-0 right-0 bg-white border rounded-xl shadow-md z-10 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSelectCity(suggestion)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-left"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weather cards */}
      {weather && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
          {weather.map((item, index) => {
            const hour = new Date(item.dt * 1000).getHours();
            const temp = Math.round(item.main.temp);

            return (
              <div
                key={index}
                className="bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-2xl shadow-md flex flex-col items-center"
              >
                <p className="text-lg font-semibold">{hour}:00</p>
                {renderWeatherIcon(item.weather[0].main)}
                <p className="text-xl font-bold">{temp}°C</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
