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
  // Reset password modal state
  const [showResetPasswordBox, setShowResetPasswordBox] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetPasswordMsg, setResetPasswordMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetPassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setResetPasswordMsg('All fields are required.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetPasswordMsg('New passwords do not match.');
      return;
    }
    setShowResetConfirm(true);
  };

  const confirmResetPassword = async () => {
    // Replace with backend call if needed
    setResetPasswordMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowResetConfirm(false);
    setTimeout(() => setResetPasswordMsg(''), 3000);
    setShowResetPasswordBox(false);
  };

  const cancelResetPassword = () => {
    setShowResetConfirm(false);
  };
  const [emailChangeCount, setEmailChangeCount] = useState(() => {
    const count = localStorage.getItem('emailChangeCount');
    return count ? parseInt(count, 10) : 0;
  });
  const [email, setEmail] = useState(() => {
    const user = localStorage.getItem('mockUser');
    try {
      return user ? JSON.parse(user).email || '' : '';
    } catch {
      return '';
    }
  });
  const [newEmail, setNewEmail] = useState('');
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const handleEmailUpdate = () => {
    if (emailChangeCount >= 3) {
      setUpdateMsg('You have reached the maximum number of email changes.');
      return;
    }
    if (!newEmail.trim()) {
      setUpdateMsg('Email cannot be empty.');
      return;
    }
    setShowEmailConfirm(true);
  };

  const confirmEmailChange = () => {
    setEmail(newEmail);
    // Update localStorage mockUser
    const user = localStorage.getItem('mockUser');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        userObj.email = newEmail;
        localStorage.setItem('mockUser', JSON.stringify(userObj));
      } catch {}
    }
    const newCount = emailChangeCount + 1;
    setEmailChangeCount(newCount);
    localStorage.setItem('emailChangeCount', newCount.toString());
    setUpdateMsg('Email updated successfully!');
    setShowEmailConfirm(false);
    setNewEmail('');
    setTimeout(() => setUpdateMsg(''), 2000);
  };

  const cancelEmailChange = () => {
    setShowEmailConfirm(false);
  };
  const [openTab, setOpenTab] = useState<'profile' | 'notifications' | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [username, setUsername] = useState(() => {
    const user = localStorage.getItem('mockUser');
    try {
      return user ? JSON.parse(user).username || '' : '';
    } catch {
      return '';
    }
  });
  const [newUsername, setNewUsername] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [showUpdatedBox, setShowUpdatedBox] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [showUsernameConfirm, setShowUsernameConfirm] = useState(false);
  const [changeCount, setChangeCount] = useState(() => {
    const count = localStorage.getItem('usernameChangeCount');
    return count ? parseInt(count, 10) : 0;
  });
  React.useEffect(() => {
    if (redirect) {
      window.location.replace('/');
    }
  }, [redirect]);
  const handleDelete = () => {
    setShowConfirm(true);
  };
  const confirmDelete = () => {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserLoggedIn');
    setShowConfirm(false);
    setRedirect(true);
  };
  const cancelDelete = () => {
    setShowConfirm(false);
  };
  const handleUsernameUpdate = () => {
    if (changeCount >= 3) {
      setUpdateMsg('You have reached the maximum number of username changes.');
      return;
    }
    if (!newUsername.trim()) {
      setUpdateMsg('Username cannot be empty.');
      return;
    }
    setShowUsernameConfirm(true);
  };

  const confirmUsernameChange = () => {
    setUsername(newUsername);
    // Update localStorage mockUser
    const user = localStorage.getItem('mockUser');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        userObj.username = newUsername;
        localStorage.setItem('mockUser', JSON.stringify(userObj));
      } catch {}
    }
    const newCount = changeCount + 1;
    setChangeCount(newCount);
    localStorage.setItem('usernameChangeCount', newCount.toString());
    setUpdateMsg('Username updated successfully!');
    setShowUpdatedBox(true);
    setNewUsername('');
    setShowUsernameConfirm(false);
    setTimeout(() => setUpdateMsg(''), 2000);
  };

  const cancelUsernameChange = () => {
    setShowUsernameConfirm(false);
  };
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
        <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', textAlign: 'center'}}>
          Username: <span style={{color: '#1976d2'}}>{username}</span>
        </div>
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
            <div style={{ width: '85%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', position: 'relative' }}>
              <button style={linkStyle} onClick={() => { setShowUpdatedBox(!showUpdatedBox); setShowEmailBox(false); }}>Update Username</button>
              <button style={linkStyle} onClick={() => { setShowEmailBox(!showEmailBox); setShowUpdatedBox(false); }}>Update Email</button>
              <button style={linkStyle}>Change Profile Picture</button>
              <button style={linkStyle} onClick={() => { setShowResetPasswordBox(true); setShowUpdatedBox(false); setShowEmailBox(false); }}>Reset Password</button>
      {/* Reset Password Modal */}
      {showResetPasswordBox && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.04)',
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setShowResetPasswordBox(false);
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            padding: '40px',
            minWidth: '400px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}>
            <div style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center'}}>Reset Password</div>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #bbb',
                width: '80%',
                fontSize: '1.2rem',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #bbb',
                width: '80%',
                fontSize: '1.2rem',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #bbb',
                width: '80%',
                fontSize: '1.2rem',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            />
            <button style={{
              ...linkStyle,
              width: '80%',
              fontSize: '1.2rem',
              padding: '16px 0',
              textAlign: 'center',
            }} onClick={handleResetPassword}>Reset Password</button>
            {resetPasswordMsg && <div style={{color: '#d32f2f', fontWeight: 500, marginTop: '4px', textAlign: 'center'}}>{resetPasswordMsg}</div>}
            {showResetConfirm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                  textAlign: 'center',
                  minWidth: '320px',
                }}>
                  <div style={{fontSize: '1.2rem', color: '#1976d2', fontWeight: 700, marginBottom: '18px', textAlign: 'center'}}>
                    Are you sure you want to reset your password?
                  </div>
                  <button onClick={confirmResetPassword} style={{marginRight: '18px', padding: '10px 24px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer'}}>Yes, Reset</button>
                  <button onClick={cancelResetPassword} style={{padding: '10px 24px', background: '#eee', color: '#222', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer'}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
            onClick={handleDelete}
          >
            Delete Account
          </button>
          {showConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                textAlign: 'center',
                minWidth: '320px',
              }}>
                <div style={{fontSize: '1.2rem', color: '#d32f2f', fontWeight: 700, marginBottom: '18px'}}>
                  Are you sure? Deleting your account is <span style={{textDecoration: 'underline'}}>permanent</span>.
                </div>
                <button onClick={confirmDelete} style={{marginRight: '18px', padding: '10px 24px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer'}}>Yes, Delete</button>
                <button onClick={cancelDelete} style={{padding: '10px 24px', background: '#eee', color: '#222', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer'}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </aside>
      <main style={contentStyle}>
  {showUpdatedBox && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            padding: '40px',
            minWidth: '400px',
            textAlign: 'center',
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}>
            {/* Username update box */}
            <div style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px'}}>Enter New Username</div>
            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #bbb',
                width: '80%',
                fontSize: '1.2rem',
                marginBottom: '12px',
              }}
              disabled={changeCount >= 3}
            />
            <button style={{
              ...linkStyle,
              width: '80%',
              fontSize: '1.2rem',
              padding: '16px 0',
            }} onClick={handleUsernameUpdate} disabled={changeCount >= 3}>Update Username</button>
            {updateMsg && <div style={{color: '#1976d2', fontWeight: 500, marginTop: '4px'}}>{updateMsg}</div>}
            <div style={{
              color: '#d32f2f',
              fontWeight: 600,
              textDecoration: 'underline',
              fontSize: '1rem',
              marginTop: '8px',
            }}>
              Username changes left: {3 - changeCount}
            </div>
            {showUsernameConfirm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                  textAlign: 'center',
                  minWidth: '320px',
                }}>
                  <div style={{fontSize: '1.2rem', color: '#1976d2', fontWeight: 700, marginBottom: '18px'}}>
                    Are you sure you want to change your username to <span style={{textDecoration: 'underline'}}>{newUsername}</span>?
                  </div>
                  <button onClick={confirmUsernameChange} style={{marginRight: '18px', padding: '10px 24px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer'}}>Yes, Change</button>
                  <button onClick={cancelUsernameChange} style={{padding: '10px 24px', background: '#eee', color: '#222', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer'}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
        {showEmailBox && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            padding: '40px',
            minWidth: '400px',
            textAlign: 'center',
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}>
            {/* Email update box */}
            <div style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px'}}>Enter New Email</div>
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #bbb',
                width: '80%',
                fontSize: '1.2rem',
                marginBottom: '12px',
              }}
              disabled={emailChangeCount >= 3}
            />
            <button style={{
              ...linkStyle,
              width: '80%',
              fontSize: '1.2rem',
              padding: '16px 0',
            }} onClick={handleEmailUpdate} disabled={emailChangeCount >= 3}>Update Email</button>
            <div style={{
              color: '#1976d2',
              fontWeight: 600,
              textDecoration: 'underline',
              fontSize: '1rem',
              marginTop: '8px',
            }}>
              Current email: {email}
            </div>
            <div style={{
              color: '#d32f2f',
              fontWeight: 600,
              textDecoration: 'underline',
              fontSize: '1rem',
              marginTop: '8px',
            }}>
              Email changes left: {3 - emailChangeCount}
            </div>
            {showEmailConfirm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                  textAlign: 'center',
                  minWidth: '320px',
                }}>
                  <div style={{fontSize: '1.2rem', color: '#1976d2', fontWeight: 700, marginBottom: '18px'}}>
                    Are you sure you want to change your email to <span style={{textDecoration: 'underline'}}>{newEmail}</span>?
                  </div>
                  <button onClick={confirmEmailChange} style={{marginRight: '18px', padding: '10px 24px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer'}}>Yes, Change</button>
                  <button onClick={cancelEmailChange} style={{padding: '10px 24px', background: '#eee', color: '#222', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer'}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
  )}
      </main>
    </div>
  );
};

export default UserSettings;
