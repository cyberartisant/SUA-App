import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useCatches } from '../contexts/CatchContext'

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CatchCard({ catch: c }) {
  const { removeCatch } = useCatches()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(null)

  return (
    <div className="catch-card">
      {c.photos?.[0] && (
        <div className="catch-photo" onClick={() => setLightboxIdx(0)} style={{ cursor: 'pointer' }}>
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
          {c.location?.name && (
            <span className="catch-stat catch-stat-location">
              📍 {c.location.name}
              <button className="btn-show-map" onClick={() => setShowMap(true)}>Show</button>
            </span>
          )}
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
          <button className="btn-edit" onClick={() => navigate(`/edit/${c.id}`)}>Edit</button>
          <button className="btn-delete" onClick={() => setConfirm(true)}>Delete</button>
        </div>
      </div>

      {lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIdx(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIdx(null)}>✕</button>
          <img
            className="lightbox-img"
            src={c.photos[lightboxIdx]}
            alt={c.species}
            onClick={e => e.stopPropagation()}
          />
          {c.photos.length > 1 && (
            <div className="lightbox-nav" onClick={e => e.stopPropagation()}>
              <button
                className="lightbox-arrow"
                onClick={() => setLightboxIdx((lightboxIdx - 1 + c.photos.length) % c.photos.length)}
              >‹</button>
              <span className="lightbox-count">{lightboxIdx + 1} / {c.photos.length}</span>
              <button
                className="lightbox-arrow"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % c.photos.length)}
              >›</button>
            </div>
          )}
        </div>
      )}

      {showMap && c.location?.lat && (
        <div className="modal-overlay" onClick={() => setShowMap(false)}>
          <div className="map-picker-modal" onClick={e => e.stopPropagation()}>
            <div className="map-picker-header">
              <h3>📍 {c.location.name}</h3>
              <button className="map-picker-close" onClick={() => setShowMap(false)}>✕</button>
            </div>
            <MapContainer
              center={[c.location.lat, c.location.lng]}
              zoom={13}
              className="map-picker-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[c.location.lat, c.location.lng]}>
                <Popup>{c.species} — {fmt(c.date)}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

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
