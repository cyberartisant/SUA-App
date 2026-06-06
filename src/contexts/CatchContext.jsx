import { createContext, useContext, useState, useEffect } from 'react'
import { getCatches, saveCatch, deleteCatch } from '../utils/storage'
import { savePhotos, getAllPhotos, deletePhotos } from '../utils/photoStorage'
import { useAuth } from './AuthContext'

const CatchContext = createContext(null)

export function useCatches() {
  return useContext(CatchContext)
}

export function CatchProvider({ children }) {
  const { user } = useAuth()
  const [catches, setCatches] = useState([])

  useEffect(() => {
    if (!user) { setCatches([]); return }
    async function load() {
      const raw = getCatches(user.id)
      const photoMap = await getAllPhotos(raw.map(c => c.id))
      setCatches(raw.map(c => ({ ...c, photos: photoMap[c.id] || [] })))
    }
    load()
  }, [user])

  async function addCatch(data) {
    const { photos = [], ...rest } = data
    const entry = {
      ...rest,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString()
    }
    saveCatch(entry)
    await savePhotos(entry.id, photos)
    const full = { ...entry, photos }
    setCatches(prev => [full, ...prev])
    return full
  }

  async function updateCatch(id, data) {
    const { photos = [], ...rest } = data
    const existing = catches.find(c => c.id === id)
    const updated = { ...existing, ...rest, photos }
    saveCatch(updated)
    await savePhotos(id, photos)
    setCatches(prev => prev.map(c => c.id === id ? updated : c))
  }

  async function removeCatch(id) {
    deleteCatch(id)
    await deletePhotos(id)
    setCatches(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CatchContext.Provider value={{ catches, addCatch, updateCatch, removeCatch }}>
      {children}
    </CatchContext.Provider>
  )
}
