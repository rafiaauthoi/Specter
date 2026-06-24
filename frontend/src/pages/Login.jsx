import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup'
      const resp = await fetch(`${API_URL}${endpoint}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: 'POST'
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Something went wrong')
      if (mode === 'login') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user_id', data.user_id)
        navigate('/dashboard')
      } else {
        setMode('login')
        setError('Account created. Check your email to confirm, then sign in.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-logo">Specter</span>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              Your data is encrypted. We never sell your information.
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '28px 24px' }}>
            {error && (
              <div style={{
                fontSize: 12, padding: '10px 14px', borderRadius: 'var(--radius)',
                background: error.includes('created') ? 'var(--green-bg)' : 'var(--red-bg)',
                color: error.includes('created') ? 'var(--green)' : 'var(--red)',
                border: `1px solid ${error.includes('created') ? 'rgba(57,255,138,0.2)' : 'rgba(255,68,102,0.3)'}`
              }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            <button onClick={handleSubmit} disabled={loading || !email || !password} className="btn-primary"
              style={{ width: '100%', padding: '11px', marginTop: 4, opacity: loading || !email || !password ? 0.6 : 1 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                style={{ background: 'none', border: 'none', color: 'var(--pink)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}