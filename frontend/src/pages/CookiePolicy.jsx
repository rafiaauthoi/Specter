import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function CookiePolicy() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
        Back
      </button>

      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Cookie Policy</h1>
      <p style={{ fontSize: 12, color: '#9e9e9a', marginBottom: 32 }}>Last updated: June 2026</p>

      {[
        {
          title: '1. What we use instead of cookies',
          body: 'Clearprint does not use tracking cookies, advertising cookies, or third-party analytics cookies. Instead of cookies, we use your browser\'s localStorage to store your session token and user ID locally on your device. This data never leaves your device except as part of authenticated API requests to our backend.'
        },
        {
          title: '2. What is stored in localStorage',
          body: 'When you log in, Clearprint stores two values in your browser\'s localStorage: your session access token (a JWT issued by Supabase Auth) and your user ID. These are used to keep you logged in across page refreshes and to identify your requests to the backend. They are not used for tracking or advertising.'
        },
        {
          title: '3. How long it is stored',
          body: 'Your session token and user ID remain in localStorage until you log out or manually clear your browser storage. Supabase session tokens expire after one hour by default, after which you will be asked to log in again. We do not set any expiry on the localStorage values themselves.'
        },
        {
          title: '4. Third-party cookies',
          body: 'Clearprint does not load any third-party scripts, advertising networks, or analytics platforms that would set their own cookies. When you connect a Google account, you are redirected to Google\'s own OAuth page, which may set cookies under Google\'s domain governed by Google\'s own cookie and privacy policies.'
        },
        {
          title: '5. Essential vs non-essential storage',
          body: 'The localStorage values we use are strictly essential to the functioning of the app. Without them, you would be unable to stay logged in or use any authenticated features. We do not use any non-essential or optional storage for personalization, preferences, or analytics.'
        },
        {
          title: '6. Your choices',
          body: 'You can clear your localStorage at any time through your browser\'s developer tools or privacy settings. Doing so will log you out of Clearprint. You can also log out using the logout option in the app, which clears these values automatically. Since we do not use tracking cookies, there is no cookie consent opt-out needed beyond what is described here.'
        },
        {
          title: '7. Email delivery',
          body: 'Confirmation emails are sent via Resend using the sender address onboarding@resend.dev. Resend is limited to 3,000 emails per month on the free tier. If you do not receive a confirmation email, please wait a few minutes and try again. This limit applies across all users of the service.'
        },
        {
          title: '8. Contact',
          body: 'For questions about how we handle browser storage or cookies, contact us at privacy@clearprint.app. Note that until a custom domain is configured, this address may not be active. Please check the site for current contact information.'
        },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ fontSize: 13, color: '#4a4a47', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
        </div>
      ))}

      <Footer />
    </div>
  )
}