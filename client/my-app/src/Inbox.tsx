import React, { useEffect, useState } from 'react';

type Notification = {
	id: string;
	text: string;
	ts: number;
};

export function Inbox(): React.ReactElement {
		const [notifs, setNotifs] = useState<Notification[]>([]);
		const [toast, setToast] = useState<Notification | null>(null);

	useEffect(() => {
		const handler = (e: Event) => {
			try {
				const detail = (e as CustomEvent).detail as any;
				if (!detail) return;
				const when = Date.now();
				let text = '';
				if (detail.action === 'add') {
					const item = detail.item;
					text = `${item.name} added (${item.quantity || 1}) to ${item.category || 'pantry'}`;
				} else if (detail.action === 'remove') {
					const item = detail.item;
					text = `${item.name} removed from ${item.category || 'pantry'}`;
				} else {
					text = `Pantry changed`;
				}
			const notif: Notification = { id: String(when) + Math.random().toString(36).slice(2,6), text, ts: when };
			setNotifs((prev: Notification[]) => [notif, ...prev]);
				setToast(notif);
				setTimeout(() => setToast(null), 4000);
			} catch (err) {
				// ignore
			}
		};

		window.addEventListener('pantry-change', handler as EventListener);
		return () => window.removeEventListener('pantry-change', handler as EventListener);
	}, []);

	return (
		<div style={{
			position: 'relative',
			minHeight: '100vh',
			backgroundColor: '#f5f5f5',
			width: '100vw',
			overflow: 'hidden'
		}}>
			<img src="/main-bg.jpg" alt="background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

			<div style={{ position: 'relative', zIndex: 2 }}>
								<header style={{
									width: '100%',
									background: 'linear-gradient(90deg, rgba(255,209,187,0.98), rgba(255,159,128,0.92))',
									color: '#fff',
									padding: '12px 16px',
									height: '72px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									textAlign: 'center',
									fontSize: '1.75rem',
									fontWeight: 900,
									boxShadow: '0 6px 14px rgba(0,0,0,0.12)'
								}}>
									  <span style={{ width: '100%', display: 'inline-block' }}>Inbox</span>
								</header>

						<main style={{ padding: 24, paddingTop: 18 }}>
										<div style={{ maxWidth: 900, margin: '0 auto', background: 'rgba(255,255,255,0.92)', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)'}}>
											<h2 style={{ marginTop: 0 }}>Notifications</h2>
											{notifs.length === 0 ? (
												<div style={{ color: '#666', padding: 12 }}>No notifications yet.</div>
											) : (
												<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
													{notifs.map((n: Notification) => (
														<li key={n.id} style={{ padding: '12px 8px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
															<div style={{ fontWeight: 700 }}>{n.text}</div>
															<div style={{ color: '#888', fontSize: 12 }}>{new Date(n.ts).toLocaleString()}</div>
														</li>
													))}
												</ul>
											)}
										</div>
				</main>

				{toast && (
					<div style={{ position: 'fixed', right: 20, top: 100, zIndex: 9999 }}>
						<div style={{ background: 'rgba(0,0,0,0.75)', color: 'white', padding: '12px 18px', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.25)' }}>
							<div style={{ fontWeight: 700 }}>{toast.text}</div>
							<div style={{ fontSize: 12, opacity: 0.85 }}>{new Date(toast.ts).toLocaleTimeString()}</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Inbox;

