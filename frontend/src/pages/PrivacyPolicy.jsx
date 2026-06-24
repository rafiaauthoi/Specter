import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-logo">Specter</span>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Back
        </button>
      </nav>

      <div className="page">
        <h1 className="section-title">Privacy Policy</h1>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 32 }}>Last updated: June 2026</p>

        {[
          {
            title: '1. What Specter does',
            body: 'Specter is a digital footprint cleanup tool. It connects to your accounts via OAuth, scans for data you may want to remove, and helps you delete or opt out of that data. Specter does not sell, share, or monetize your personal information in any form.'
          },
          {
            title: '2. What data we collect',
            body: 'We collect your email address when you create an account. When you connect a third-party account such as Google, we store an encrypted OAuth access token and refresh token so we can perform scans on your behalf. We also store the results of those scans, including sender names and email counts from your Gmail inbox, in our database. We do not store the full content of your emails.'
          },
          {
            title: '3. How we use your data',
            body: 'Your email is used solely to identify your account. Your OAuth tokens are used solely to call the APIs of platforms you explicitly connect. Scan results are stored so you can view your history across sessions. None of this data is used for advertising, analytics, or any purpose beyond the core function of the app.'
          },
          {
            title: '4. How we protect your data',
            body: 'OAuth tokens are encrypted at rest using AES-256 encryption before being stored in our database. Your account password is never stored by Specter. Authentication is handled by Supabase, which uses bcrypt hashing for passwords. We use HTTPS for all data in transit. We do not log OAuth tokens or API responses.'
          },
          {
            title: '5. Third-party services',
            body: 'Specter uses Supabase for authentication and database storage, Resend for transactional email delivery, and Google APIs for Gmail scanning. Each of these services has its own privacy policy. We only share the minimum data necessary with each provider to perform the requested function.'
          },
          {
            title: '6. Data retention',
            body: 'Your account data and scan results are retained for as long as your account is active. You can request deletion of your account and all associated data by contacting us. Upon deletion, your encrypted tokens and scan results will be permanently removed from our database within 30 days.'
          },
          {
            title: '7. Your rights',
            body: 'Depending on your location, you may have rights under applicable privacy laws including the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email listed below. We will respond within 30 days.'
          },
          {
            title: '8. Contact',
            body: 'For any privacy-related questions or requests, contact us at privacy@Specter.app. Note that until a custom domain is configured, this address may not be active. Please check the site for current contact information.'
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--pink)', marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
          </div>
        ))}

        <Footer />
      </div>
    </div>
  )
}