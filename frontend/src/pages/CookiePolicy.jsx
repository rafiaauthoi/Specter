import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function CookiePolicy() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-logo">clearprint</span>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Back
        </button>
      </nav>

      <div className="page">
        <h1 className="section-title">Cookie Policy</h1>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 32 }}>Last updated: June 2026</p>

        {[
          {
            title: '1. What we use instead of cookies',
            body: "Clearprint does not use tracking cookies, advertising cookies, or third-party analytics cookies. Instead of cookies, we use your browser's localStorage to store your session token and user ID locally on your device. This data never leaves your device except as part of authenticated API requests to our backend."
          },
          {
            title: '2. What is stored in localStorage',
            body: "When you log in, Clearprint stores two values in your browser's localStorage: your session access token (a JWT issued by Supabase Auth) and your user ID. These are used to keep you logged in across page refreshes and to identify your requests to the backend. They are not used for tracking or advertising."
          },
          {
            title: '3. How long it is stored',
            body: 'Your session token and user ID remain in localStorage until you log out or manually clear your browser storage. Supabase session tokens expire after one hour by default, after which you will be asked to log in again.'
          },
          {
            title: '4. Third-party cookies',
            body: "Clearprint does not load any third-party scripts, advertising networks, or analytics platforms that would set their own cookies. When you connect a Google account, you are redirected to Google's own OAuth page, which may set cookies under Google's domain governed by Google's own cookie and privacy policies."
          },
          {
            title: '5. Essential vs non-essential storage',
            body: 'The localStorage values we use are strictly essential to the functioning of the app. Without them, you would be unable to stay logged in or use any authenticated features. We do not use any non-essential or optional storage for personalization, preferences, or analytics.'
          },
          {
            title: '6. Your choices',
            body: "You can clear your localStorage at any time through your browser's developer tools or privacy settings. Doing so will log you out of Clearprint. You can also log out using the sign out option in the app, which clears these values automatically."
          },
          {
            title: '7. Email delivery',
            body: 'Confirmation emails are sent via Resend using the sender address onboarding@resend.dev. Resend is limited to 3,000 emails per month on the free tier. If you do not receive a confirmation email, please wait a few minutes and try again.'
          },
          {
            title: '8. Contact',
            body: 'For questions about how we handle browser storage or cookies, contact us at privacy@clearprint.app. Note that until a custom domain is configured, this address may not be active.'
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