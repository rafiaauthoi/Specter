import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CookieBanner() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)', maxWidth: 680,
      background: 'var(--surface)', border: '1px solid var(--border-active)',
      borderRadius: 'var(--radius-lg)', padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      zIndex: 1000, boxShadow: '0 0 24px var(--pink-glow)',
      fontFamily: 'var(--font-body)', flexWrap: 'wrap',
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, minWidth: 200 }}>
        Specter uses localStorage to keep you signed in. We do not use tracking or advertising cookies.{' '}
        <button onClick={() => navigate('/cookies')}
          style={{ background: 'none', border: 'none', color: 'var(--pink)', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
          Cookie Policy
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline} className="btn-ghost" style={{ fontSize: 11 }}>Decline</button>
        <button onClick={accept} className="btn-primary" style={{ fontSize: 11 }}>Accept</button>
      </div>
    </div>
  )
}