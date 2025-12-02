import React, { useState, useEffect } from 'react';

const sidebarStyle: React.CSSProperties = {
  height: 'auto',
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

  // Profile picture state
  const [showProfilePicBox, setShowProfilePicBox] = useState(false);
  const [profilePic, setProfilePic] = useState<string>('/default-profile.webp');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Notification preferences state
  const [pushNotifications, setPushNotifications] = useState(() => {
    return localStorage.getItem('push_notifications') === 'true';
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('email_notifications') === 'true';
  });
  const [smsNotifications, setSmsNotifications] = useState(() => {
    return localStorage.getItem('sms_notifications') === 'true';
  });
  const [inAppNotifications, setInAppNotifications] = useState(() => {
    return localStorage.getItem('in_app_notifications') !== 'false'; // default true
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem('notification_phone_number') || '';
  });

  // Load profile picture on mount
  useEffect(() => {
    const savedProfilePic = localStorage.getItem('profile_picture');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }
  }, []);

  // Profile picture handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadMsg('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfilePic(result);
      localStorage.setItem('profile_picture', result);
      setUploadMsg('Profile picture updated successfully!');
      // Trigger a custom event so NavBar updates
      window.dispatchEvent(new Event('profile-picture-changed'));
      setTimeout(() => {
        setUploadMsg('');
        setShowProfilePicBox(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePic('/default-profile.webp');
    localStorage.setItem('profile_picture', '/default-profile.webp');
    setUploadMsg('Profile picture removed');
    window.dispatchEvent(new Event('profile-picture-changed'));
    setTimeout(() => {
      setUploadMsg('');
    }, 2000);
  };

  // Notification toggle handlers
  const togglePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem('push_notifications', String(newValue));
  };

  const toggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem('email_notifications', String(newValue));
  };

  const toggleSmsNotifications = () => {
    const newValue = !smsNotifications;
    setSmsNotifications(newValue);
    localStorage.setItem('sms_notifications', String(newValue));
  };

  const toggleInAppNotifications = () => {
    const newValue = !inAppNotifications;
    setInAppNotifications(newValue);
    localStorage.setItem('in_app_notifications', String(newValue));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    localStorage.setItem('notification_phone_number', value);
  };

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
    const user_id = localStorage.getItem('user_id')
    try {
      // Call backend to update password
  const response = await fetch(`/api/users/${user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
        credentials: 'include',
      });
      if (response.ok) {
        // Update localStorage mockUser
        const user = localStorage.getItem('mockUser');
        if (user) {
          try {
            const userObj = JSON.parse(user);
            userObj.password = newPassword;
            localStorage.setItem('mockUser', JSON.stringify(userObj));
          } catch {}
        }
        setResetPasswordMsg('Password updated successfully!');
      } else {
        setResetPasswordMsg('Failed to update password.');
      }
    } catch (err) {
      setResetPasswordMsg('Error updating password.');
    }
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

  const confirmEmailChange = async () => {
    const user_id = localStorage.getItem('user_id')
    try {
      // Call backend to update email
  const response = await fetch(`/api/users/${user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
        credentials: 'include',
      });
      if (response.ok) {
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
      } else {
        setUpdateMsg('Failed to update email.');
      }
    } catch (err) {
      setUpdateMsg('Error updating email.');
    }
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
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernamePassword, setUsernamePassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [showUpdatedBox, setShowUpdatedBox] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [showUsernameConfirm, setShowUsernameConfirm] = useState(false);
  const [changeCount, setChangeCount] = useState(() => {
    const count = localStorage.getItem('usernameChangeCount');
    return count ? parseInt(count, 10) : 0;
  });

  // Load username from user_data on mount
  React.useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.username) {
          setUsername(user.username);
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  React.useEffect(() => {
    if (redirect) {
      window.location.replace('/');
    }
  }, [redirect]);
  const handleDelete = () => {
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    try {
      // Prefer an explicit user identifier or token when present
      const storedId = localStorage.getItem('user_id');
      const mockUser = localStorage.getItem('mockUser');
      let userId: string | null = null;
      if (storedId) {
        try { userId = JSON.parse(storedId); } catch { userId = storedId; }
      } else if (mockUser) {
        try { userId = JSON.parse(mockUser).id || JSON.parse(mockUser).user_id || null; } catch { userId = null; }
      }

      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/users/${storedId}`, {
        method: 'DELETE',
        headers,
        // send id in body only if endpoint expects it
        body: userId ? undefined : JSON.stringify({ user_id: userId }),
        mode: 'cors',
      });

      if (response.ok) {
        console.log('✅ Account permanently deleted from server');
        
        // Remove all user info from localStorage
        try {
          // Record a local marker so this client will block sign-in attempts for this account
          const userRaw = localStorage.getItem('mockUser');
          const userData = localStorage.getItem('user_data');
          let identifiers: string[] = [];
          
          // Get identifiers from mockUser
          if (userRaw) {
            try {
              const u = JSON.parse(userRaw);
              if (u.id) identifiers.push(String(u.id));
              if (u.user_id) identifiers.push(String(u.user_id));
              if (u.username) identifiers.push(String(u.username));
              if (u.email) identifiers.push(String(u.email));
            } catch {
              identifiers.push(userRaw);
            }
          }
          
          // Get identifiers from user_data
          if (userData) {
            try {
              const u = JSON.parse(userData);
              if (u.id) identifiers.push(String(u.id));
              if (u.user_id) identifiers.push(String(u.user_id));
              if (u.username) identifiers.push(String(u.username));
              if (u.email) identifiers.push(String(u.email));
            } catch {}
          }
          
          const stored = localStorage.getItem('deleted_accounts');
          let arr: string[] = [];
          try { arr = stored ? JSON.parse(stored) : []; } catch { arr = []; }
          identifiers.forEach(id => {
            if (id && !arr.includes(id)) arr.push(id);
          });
          localStorage.setItem('deleted_accounts', JSON.stringify(arr));
          
          console.log('🚫 Blocked identifiers from future login:', identifiers);
        } catch (e) {
          // ignore localStorage errors
        }

        // COMPLETELY REMOVE ALL USER DATA FROM LOCAL STORAGE
        console.log('🧹 Scrubbing all user data from localStorage...');
        localStorage.removeItem('mockUser');
        localStorage.removeItem('user_data');
        localStorage.removeItem('mockUserLoggedIn');
        localStorage.removeItem('usernameChangeCount');
        localStorage.removeItem('emailChangeCount');
        localStorage.removeItem('user_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('profilePicture');
        localStorage.removeItem('pushNotifications');
        localStorage.removeItem('emailNotifications');
        localStorage.removeItem('smsNotifications');
        localStorage.removeItem('inAppNotifications');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('notifications');
        
        console.log('✅ Account completely scrubbed. User must create a new account to access the system.');
      } else {
        // Optionally read error message from backend
        const text = await response.text().catch(() => '');
        // eslint-disable-next-line no-console
        console.error('Delete failed:', response.status, text);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error deleting account:', err);
    }
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
    if (!usernamePassword.trim()) {
      setUpdateMsg('Password is required to change username.');
      return;
    }
    setShowUsernameConfirm(true);
  };

  const confirmUsernameChange = async () => {
    const userIdStr = localStorage.getItem('user_id');
    if (!userIdStr) {
      setUpdateMsg('User not logged in.');
      setShowUsernameConfirm(false);
      return;
    }
    
    const user_id = JSON.parse(userIdStr);
    
    try {
      // Call new backend endpoint to update username with password verification
      const response = await fetch('/api/users/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id,
          currentPassword: usernamePassword,
          newUsername: newUsername.trim()
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Completely replace old username with new one
        setUsername(data.newUsername);
        
        // Update localStorage user_data
        const userData = localStorage.getItem('user_data');
        if (userData) {
          try {
            const userObj = JSON.parse(userData);
            userObj.username = data.newUsername;
            localStorage.setItem('user_data', JSON.stringify(userObj));
          } catch {}
        }

        // Also update mockUser if it exists (for backward compatibility)
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          try {
            const userObj = JSON.parse(mockUser);
            userObj.username = data.newUsername;
            localStorage.setItem('mockUser', JSON.stringify(userObj));
          } catch {}
        }
        
        const newCount = changeCount + 1;
        setChangeCount(newCount);
        localStorage.setItem('usernameChangeCount', newCount.toString());
        setUpdateMsg('Username permanently updated! Old username can no longer be used.');
        setUsernamePassword(''); // Clear password field
      } else if (response.status === 401) {
        if (data.message && data.message.includes('already taken')) {
          setUpdateMsg('Username is already taken. Please choose another.');
        } else {
          setUpdateMsg('Incorrect password.');
        }
      } else {
        setUpdateMsg(data.message || 'Failed to update username.');
      }
    } catch (err) {
      console.error('Error updating username:', err);
      setUpdateMsg('Network error: unable to reach the server.');
    }
    setShowUpdatedBox(true);
    setNewUsername('');
    setShowUsernameConfirm(false);
    setTimeout(() => setUpdateMsg(''), 3000);
  };

  const cancelUsernameChange = () => {
    setShowUsernameConfirm(false);
    setUsernamePassword('');
  };
  // derive a display username from state or localStorage as a fallback
  const displayedUsername = React.useMemo(() => {
    if (username && username.trim()) return username;
    
    // Try user_data first (primary source)
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        if (u.username) return u.username;
      } catch {}
    }
    
    // Fallback to mockUser or user
    const userRaw = localStorage.getItem('mockUser') || localStorage.getItem('user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        return u.username || u.email || u.id || u.user_id || '';
      } catch {
        return String(userRaw);
      }
    }
    return '';
  }, [username]);
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        height: 'auto',
        overflow: 'auto',
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
          Username: <span style={{color: '#FF8C42'}}>{displayedUsername || '(not set)'}</span>
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
            <div style={{ width: '85%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
              
              {/* Push Notifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>Push Notifications</span>
                <button
                  onClick={togglePushNotifications}
                  style={{
                    width: '60px',
                    height: '30px',
                    borderRadius: '15px',
                    border: 'none',
                    background: pushNotifications ? '#FF8C42' : '#ccc',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: pushNotifications ? '32px' : '2px',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>

              {/* Email Notifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>Email Notifications</span>
                <button
                  onClick={toggleEmailNotifications}
                  style={{
                    width: '60px',
                    height: '30px',
                    borderRadius: '15px',
                    border: 'none',
                    background: emailNotifications ? '#FF8C42' : '#ccc',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: emailNotifications ? '32px' : '2px',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>

              {/* SMS Notifications */}
              <div style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>SMS Notifications</span>
                  <button
                    onClick={toggleSmsNotifications}
                    style={{
                      width: '60px',
                      height: '30px',
                      borderRadius: '15px',
                      border: 'none',
                      background: smsNotifications ? '#FF8C42' : '#ccc',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: '2px',
                      left: smsNotifications ? '32px' : '2px',
                      transition: 'left 0.3s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
                {smsNotifications && (
                  <div style={{ marginTop: '8px' }}>
                    {phoneNumber ? (
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px',
                          background: '#e8f5e9',
                          borderRadius: '6px',
                          color: '#2e7d32',
                          fontSize: '1rem',
                          fontWeight: 500,
                        }}>
                          <span>Number Accepted ✓</span>
                          <span style={{ marginLeft: 'auto', color: '#666' }}>({phoneNumber})</span>
                        </div>
                        <button
                          onClick={() => {
                            setPhoneNumber('');
                            localStorage.removeItem('phoneNumber');
                          }}
                          style={{
                            marginTop: '6px',
                            fontSize: '0.75rem',
                            color: '#d32f2f',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0,
                          }}
                        >
                          Change number
                        </button>
                      </div>
                    ) : (
                      <>
                        <label style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '6px' }}>
                          Phone Number:
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* In-App Notifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>In-App Notifications</span>
                <button
                  onClick={toggleInAppNotifications}
                  style={{
                    width: '60px',
                    height: '30px',
                    borderRadius: '15px',
                    border: 'none',
                    background: inAppNotifications ? '#FF8C42' : '#ccc',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: inAppNotifications ? '32px' : '2px',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>

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
              <button style={linkStyle} onClick={() => { setShowProfilePicBox(true); setShowResetPasswordBox(false); setShowUpdatedBox(false); setShowEmailBox(false); }}>📷 Change Profile Picture</button>
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

      {/* Profile Picture Upload Box */}
      {showProfilePicBox && (
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
            if (e.target === e.currentTarget) setShowProfilePicBox(false);
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            padding: '40px',
            minWidth: '500px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}>
            <div style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px'}}>Change Profile Picture</div>
            
            {/* Current Profile Picture Preview */}
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #FF8C42',
              marginBottom: '12px',
            }}>
              <img 
                src={profilePic} 
                alt="Profile Preview" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-profile.webp';
                }}
              />
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                width: '80%',
                padding: '40px',
                border: isDragging ? '3px dashed #FF8C42' : '2px dashed #bbb',
                borderRadius: '12px',
                background: isDragging ? 'rgba(255,140,66,0.1)' : 'rgba(240,240,240,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#666'}}>
                Drag & Drop your image here
              </div>
              <div style={{fontSize: '0.9rem', color: '#999', marginBottom: '16px'}}>
                or
              </div>
              <label htmlFor="profile-upload" style={{
                padding: '12px 24px',
                background: '#FF8C42',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'background 0.2s',
              }}>
                Choose File
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
              <button 
                onClick={removeProfilePicture}
                style={{
                  padding: '12px 24px',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Remove Picture
              </button>
              <button 
                onClick={() => setShowProfilePicBox(false)}
                style={{
                  padding: '12px 24px',
                  background: '#eee',
                  color: '#222',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>

            {uploadMsg && (
              <div style={{
                color: uploadMsg.includes('success') || uploadMsg.includes('removed') ? '#1976d2' : '#d32f2f',
                fontWeight: 600,
                marginTop: '12px',
                fontSize: '1.1rem',
              }}>
                {uploadMsg}
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
                minWidth: '380px',
                maxWidth: '450px',
              }}>
                <div style={{fontSize: '1.4rem', color: '#d32f2f', fontWeight: 700, marginBottom: '18px'}}>
                  ⚠️ PERMANENT DELETION ⚠️
                </div>
                <div style={{fontSize: '1.1rem', color: '#d32f2f', fontWeight: 600, marginBottom: '16px', textDecoration: 'underline'}}>
                  Are you absolutely sure?
                </div>
                <div style={{
                  fontSize: '0.95rem', 
                  color: '#333', 
                  marginBottom: '20px', 
                  lineHeight: '1.6',
                  textAlign: 'left',
                  padding: '16px',
                  background: '#fff3e0',
                  borderRadius: '8px',
                  border: '2px solid #ff9800',
                }}>
                  <strong style={{display: 'block', marginBottom: '8px', color: '#d32f2f'}}>This action will:</strong>
                  <ul style={{margin: 0, paddingLeft: '20px', textAlign: 'left'}}>
                    <li><strong>Permanently delete</strong> your username</li>
                    <li><strong>Permanently delete</strong> your password</li>
                    <li><strong>Permanently delete</strong> your email</li>
                    <li><strong>Permanently delete</strong> all account data</li>
                    <li><strong>Cannot be undone or recovered</strong></li>
                  </ul>
                  <div style={{marginTop: '12px', fontWeight: 600, color: '#d32f2f'}}>
                    You will need to create a completely new account to use this system again.
                  </div>
                </div>
                <button onClick={confirmDelete} style={{marginRight: '18px', padding: '12px 28px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem'}}>Yes, Permanently Delete</button>
                <button onClick={cancelDelete} style={{padding: '12px 28px', background: '#eee', color: '#222', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem'}}>Cancel</button>
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
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={usernamePassword}
              onChange={e => setUsernamePassword(e.target.value)}
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
            <div style={{
              padding: '12px',
              background: '#fff3e0',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#e65100',
              width: '80%',
              marginBottom: '12px',
            }}>
              <strong>⚠️ Important:</strong> Your old username will be <strong>permanently replaced</strong> and can no longer be used to log in.
            </div>
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
                  <div style={{fontSize: '0.9rem', color: '#d32f2f', marginBottom: '18px', fontWeight: 500}}>
                    Your old username will be permanently removed and can no longer be used to log in.
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
