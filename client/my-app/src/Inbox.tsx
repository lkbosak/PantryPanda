import React, { useEffect, useState } from 'react';

type Notification = {
  id: string;
  message: string;
  timestamp: number;
};

const Inbox: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);
  // unread count is persisted to localStorage so NavBar can read it too
  const UNREAD_KEY = 'inbox_unread';

  useEffect(() => {
    // mark inbox as read when opened (user is viewing the inbox)
    try {
      localStorage.setItem(UNREAD_KEY, '0');
      window.dispatchEvent(new CustomEvent('inbox-unread', { detail: { unread: 0 } }));
    } catch (e) {
      // ignore
    }

    // fetch persisted notifications from backend on mount
    (async () => {
      try {
        const storedId = localStorage.getItem('user_id');
        const mockUser = localStorage.getItem('mockUser');
        let userId: string | null = null;
        if (storedId) {
          try { userId = JSON.parse(storedId); } catch { userId = storedId; }
        } else if (mockUser) {
          try { userId = JSON.parse(mockUser).id || JSON.parse(mockUser).user_id || null; } catch { userId = null; }
        }
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const url = userId
          ? `https://pantrypanda-backend.onrender.com/notifications?user_id=${encodeURIComponent(String(userId))}`
          : 'https://pantrypanda-backend.onrender.com/notifications';
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          mode: 'cors',
        });
        if (res.ok) {
          const list = await res.json().catch(() => []);
          if (Array.isArray(list)) {
            const mapped = list.map((n: any) => ({ id: n.id || String(n.timestamp || Math.random()), message: n.message || n.text || JSON.stringify(n), timestamp: n.timestamp || Date.now() }));
            setNotifications(prev => [...mapped.reverse(), ...prev]);
            // don't increment unread here because opening the inbox marks them read
          }
        }
      } catch (e) {
        // ignore fetch errors
        // eslint-disable-next-line no-console
        console.debug('Failed to fetch notifications:', e);
      }
    })();

    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const detail = ev.detail || {};
      let msg = '';
      if (detail.action === 'add') {
        const name = detail.item?.name || detail.item?.product_name || 'item';
        const cat = detail.item?.category || 'the pantry';
        const count = detail.categoryCount ?? null;
        msg = `New item (${name}) was added. You now have ${count ?? 'some'} in ${cat}.`;
      } else if (detail.action === 'remove') {
        const name = detail.item?.name || 'item';
        const cat = detail.item?.category || 'the pantry';
        const remaining = detail.remainingCount ?? null;
        msg = `Item removed (${name}). You now have ${remaining ?? 'some'} left in ${cat}.`;
      } else {
        msg = 'Pantry updated.';
      }

      const n: Notification = { id: String(Date.now()) + Math.random().toString(36).slice(2,6), message: msg, timestamp: Date.now() };
      setNotifications(prev => [n, ...prev]);
      setToast(n);
      // increment unread counter persisted to localStorage and notify NavBar
      try {
        const prev = parseInt(localStorage.getItem(UNREAD_KEY) || '0', 10) || 0;
        const next = prev + 1;
        localStorage.setItem(UNREAD_KEY, String(next));
        window.dispatchEvent(new CustomEvent('inbox-unread', { detail: { unread: next } }));
      } catch (err) {
        // ignore
      }
      // auto-hide toast after 4s
      setTimeout(() => setToast(null), 4000);
    };

    window.addEventListener('pantry-change', handler as EventListener);
    return () => window.removeEventListener('pantry-change', handler as EventListener);
  }, []);

  // replicate settings page layout styles
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
        <div style={headerStyle}>📥 Inbox</div>
        <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', textAlign: 'center'}}>
          Notifications
        </div>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1}}>
          <button style={linkStyle}>All Notifications</button>
          <button style={linkStyle}>Unread</button>
          <button style={linkStyle}>Settings</button>
        </div>
      </aside>

      <main style={contentStyle}>
        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed',
            top: 84,
            right: 24,
            background: 'rgba(33,150,243,0.95)',
            color: 'white',
            padding: '12px 18px',
            borderRadius: 8,
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            zIndex: 4000,
            maxWidth: 360,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Notification</div>
            <div style={{ fontSize: '0.95rem' }}>{toast.message}</div>
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '12px', boxShadow: '0 8px 28px rgba(0,0,0,0.14)', padding: '24px', maxWidth: 920 }}>
          {notifications.length === 0 ? (
            <div style={{fontSize: '1.2rem', fontWeight: 600, color: '#222'}}>Your inbox is empty.</div>
          ) : (
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Recent notifications</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.map(n => (
                  <li key={n.id} style={{ padding: 12, borderRadius: 8, background: '#f6f7fb', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.95rem' }}>{n.message}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 6 }}>{new Date(n.timestamp).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Inbox;
