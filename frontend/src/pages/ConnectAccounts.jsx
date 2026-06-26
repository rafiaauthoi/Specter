import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text)">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const RedditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF4500">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)

const icons = { google: GoogleIcon, twitter: TwitterIcon, reddit: RedditIcon }

const platforms = [
  { id: 'google',  label: 'Google',      desc: 'Gmail newsletters, Search history, YouTube activity', what: 'Scans and deletes newsletter emails and activity history', soon: false },
  { id: 'twitter', label: 'Twitter / X', desc: 'Tweet deletion coming soon',                           what: 'Bulk deletes old tweets and likes',                      soon: true  },
  { id: 'reddit',  label: 'Reddit',      desc: 'Post and comment deletion coming soon',                what: 'Deletes posts and comments by date or subreddit',        soon: true  },
]

export default function ConnectAccounts() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleConnect(platform) {
    if (platform.soon) {
      showToast(`${platform.label} integration is coming soon.`)
      return
    }
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/${platform.id}?user_id=${localStorage.getItem('user_id') || 'demo-user'}`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 998,
          background: 'var(--surface)', border: '1px solid var(--border-active)',
          color: 'var(--pink)', padding: '12px 20px', borderRadius: 'var(--radius)',
          fontSize: 13, boxShadow: '0 0 20px var(--pink-glow)', fontFamily: 'var(--font-body)'
        }}>
          {toast}
        </div>
      )}

      <nav className="navbar">
        <span className="navbar-logo">specter</span>
        <button onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Back to dashboard
        </button>
      </nav>

      <div className="page">
        <h1 className="section-title">Connect Accounts</h1>
        <p className="section-sub">Specter requests minimum permissions only. Tokens are encrypted before storage.</p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 24, fontSize: 11, color: 'var(--pink)' }}>
          Your tokens are encrypted at rest using AES-256. They are never logged or shared.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {platforms.map(p => {
            const Icon = icons[p.id]
            return (
              <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, opacity: p.soon ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {p.label}
                      {p.soon && (
                        <span style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>SOON</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.desc}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{p.what}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(p)}
                  className={p.soon ? 'btn-ghost' : 'btn-primary'}
                  style={{ flexShrink: 0, fontSize: 11, opacity: p.soon ? 0.5 : 1, cursor: p.soon ? 'not-allowed' : 'pointer' }}>
                  {p.soon ? 'Soon' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>Data brokers</span> do not have APIs, so we guide you through removing yourself manually.
          <button onClick={() => navigate('/removal')}
            style={{ marginLeft: 8, background: 'none', border: 'none', color: 'var(--pink)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Go to guided removal
          </button>
        </div>

        <Footer />
      </div>
    </div>
  )
}