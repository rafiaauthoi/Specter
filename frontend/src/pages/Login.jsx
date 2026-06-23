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
        setError('Account created. Please check your email to confirm your account, then sign in.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafaf9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>

          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>clearprint</div>
            <div style={{ fontSize: 13, color: '#6b6b67' }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </div>
          </div>

          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 14, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {error && (
              <div style={{ fontSize: 13, padding: '10px 14px', borderRadius: 8, background: error.includes('created') ? '#EAF3DE' : '#FCEBEB', color: error.includes('created') ? '#27500A' : '#791F1F' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b67', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b67', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="minimum 8 characters"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button onClick={handleSubmit} disabled={loading || !email || !password}
              style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: loading || !email || !password ? 0.6 : 1, marginTop: 4 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 13, color: '#6b6b67', marginTop: 4 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                style={{ background: 'none', border: 'none', color: '#534AB7', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>

          </div>

          <div style={{ textAlign: 'center', fontSize: 11, color: '#9e9e9a', marginTop: 20 }}>
            Your data is encrypted. We never sell your information.
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}