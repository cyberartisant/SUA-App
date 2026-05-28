const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export async function getWeather(lat, lng, apiKey) {
  if (!apiKey) return null
  try {
    const res = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${apiKey}`
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: Math.round(data.wind.speed),
      humidity: data.main.humidity,
      city: data.name
    }
  } catch { return null }
}
