import { useState } from 'react'
import { useCatches } from '../contexts/CatchContext'

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CatchCard({ catch: c }) {
  const { removeCatch } = useCatches()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="catch-card">
      {c.photos?.[0] && (
        <div className="catch-photo">
          <img src={c.photos[0]} alt={c.species} />
        </div>
      )}
      <div className="catch-body">
        <div className="catch-header">
          <h3 className="catch-species">{c.species}</h3>
          <span className="catch-date">{fmt(c.date)}</span>
        </div>
        <div className="catch-stats">
          {c.weight && <span className="catch-stat">⚖️ {c.weight} lbs</span>}
          {c.length && <span className="catch-stat">📏 {c.length}"</span>}
          {c.location?.name && <span className="catch-stat">📍 {c.location.name}</span>}
        </div>
        {c.notes && <p className="catch-notes">{c.notes}</p>}
        {c.weather && (
          <div className="catch-weather-row">
            <img
              src={`https://openweathermap.org/img/wn/${c.weather.icon}.png`}
              alt={c.weather.description}
              width={20} height={20}
            />
            <span>{c.weather.temp}°F · {c.weather.description}</span>
          </div>
        )}
        <div className="catch-actions">
          <button className="btn-delete" onClick={() => setConfirm(true)}>Delete</button>
        </div>
      </div>

      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete this catch?</h3>
            <p>This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="btn-danger" onClick={() => removeCatch(c.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
