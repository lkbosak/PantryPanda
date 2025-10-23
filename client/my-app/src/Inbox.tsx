import React from 'react';

const Inbox: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      backgroundImage: "url('/main-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '72px',
    }}>
      <div style={{
        fontSize: '2.2rem',
        fontWeight: 900,
        color: '#1976d2',
        marginBottom: '32px',
        letterSpacing: '1px',
      }}>
        📥 Inbox
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        padding: '40px',
        minWidth: '400px',
        textAlign: 'center',
        marginTop: '24px',
      }}>
        <div style={{fontSize: '1.2rem', fontWeight: 600, color: '#222'}}>
          Your inbox is empty.
        </div>
        <div style={{fontSize: '1rem', color: '#888', marginTop: '12px'}}>
          Messages, notifications, and updates will appear here.
        </div>
      </div>
    </div>
  );
};

export default Inbox;
