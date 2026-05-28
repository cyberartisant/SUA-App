import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-logo"><img src="/logo.png" alt="FishinApp" className="auth-logo-img" /></div>
      <h1 className="auth-title">Create Account</h1>
      <p className="auth-subtitle">Join the SUA Fishing community</p>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Your Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="John Angler" className="form-input" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="angler@email.com" className="form-input" required autoComplete="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="Min. 6 characters" className="form-input" required autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
            placeholder="Repeat password" className="form-input" required />
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
    </div>
  )
}
