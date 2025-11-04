import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] =useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            // Handle login logic here
            if (!email || !username || !password) {
                setError('Please fill out all fields.');
                return;
            }
                const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
              setError('Please enter a valid email address');
              return;
            }
                        // Require: at least one lowercase, one uppercase, one digit, one special char (non-alphanumeric), min length 8
                        // Note: previous regex only allowed a small set of special characters like @$!%*?& which rejected others (e.g. #, -, _)
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
                        if (!passwordRegex.test(password)) {
                            setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (no spaces).');
                            return;
                        }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            setError('');
            //CONNECT TO BACKEND FOR AUTHENTICATION
            try {
                const response = await fetch('/api/users/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, password }),
                });
                if (response.ok) {
                    // Save username to localStorage for UserSettings default
                    localStorage.setItem('mockUser', JSON.stringify({ username, email, password }));
                    localStorage.setItem('usernameChangeCount', '0');
                    alert('Signup successful! Redirecting to login...');
                    navigate('/login');
                } else {
                    setError('Signup failed. Please try again.');
                }
            } catch (error) {
                // Log error for debugging; show friendly message to user
                // eslint-disable-next-line no-console
                console.error('Signup error:', error);
                setError('An error occurred. Please try again later.');
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
                    <h1 style={{textAlign: 'center'}}>Create an account.</h1>
                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
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
                        <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '0.25rem' }}>
                            Password must be at least 8 characters, include uppercase and lowercase letters, a number, and a special character. No spaces.
                        </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        Sign up
                    </button>
                </form>
            </div>
    );
};

export default SignUp;
