
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type LoginProps = {
    onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    //const [email, setEmail] = useState('');
    //const [username, setUsername] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] =useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        if (!identifier || !password) {
            Error('Please enter both email/username and password.');
            return;
        }
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, password }),
            });

            // Log status and headers for debugging
            // eslint-disable-next-line no-console
            console.log('Login response status:', response.status);
            // eslint-disable-next-line no-console
            console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

            // Only attempt JSON parse when content-type indicates JSON
            const contentType = response.headers.get('content-type') || '';
            let data: any = null;
            if (contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to parse JSON response for login:', err);
                }
            } else {
                // If not JSON, get text for debugging
                const text = await response.text();
                // eslint-disable-next-line no-console
                console.log('Non-JSON login response body:', text);
            }

            if (response.ok && data) {
                setError('');
                if (onLogin) onLogin();
                // Store user info or token if returned by backend
                localStorage.setItem('user_id', JSON.stringify(data.user_id));
                navigate('/pantry');
            } else if (response.ok && !data) {
                // 200 with empty/null body
                setError('Login failed: invalid credentials.');
            } else if (response.status === 401) {
                setError('Invalid credentials.');
            } else if (response.status >= 400 && response.status < 500) {
                setError('Login request failed. Please check your input.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fetch error during login:', error);
            setError('Network error: unable to reach the server.');
        }
        /* const stored = localStorage.getItem('mockUser');
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
        } */
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
                        id="identifier"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
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
