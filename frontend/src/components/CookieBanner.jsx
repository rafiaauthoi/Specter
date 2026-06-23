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
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: 680,
      background: '#1a1a18',
      color: '#fff',
      borderRadius: 14,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      zIndex: 1000,
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      fontFamily: 'system-ui, sans-serif',
      flexWrap: 'wrap',
    }}>
      <div style={{ fontSize: 13, color: '#d4d4d0', lineHeight: 1.5, flex: 1, minWidth: 200 }}>
        Clearprint uses localStorage to keep you signed in. We do not use tracking or advertising cookies.{' '}
        <button onClick={() => navigate('/cookies')}
          style={{ background: 'none', border: 'none', color: '#AFA9EC', fontSize: 13, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Cookie Policy
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline}
          style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', color: '#9e9e9a', border: '0.5px solid rgba(255,255,255,0.15)', fontSize: 13, cursor: 'pointer' }}>
          Decline
        </button>
        <button onClick={accept}
          style={{ padding: '7px 14px', borderRadius: 8, background: '#fff', color: '#1a1a18', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Accept
        </button>
      </div>
    </div>
  )
}