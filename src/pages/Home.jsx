import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCatches } from '../contexts/CatchContext'
import { getWeather } from '../utils/weather'
import CatchCard from '../components/CatchCard'

export default function Home() {
  const { user } = useAuth()
  const { catches } = useCatches()
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  useEffect(() => {
    const apiKey = user?.weatherApiKey || localStorage.getItem('weather_api_key')
    if (!apiKey || !navigator.geolocation) return
    setWeatherLoading(true)
    navigator.geolocation.getCurrentPosition(async pos => {
      const w = await getWeather(pos.coords.latitude, pos.coords.longitude, apiKey)
      setWeather(w)
      setWeatherLoading(false)
    }, () => setWeatherLoading(false))
  }, [user])

  const totalSpecies = new Set(catches.map(c => c.species)).size
  const maxWeight = catches.some(c => c.weight)
    ? Math.max(...catches.filter(c => c.weight).map(c => parseFloat(c.weight))).toFixed(1)
    : '—'

  return (
    <div className="page">
      {/* Weather */}
      <section className="section">
        {weatherLoading && <div className="weather-placeholder">Loading weather...</div>}
        {weather && (
          <div className="weather-card">
            <div className="weather-main">
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} />
              <div>
                <div className="weather-temp">{weather.temp}°F</div>
                <div className="weather-desc">{weather.description}</div>
                {weather.city && <div className="weather-city">{weather.city}</div>}
              </div>
            </div>
            <div className="weather-details">
              <span>💨 {weather.windSpeed} mph</span>
              <span>💧 {weather.humidity}%</span>
              <span>🌡️ Feels {weather.feelsLike}°F</span>
            </div>
          </div>
        )}
        {!weather && !weatherLoading && (
          <div className="weather-placeholder">
            🌤️ Add your OpenWeatherMap API key in <Link to="/profile">Profile</Link> for live weather
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num">{catches.length}</div>
            <div className="stat-label">Total Catches</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{totalSpecies}</div>
            <div className="stat-label">Species</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{maxWeight}</div>
            <div className="stat-label">Best (lbs)</div>
          </div>
        </div>
      </section>

      {/* Website Link */}
      <a
        href="https://suafishing.com"
        target="_blank"
        rel="noopener noreferrer"
        className="website-banner"
      >
        <span>🌐 Visit suafishing.com</span>
        <span className="website-banner-arrow">↗</span>
      </a>

      {/* Quick Add */}
      <Link to="/add" className="fab">🎣 Log a Catch</Link>

      {/* Recent */}
      <section className="section">
        <div className="section-header">
          <h2>Recent Catches</h2>
          <Link to="/catches" className="see-all">See All</Link>
        </div>
        {catches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎣</div>
            <p>No catches yet — hit the water and start logging!</p>
            <Link to="/add" className="btn-primary">Log Your First Catch</Link>
          </div>
        ) : (
          <div className="catch-list">
            {catches.slice(0, 3).map(c => <CatchCard key={c.id} catch={c} />)}
          </div>
        )}
      </section>
    </div>
  )
}
