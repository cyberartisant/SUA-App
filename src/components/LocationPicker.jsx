import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng) }
  })
  return null
}

export default function LocationPicker({ onConfirm, onCancel }) {
  const [pin, setPin] = useState(null)
  const [confirming, setConfirming] = useState(false)

  async function handleConfirm() {
    if (!pin) return
    setConfirming(true)
    const { lat, lng } = pin
    let name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      if (data.display_name) name = data.display_name.split(',').slice(0, 2).join(',').trim()
    } catch {}
    onConfirm({ lat, lng, name })
    setConfirming(false)
  }

  return (
    <div className="map-picker-overlay">
      <div className="map-picker-modal">
        <div className="map-picker-header">
          <h3>Pin Your Location</h3>
          <button className="map-picker-close" onClick={onCancel}>✕</button>
        </div>
        <p className="map-picker-hint">
          {pin ? '📍 Drag the pin to adjust, then confirm.' : 'Tap the map to place your pin.'}
        </p>
        <MapContainer center={[39.5, -98.35]} zoom={4} className="map-picker-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={setPin} />
          {pin && (
            <Marker
              position={[pin.lat, pin.lng]}
              draggable
              eventHandlers={{ dragend: e => setPin(e.target.getLatLng()) }}
            />
          )}
        </MapContainer>
        <div className="map-picker-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleConfirm}
            disabled={!pin || confirming}
          >
            {confirming ? 'Saving...' : 'Confirm Location'}
          </button>
        </div>
      </div>
    </div>
  )
}
