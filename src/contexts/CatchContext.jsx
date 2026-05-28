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

  function removeCatch(id) {
    deleteCatch(id)
    setCatches(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CatchContext.Provider value={{ catches, addCatch, removeCatch }}>
      {children}
    </CatchContext.Provider>
  )
}
