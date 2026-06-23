import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '0.5px solid rgba(0,0,0,0.08)',
      padding: '24px',
      marginTop: '48px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: 12, color: '#6b6b67' }}>
          <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 12, cursor: 'pointer', padding: 0 }}>Privacy Policy</button>
          <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 12, cursor: 'pointer', padding: 0 }}>Terms of Service</button>
          <button onClick={() => navigate('/cookies')} style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 12, cursor: 'pointer', padding: 0 }}>Cookie Policy</button>
          <button onClick={() => navigate('/security')} style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 12, cursor: 'pointer', padding: 0 }}>Security</button>
        </div>

        <div style={{ fontSize: 11, color: '#9e9e9a' }}>
          Clearprint {year}. Email confirmation is required to create an account. Confirmation emails are sent via Resend and are limited to 3,000 per month on the free tier. If you do not receive a confirmation email, please wait a few minutes and try again.
        </div>

      </div>
    </footer>
  )
}