import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatches } from '../contexts/CatchContext'
import { useAuth } from '../contexts/AuthContext'
import { getWeather } from '../utils/weather'

const SPECIES = [
  'Bass (Largemouth)', 'Bass (Smallmouth)', 'Bass (Striped)', 'Bass (White)',
  'Bluegill', 'Catfish (Blue)', 'Catfish (Channel)', 'Catfish (Flathead)',
  'Crappie (Black)', 'Crappie (White)', 'Flounder', 'Grouper',
  'Mahi-Mahi', 'Muskie', 'Northern Pike', 'Perch (Yellow)',
  'Redfish (Red Drum)', 'Salmon (Atlantic)', 'Salmon (Chinook)', 'Salmon (Coho)',
  'Snapper (Mangrove)', 'Snapper (Red)', 'Snook', 'Tarpon',
  'Trout (Brown)', 'Trout (Lake)', 'Trout (Rainbow)', 'Trout (Speckled)',
  'Tuna (Bluefin)', 'Tuna (Yellowfin)', 'Walleye', 'Other'
]

export default function AddCatch() {
  const navigate = useNavigate()
  const { addCatch } = useCatches()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const today = new Date()
  const [form, setForm] = useState({
    species: '',
    customSpecies: '',
    weight: '',
    length: '',
    date: today.toISOString().split('T')[0],
    time: today.toTimeString().slice(0, 5),
    notes: '',
    location: null,
    photos: []
  })
  const [locLoading, setLocLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(name, value) {
    setForm(f => ({ ...f, [name]: value }))
  }

  async function getGPS() {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return }
    setLocLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        let name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await res.json()
          if (data.display_name) {
            name = data.display_name.split(',').slice(0, 2).join(',').trim()
          }
        } catch {}
        set('location', { lat, lng, name })
        setLocLoading(false)
      },
      err => {
        setError('Could not get location: ' + err.message)
        setLocLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handlePhotos(e) {
    const files = Array.from(e.target.files).slice(0, 3 - form.photos.length)
    const encoded = await Promise.all(
      files.map(f => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.readAsDataURL(f)
      }))
    )
    set('photos', [...form.photos, ...encoded].slice(0, 3))
    e.target.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.species) { setError('Please select a species'); return }
    setSaving(true)
    setError('')

    let weather = null
    if (form.location) {
      const apiKey = user?.weatherApiKey || localStorage.getItem('weather_api_key')
      if (apiKey) weather = await getWeather(form.location.lat, form.location.lng, apiKey)
    }

    addCatch({
      species: form.species === 'Other' ? (form.customSpecies || 'Other') : form.species,
      weight: form.weight ? parseFloat(form.weight) : null,
      length: form.length ? parseFloat(form.length) : null,
      date: form.date,
      time: form.time,
      notes: form.notes,
      location: form.location,
      photos: form.photos,
      weather
    })

    navigate('/catches')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Log a Catch</h1>
      </div>

      <form onSubmit={handleSubmit} className="catch-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label>Species *</label>
          <select
            value={form.species}
            onChange={e => set('species', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select species...</option>
            {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {form.species === 'Other' && (
          <div className="form-group">
            <label>Specify Species</label>
            <input
              type="text"
              value={form.customSpecies}
              onChange={e => set('customSpecies', e.target.value)}
              placeholder="e.g. Carp, Gar..."
              className="form-input"
            />
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Weight (lbs)</label>
            <input
              type="number" value={form.weight}
              onChange={e => set('weight', e.target.value)}
              placeholder="0.0" step="0.1" min="0" className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Length (inches)</label>
            <input
              type="number" value={form.length}
              onChange={e => set('length', e.target.value)}
              placeholder="0.0" step="0.1" min="0" className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date" value={form.date}
              onChange={e => set('date', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time" value={form.time}
              onChange={e => set('time', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          {form.location ? (
            <div className="location-set">
              <span>📍 {form.location.name}</span>
              <button type="button" className="btn-small" onClick={() => set('location', null)}>Clear</button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-location"
              onClick={getGPS}
              disabled={locLoading}
            >
              {locLoading ? '📡 Getting location...' : '📍 Use My GPS Location'}
            </button>
          )}
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Lure used, water conditions, depth, structure..."
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Photos (up to 3)</label>
          <div className="photo-grid">
            {form.photos.map((photo, i) => (
              <div key={i} className="photo-thumb">
                <img src={photo} alt={`Catch ${i + 1}`} />
                <button
                  type="button"
                  className="photo-remove"
                  onClick={() => set('photos', form.photos.filter((_, idx) => idx !== i))}
                >✕</button>
              </div>
            ))}
            {form.photos.length < 3 && (
              <button
                type="button"
                className="photo-add"
                onClick={() => fileInputRef.current?.click()}
              >
                <span>📸</span>
                <span>Add Photo</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotos}
            style={{ display: 'none' }}
            capture="environment"
          />
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={saving}>
          {saving ? 'Saving...' : '🎣 Save Catch'}
        </button>
      </form>
    </div>
  )
}
