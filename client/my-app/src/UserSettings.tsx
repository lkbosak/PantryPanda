import { Link, Outlet } from 'react-router-dom';

const sidebarStyle: React.CSSProperties = {
  height: '100vh',
  width: '240px',
  background: 'rgba(240,240,240,0.7)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  padding: '40px 0 0 0',
  boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
  zIndex: 1,
};

const linkStyle: React.CSSProperties = {
  display: 'block',
  width: '85%',
  margin: '18px auto',
  padding: '18px 0',
  color: '#222',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: 500,
  border: '1px solid #bbb',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.85)',
  textAlign: 'center' as const,
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  transition: 'background 0.2s',
};

const headerStyle: React.CSSProperties = {
  fontSize: '2.2rem',
  fontWeight: 900,
  margin: '0 0 40px 0',
  borderBottom: '3px solid #222',
  paddingBottom: '12px',
  width: '100%',
  letterSpacing: '1px',
  textAlign: 'center',
};

const contentStyle: React.CSSProperties = {
  marginLeft: '240px',
  padding: '48px',
  minHeight: '100vh',
  position: 'relative',
  zIndex: 2,
};

const UserSettings = () => (
  <div
    style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundImage: "url('/home-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
    }}
  >
    <aside style={sidebarStyle}>
      <div style={headerStyle}>⚙️ User Settings</div>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Link to="password" style={linkStyle}>Change Password</Link>
        <Link to="security" style={linkStyle}>Enhance Security</Link>
        <Link to="delete" style={linkStyle}>Delete Account</Link>
      </div>
    </aside>
    <main style={contentStyle}>
      <Outlet />
    </main>
  </div>
);

export default UserSettings;
