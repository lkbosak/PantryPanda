// src/NavBar.tsx
// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({
  isLoggedIn,
  onLogout,
}) => {
  const [profilePic, setProfilePic] = useState<string>('/default-profile.webp');

  useEffect(() => {
    // Load profile picture from localStorage
    const savedProfilePic = localStorage.getItem('profile_picture');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }

    // Listen for profile picture changes
    const handleProfilePicChange = () => {
      const updated = localStorage.getItem('profile_picture');
      if (updated) {
        setProfilePic(updated);
      }
    };

    window.addEventListener('profile-picture-changed', handleProfilePicChange);
    return () => {
      window.removeEventListener('profile-picture-changed', handleProfilePicChange);
    };
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
              to="/grocery-list"
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
              Grocery List
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
              📥 Inbox
            </Link>
          </>
        )}
      </div>
      {isLoggedIn ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={profilePic} 
            alt="Profile" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/settings'}
            onError={(e) => {
              // Fallback to default if image fails to load
              (e.target as HTMLImageElement).src = '/default-profile.webp';
            }}
          />
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
        </div>
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