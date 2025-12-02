import React, { useEffect, useState } from 'react';

type Notification = {
	id: string;
	text: string;
	ts: number;
	read: boolean;
	action: 'add' | 'remove';
	itemName: string;
	category: string;
	quantity?: number;
	remainingCount?: number;
};

export function Inbox(): React.ReactElement {
		const [notifs, setNotifs] = useState<Notification[]>(() => {
			// Load notifications from localStorage on mount
			try {
				const saved = localStorage.getItem('inbox-notifications');
				if (saved) {
					return JSON.parse(saved);
				}
			} catch (e) {
				console.error('Failed to load notifications:', e);
			}
			return [];
		});
		const [toast, setToast] = useState<Notification | null>(null);

		// Save notifications to localStorage whenever they change
		useEffect(() => {
			try {
				localStorage.setItem('inbox-notifications', JSON.stringify(notifs));
			} catch (e) {
				console.error('Failed to save notifications:', e);
			}
		}, [notifs]);

		// Toggle read/unread status when notification is clicked
		const toggleRead = (id: string) => {
			setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
		};

	useEffect(() => {
		const handler = (e: Event) => {
			try {
				const detail = (e as CustomEvent).detail as any;
				if (!detail) return;
				
				console.log('📬 Inbox received pantry-change event:', detail);
				
				const when = Date.now();
				let text = '';
				let action: 'add' | 'remove' = 'add';
				const item = detail.item || {};
				const itemName = item.name || 'Item';
				const category = item.category || 'pantry';
				const quantity = item.quantity;
				const remainingCount = detail.remainingCount;

				if (detail.action === 'add') {
					action = 'add';
					text = `${itemName} added (${quantity || 1}) to ${category}`;
						} else if (detail.action === 'remove') {
							action = 'remove';
							const qty = quantity ? ` (${quantity})` : '';
							const remaining = typeof remainingCount === 'number' ? ` — ${remainingCount} left in ${category}` : '';
							text = `${itemName} removed${qty} from ${category}${remaining}`;
				} else {
					text = `Pantry changed`;
				}
			const notif: Notification = { 
				id: String(when) + Math.random().toString(36).slice(2,6), 
				text, 
				ts: when,
				read: false,
				action,
				itemName,
				category,
				quantity,
				remainingCount
			};
			
			console.log('✅ Creating notification:', notif);
			
			setNotifs((prev: Notification[]) => [notif, ...prev]);
				setToast(notif);
				setTimeout(() => setToast(null), 4000);
			} catch (err) {
				console.error('❌ Failed to create notification:', err);
			}
		};

		console.log('🎧 Inbox mounted - listening for pantry-change events');
		window.addEventListener('pantry-change', handler as EventListener);
		return () => {
			console.log('👋 Inbox unmounting - removing event listener');
			window.removeEventListener('pantry-change', handler as EventListener);
		};
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
														<li 
															key={n.id} 
															onClick={() => toggleRead(n.id)}
															style={{ 
																padding: '12px 8px', 
																borderBottom: '1px solid rgba(0,0,0,0.04)',
																cursor: 'pointer',
																backgroundColor: n.read ? 'transparent' : 'rgba(255,209,187,0.15)',
																borderLeft: n.read ? '4px solid transparent' : '4px solid rgba(255,159,128,0.8)',
																transition: 'all 0.2s ease',
																position: 'relative'
															}}
														>
															<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
																<div style={{ flex: 1 }}>
																	<div style={{ fontWeight: n.read ? 400 : 700, color: n.read ? '#666' : '#333' }}>
																		{n.text}
																	</div>
																	<div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
																		{new Date(n.ts).toLocaleString()}
																	</div>
																</div>
																<div style={{ 
																	width: 10, 
																	height: 10, 
																	borderRadius: '50%', 
																	backgroundColor: n.read ? '#ccc' : '#ff9f80',
																	marginLeft: 12,
																	flexShrink: 0
																}} />
															</div>
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

