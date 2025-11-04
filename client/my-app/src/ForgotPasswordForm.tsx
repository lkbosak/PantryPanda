import React from 'react';
const ForgotPasswordForm = () => (
    <div 
        style={{
                backgroundImage: "url('/home-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
        }}
    >
        <div
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '400px',
                width: '100%',
            }}
        >
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Forgot Password</h1>
            <form>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
                    You will receive a link to create a new password via email.
                </p>
                <button 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: '#4caf50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    </div>
);
export default ForgotPasswordForm;