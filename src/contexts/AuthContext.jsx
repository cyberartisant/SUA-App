import { createContext, useContext, useState } from 'react'
import { getCurrentUser, setCurrentUser, getUsers, saveUser } from '../utils/storage'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)

  function login(email, password) {
    const found = getUsers().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Invalid email or password')
    const { password: _, ...safeUser } = found
    setCurrentUser(safeUser)
    setUser(safeUser)
    return safeUser
  }

  function register(name, email, password) {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already in use')
    }
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    }
    saveUser(newUser)
    const { password: _, ...safeUser } = newUser
    setCurrentUser(safeUser)
    setUser(safeUser)
    return safeUser
  }

  function logout() {
    setCurrentUser(null)
    setUser(null)
  }

  function updateUser(updates) {
    const updated = { ...user, ...updates }
    setCurrentUser(updated)
    setUser(updated)
    const users = getUsers()
    const idx = users.findIndex(u => u.id === updated.id)
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates }
      localStorage.setItem('fishinapp_users', JSON.stringify(users))
    }
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
