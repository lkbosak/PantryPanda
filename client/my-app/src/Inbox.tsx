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
			{/* background image */}
			<img src="/main-bg.jpg" alt="background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
			{/* top shaded bar */}
			<div style={{ position: 'relative', zIndex: 2 }}>
				<header style={{
					width: '100%',
					/* larger peach-pink header */
					background: 'linear-gradient(90deg, rgba(255,209,187,0.98), rgba(255,159,128,0.92))',
					color: '#fff',
					padding: '36px 24px',
					height: '140px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					fontSize: '2rem',
					fontWeight: 900,
					boxShadow: '0 10px 30px rgba(0,0,0,0.20)'
				}}>
					<span style={{ width: '100%', display: 'inline-block' }}>Inbox</span>
				</header>
				{/* content area left intentionally blank */}
				<div style={{ paddingTop: 18 }} />
			</div>
		</div>
	);
}

export default Inbox;

