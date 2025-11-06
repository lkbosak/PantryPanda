// src/NavBar.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UNREAD_KEY = 'inbox_unread';

const NavBar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({
  isLoggedIn,
  onLogout,
}) => {
  const [unread, setUnread] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(UNREAD_KEY) || '0', 10) || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const val = ev?.detail?.unread;
      if (typeof val === 'number') setUnread(val);
      else {
        try {
          setUnread(parseInt(localStorage.getItem(UNREAD_KEY) || '0', 10) || 0);
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('inbox-unread', handler as EventListener);
    return () => window.removeEventListener('inbox-unread', handler as EventListener);
  }, []);

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #ffafbc94, #ffc3a08b)", // Gradient background
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        borderRadius: "8px", // Rounded corners
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: "flex", gap: "20px", alignItems: 'center' }}>
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            padding: "8px 12px",
            borderRadius: "4px",
            transition: "background 0.3s",
            fontSize: '1rem'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#ff7eb4a4")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          Home
        </Link>
        {isLoggedIn && (
          <>
            <Link
              to="/pantry"
              style={{
                fontWeight: "bold",
                padding: "8px 12px",
                borderRadius: "4px",
                transition: "background 0.3s",
                fontSize: '1rem'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ff7eb491")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Pantry
            </Link>
            <Link
              to="/settings"
              style={{
                fontWeight: "bold",
                padding: "8px 12px",
                borderRadius: "4px",
                transition: "background 0.3s",
                fontSize: '1rem'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ff7eb48f")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              User Settings
            </Link>
            <Link
              to="/inbox"
              style={{
                fontWeight: "bold",
                padding: "8px 12px",
                borderRadius: "4px",
                transition: "background 0.3s",
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                position: 'relative',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ff7eb48f")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span>📥 Inbox</span>
              {unread > 0 && (
                <span style={{
                  background: '#d32f2f',
                  color: 'white',
                  borderRadius: 999,
                  padding: '2px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>{unread}</span>
              )}
            </Link>
          </>
        )}
      </div>
      {isLoggedIn ? (
        <button
          onClick={onLogout}
          style={{
            background: "#ff7eb3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background 0.3s",
            fontSize: '1rem'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#ff4d6e92")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#ff7eb3")
          }
        >
          Logout
        </button>
      ) : (
        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            to="/login"
            style={{
              fontWeight: "bold",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background 0.3s",
              fontSize: '1rem'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#ff7eb48b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Login
          </Link>
          <Link
            to="/signup"
            style={{
              fontWeight: "bold",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background 0.3s",
              fontSize: '1rem'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#ff7eb484")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;