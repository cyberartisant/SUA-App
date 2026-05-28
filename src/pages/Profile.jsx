import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCatches } from '../contexts/CatchContext'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { catches } = useCatches()
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState(
    () => user?.weatherApiKey || localStorage.getItem('weather_api_key') || ''
  )
  const [saved, setSaved] = useState(false)

  function saveApiKey() {
    localStorage.setItem('weather_api_key', apiKey)
    updateUser({ weatherApiKey: apiKey })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-count">{catches.length} catches logged</p>
        </div>
      </div>

      <div className="settings-card">
        <h3>Weather API Key</h3>
        <p className="settings-desc">
          Get a free key at <strong>openweathermap.org</strong> → My API Keys
        </p>
        <div className="api-row">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Paste your API key here"
            className="form-input"
          />
          <button className="btn-primary" onClick={saveApiKey}>
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h3>About</h3>
        <p className="settings-desc">
          SUA Fishing v1.0 · Your offline-ready fishing companion<br />
          Data is stored locally on your device.
        </p>
        <a
          href="https://suafishing.com"
          target="_blank"
          rel="noopener noreferrer"
          className="website-card-link"
        >
          🌐 suafishing.com ↗
        </a>
      </div>

      <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
    </div>
  )
}
