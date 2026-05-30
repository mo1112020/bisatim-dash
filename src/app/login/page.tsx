import { login } from '@/app/auth/actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dash-bg)' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--dash-black)' }}>Bisatim</h1>
          <p style={{ marginTop: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--dash-muted)' }}>Dashboard</p>
        </div>
        <form action={login} className="dash-form-panel" style={{ padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <label>Email</label>
            <input type="email" name="email" required autoFocus />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          {error && <p style={{ marginBottom: 16, fontSize: 12, color: '#dc2626' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
