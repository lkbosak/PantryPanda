import React from 'react';


const UserSettings = () => (
  <div
    style={{
      backgroundImage: "url('/home-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '32px 48px',
        color: 'black',
        textAlign: 'left',
        fontSize: 'calc(10px + 2vmin)',
        maxWidth: '400px',
      }}
    >
      <h1 style={{margin: 0}}>User Settings</h1>
      <p style={{margin: 0}}>Manage your account settings here.</p>
    </div>
  </div>
);

export default UserSettings;
