import React from 'react';

export function Inbox(): React.ReactElement {
	return (
		<div style={{
			position: 'relative',
			minHeight: '100vh',
			backgroundColor: '#f5f5f5',
			width: '100vw',
			overflow: 'hidden'
		}}>
			{/* Use an <img> element to ensure the background image is loaded and visible */}
			<img src="/main-bg.jpg" alt="background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
			{/* intentionally minimal: only background for Inbox page */}
			<div style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
				<h1 style={{ color: 'white', textShadow: '0 4px 18px rgba(0,0,0,0.6)', fontSize: '3rem', margin: 0 }}>
					Hello — Inbox is working 🎉
				</h1>
			</div>
		</div>
	);
}

export default Inbox;

