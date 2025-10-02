import React, { useState } from 'react';

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


const UserSettings = () => {
  const [openTab, setOpenTab] = useState<'profile' | 'notifications' | null>(null);
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        backgroundImage: "url('/home-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
      }}
    >
      <aside style={sidebarStyle}>
        <div style={headerStyle}>⚙️ User Settings</div>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1}}>
          <button
            style={{
              width: '85%',
              margin: '18px auto',
              padding: '18px 0',
              color: '#222',
              fontSize: '1.1rem',
              fontWeight: 500,
              border: '1px solid #1976d2',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
            onClick={() => setOpenTab(openTab === 'notifications' ? null : 'notifications')}
          >
            Notification Preferences
          </button>
          {openTab === 'notifications' && (
            <div style={{ width: '85%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <button style={linkStyle}>Push Notifications</button>
              <button style={linkStyle}>Email Notifications</button>
              <button style={linkStyle}>SMS Notifications</button>
              <button style={linkStyle}>In-App Notifications</button>
            </div>
          )}
          <button
            style={{
              width: '85%',
              margin: '18px auto',
              padding: '18px 0',
              color: '#222',
              fontSize: '1.1rem',
              fontWeight: 500,
              border: '1px solid #1976d2',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
            onClick={() => setOpenTab(openTab === 'profile' ? null : 'profile')}
          >
            Profile Management
          </button>
          {openTab === 'profile' && (
            <div style={{ width: '85%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <button style={linkStyle}>Update Name</button>
              <button style={linkStyle}>Update Email</button>
              <button style={linkStyle}>Change Profile Picture</button>
              <button style={linkStyle}>Reset Password</button>
            </div>
          )}
        </div>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', marginBottom: '32px'}}>
          <button
            style={{
              width: '85%',
              padding: '18px 0',
              color: '#d32f2f',
              fontSize: '1.1rem',
              fontWeight: 700,
              border: '1.5px solid #d32f2f',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
              cursor: 'pointer',
              textDecoration: 'underline',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
          >
            Delete Account
          </button>
        </div>
      </aside>
      <main style={contentStyle}>
        {/* <Outlet /> */}
      </main>
    </div>
  );
};

export default UserSettings;
