import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const boxStyle: React.CSSProperties = {
	background: 'rgba(255,255,255,0.95)',
	borderRadius: '12px',
	boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
	padding: '40px 32px',
	maxWidth: '400px',
	margin: '40px auto',
	textAlign: 'center',
};

const ChangePassword = () => {
	const navigate = useNavigate();
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		// Validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			setError('Please fill in all fields');
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('New passwords do not match');
			return;
		}

		if (newPassword.length < 6) {
			setError('New password must be at least 6 characters long');
			return;
		}

		if (currentPassword === newPassword) {
			setError('New password must be different from current password');
			return;
		}

		setLoading(true);

		try {
			// Get user_id from localStorage
			const userIdStr = localStorage.getItem('user_id');
			if (!userIdStr) {
				setError('User not logged in');
				setLoading(false);
				return;
			}

			const user_id = JSON.parse(userIdStr);

			const response = await fetch('/api/users/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id,
					currentPassword,
					newPassword,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess('Password successfully changed! The old password will no longer work.');
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
				
				// Redirect to settings after 2 seconds
				setTimeout(() => {
					navigate('/settings');
				}, 2000);
			} else if (response.status === 401) {
				setError('Current password is incorrect');
			} else if (response.status === 404) {
				setError('User not found');
			} else {
				setError(data.message || 'Failed to change password');
			}
		} catch (error) {
			console.error('Error changing password:', error);
			setError('Network error: unable to reach the server');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			backgroundImage: "url('/home-bg.jpg')",
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			width: '100vw',
			padding: '20px',
		}}>
			<button 
				onClick={() => navigate(-1)} 
				style={{
					alignSelf: 'flex-start', 
					marginBottom: 24, 
					padding: '8px 24px', 
					borderRadius: 6, 
					border: 'none', 
					background: '#eee', 
					cursor: 'pointer'
				}}
			>
				Back
			</button>
			<div style={boxStyle}>
				<h2 style={{ marginBottom: '24px', color: '#333' }}>Change Password</h2>
				
				{error && (
					<div style={{ 
						padding: '12px', 
						marginBottom: '16px', 
						background: '#ffebee', 
						color: '#c62828', 
						borderRadius: '6px',
						fontSize: '0.9rem'
					}}>
						{error}
					</div>
				)}

				{success && (
					<div style={{ 
						padding: '12px', 
						marginBottom: '16px', 
						background: '#e8f5e9', 
						color: '#2e7d32', 
						borderRadius: '6px',
						fontSize: '0.9rem',
						fontWeight: 500
					}}>
						{success}
					</div>
				)}

				<form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
					<div style={{ marginBottom: '20px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
							Current Password
						</label>
						<input
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							disabled={loading}
							style={{
								width: '100%',
								padding: '10px',
								borderRadius: '6px',
								border: '1px solid #ddd',
								fontSize: '1rem',
								boxSizing: 'border-box'
							}}
							placeholder="Enter current password"
						/>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
							New Password
						</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							disabled={loading}
							style={{
								width: '100%',
								padding: '10px',
								borderRadius: '6px',
								border: '1px solid #ddd',
								fontSize: '1rem',
								boxSizing: 'border-box'
							}}
							placeholder="Enter new password"
						/>
					</div>

					<div style={{ marginBottom: '24px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
							Confirm New Password
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={loading}
							style={{
								width: '100%',
								padding: '10px',
								borderRadius: '6px',
								border: '1px solid #ddd',
								fontSize: '1rem',
								boxSizing: 'border-box'
							}}
							placeholder="Confirm new password"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						style={{
							width: '100%',
							padding: '12px',
							background: loading ? '#ccc' : '#4CAF50',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '1rem',
							fontWeight: 600,
							cursor: loading ? 'not-allowed' : 'pointer',
							transition: 'background 0.3s'
						}}
					>
						{loading ? 'Changing Password...' : 'Change Password'}
					</button>
				</form>

				<div style={{ 
					marginTop: '20px', 
					padding: '12px', 
					background: '#fff3e0', 
					borderRadius: '6px',
					fontSize: '0.85rem',
					color: '#e65100',
					textAlign: 'left'
				}}>
					<strong>⚠️ Important:</strong> After changing your password, your old password will be 
					<strong> permanently replaced</strong> and can no longer be used to log in.
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
