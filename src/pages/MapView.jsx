import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useCatches } from '../contexts/CatchContext'

export default function MapView() {
  const { catches } = useCatches()
  const located = catches.filter(c => c.location?.lat)

  return (
    <div className="page page-map">
      <div className="page-header">
        <h1>Catch Map</h1>
        <span className="badge">{located.length} pins</span>
      </div>
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map(c => (
          <Marker key={c.id} position={[c.location.lat, c.location.lng]}>
            <Popup>
              <div style={{ minWidth: 140 }}>
                <strong>{c.species}</strong><br />
                {c.weight ? `⚖️ ${c.weight} lbs ` : ''}
                {c.length ? `📏 ${c.length}"` : ''}<br />
                📅 {new Date(c.date).toLocaleDateString()}
                {c.photos?.[0] && (
                  <img
                    src={c.photos[0]}
                    alt=""
                    style={{ width: '100%', marginTop: 4, borderRadius: 4, maxHeight: 100, objectFit: 'cover' }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {located.length === 0 && (
        <div className="map-empty">
          <p>📍 Your catch locations will appear here.<br />Use GPS when logging catches!</p>
        </div>
      )}
    </div>
  )
}
