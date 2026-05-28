import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CatchProvider } from './contexts/CatchContext'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import AddCatch from './pages/AddCatch'
import MyCatches from './pages/MyCatches'
import MapView from './pages/MapView'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function Guard({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function Shell({ children }) {
  return (
    <div className="shell">
      <Header />
      <main className="main">{children}</main>
      <BottomNav />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Guard><Shell><Home /></Shell></Guard>} />
      <Route path="/add" element={<Guard><Shell><AddCatch /></Shell></Guard>} />
      <Route path="/catches" element={<Guard><Shell><MyCatches /></Shell></Guard>} />
      <Route path="/map" element={<Guard><Shell><MapView /></Shell></Guard>} />
      <Route path="/profile" element={<Guard><Shell><Profile /></Shell></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CatchProvider>
          <AppRoutes />
        </CatchProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
