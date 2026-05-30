import { createContext, useContext, useState, useEffect } from 'react'
import { getCatches, saveCatch, deleteCatch } from '../utils/storage'
import { useAuth } from './AuthContext'

const CatchContext = createContext(null)

export function useCatches() {
  return useContext(CatchContext)
}

export function CatchProvider({ children }) {
  const { user } = useAuth()
  const [catches, setCatches] = useState([])

  useEffect(() => {
    setCatches(user ? getCatches(user.id) : [])
  }, [user])

  function addCatch(data) {
    const entry = {
      ...data,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString()
    }
    saveCatch(entry)
    setCatches(prev => [entry, ...prev])
    return entry
  }

  function updateCatch(id, data) {
    const existing = catches.find(c => c.id === id)
    const updated = { ...existing, ...data }
    saveCatch(updated)
    setCatches(prev => prev.map(c => c.id === id ? updated : c))
  }

  function removeCatch(id) {
    deleteCatch(id)
    setCatches(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CatchContext.Provider value={{ catches, addCatch, updateCatch, removeCatch }}>
      {children}
    </CatchContext.Provider>
  )
}
