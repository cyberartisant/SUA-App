import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-logo"><img src="/logo.png" alt="FishinApp" className="auth-logo-img" /></div>
      <h1 className="auth-title">SUA Fishing</h1>
      <p className="auth-subtitle">Track every catch, every cast</p>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="angler@email.com" className="form-input"
            required autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="••••••••" className="form-input"
            required autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
    </div>
  )
}
