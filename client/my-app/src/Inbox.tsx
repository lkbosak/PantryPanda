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

      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        padding: '24px',
        minWidth: '420px',
        textAlign: 'left',
        marginTop: '12px',
      }}>
        {notifications.length === 0 ? (
          <div style={{fontSize: '1.2rem', fontWeight: 600, color: '#222'}}>
            Your inbox is empty.
          </div>
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
    </div>
  );
};

export default Inbox;
