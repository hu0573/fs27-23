const apikey = "5d50cb77a4d850371ce5a430e31c9b24";
const weatherDataEl = document.getElementById("weather-data");
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");
const WMO = {
  0: "☀️ Clear sky",
  1: "🌤️ Mainly clear",
  2: "⛅ Partly cloudy",
  3: "☁️ Overcast",
  45: "🌫️ Fog",
  48: "🌫️ Depositing rime fog",
  51: "🌦️ Light drizzle",
  53: "🌦️ Moderate drizzle",
  55: "🌧️ Dense drizzle",
  61: "🌦️ Slight rain",
  63: "🌧️ Moderate rain",
  65: "🌧️ Heavy rain",
  71: "🌨️ Slight snow fall",
  73: "🌨️ Moderate snow fall",
  75: "❄️ Heavy snow fall",
  77: "❄️ Snow grains",
  80: "🌦️ Rain showers (slight)",
  81: "🌧️ Rain showers (moderate)",
  82: "🌧️ Rain showers (violent)",
  85: "🌨️ Snow showers (slight)",
  86: "❄️ Snow showers (heavy)",
  95: "⛈️ Thunderstorm (slight/moderate)",
  96: "⛈️ Thunderstorm with slight hail",
  99: "⛈️ Thunderstorm with heavy hail",
};

const getWeatherData = async (cityValue) => {
  console.log("city", cityValue);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityValue}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("network error");
    }
    const geoData = await response.json();
    console.log("step0", geoData);
    if (!geoData.results) {
      throw new Error(`cant find city ${cityValue}`);
    }
    const { name, latitude, longitude, timezone } = geoData.results[0];
    console.log("step1", { name, latitude, longitude, timezone });

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m,precipitation` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,precipitation_probability_max` +
        `&timezone=${encodeURIComponent(timezone)}`
    );
    if (!weatherRes.ok) {
      throw new Error(`Can't find the weather info for ${name}`);
    }
    const weatherData = await weatherRes.json();
    console.log("step2", weatherData);

    const cur = weatherData.current;
    const result = {
      city: name,
      temperature: `${cur.temperature_2m}°C`,
      feelsLike: `${cur.apparent_temperature}°C`,
      description: WMO[cur.weathercode] || "Unknown",
      humidity: `${cur.relativehumidity_2m}%`,
      windSpeed: `${cur.windspeed_10m} m/s`,
    };
    console.log("step3", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityValue = cityInputEl.value;
  if (!cityValue) return;
  getWeatherData(cityValue);
});
