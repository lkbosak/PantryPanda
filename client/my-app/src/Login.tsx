
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type LoginProps = {
    onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] =useState('');
    const navigate = useNavigate(); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        const stored = localStorage.getItem('mockUser');
        if (stored) {
            const { email: storedEmail, username: storedUser, password: storedPassword } = JSON.parse(stored);
            if (
                (email === storedEmail || email === storedUser) &&
                password === storedPassword
            ) {
                setError('');
                if (onLogin) onLogin();
                alert('Login successful! Redirecting to pantry...');
                localStorage.setItem('mockUserLoggedIn', stored);
                navigate('/pantry');
            } else {
                setError('Email or password is incorrect.');
                return;
            }
        }else {
            setError('No user found. Please sign up first.');
            return;
        }
    };

    return (
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
            <h1 style={{color: 'white'}}>Login or create an account. </h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '2rem',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '300px',
                }}
        >
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
             <div style={{ marginBottom: '1rem' }}>
                    <label>Email or Username:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        required
                    />
                </div>
            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    Login
            </button>
           <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
                </div>
            </form>
        </div>
    );
};

export default Login;