// src/NavBar.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({
  isLoggedIn,
  onLogout,
}) => {
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