import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0', marginTop: 48, fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginBottom: 14 }}>
        {[
          { label: 'Privacy Policy', path: '/privacy' },
          { label: 'Terms of Service', path: '/terms' },
          { label: 'Cookie Policy', path: '/cookies' },
          { label: 'Security', path: '/security' },
        ].map(l => (
          <button key={l.path} onClick={() => navigate(l.path)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--pink)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)', lineHeight: 1.6 }}>
        Specter {year}. Email confirmation is required to create an account. Confirmation emails are sent via Resend and are limited to 3,000 per month on the free tier. If you do not receive a confirmation email, please wait a few minutes and try again.
      </div>
    </footer>
  )
}