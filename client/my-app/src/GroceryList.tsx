import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product { product_id?: number; product_name?: string; barcode_upc?: string | null }
interface GroceryRow { list_id: number; qToBuy: number; isPurchased: boolean; product?: Product }

const GroceryList: React.FC = () => {
	const [items, setItems] = useState<Array<{ list_id: number; productName: string; remaining: number }>>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const userIdStr = localStorage.getItem('user_id');
				if (!userIdStr) throw new Error('No user_id in localStorage');
				const user_id = Number(userIdStr);
				if (isNaN(user_id)) throw new Error('Invalid user_id');

				// try to generate grocery list from pantry (creates entries)
				const genRes = await fetch(`/api/grocery-list/generate/${user_id}`, { method: 'POST' });
				let generated: GroceryRow[] = [];
				try {
					const text = await genRes.text();
					generated = text ? JSON.parse(text) : [];
				} catch (err) {
					console.warn('Failed to parse generateFromPantry response', err);
					generated = [];
				}

				let entries: GroceryRow[] = [];
				if (generated && generated.length > 0) {
					entries = generated;
				} else {
					// fallback to existing grocery list for user
					const glRes = await fetch(`/api/grocery-list/${user_id}`);
					try {
						const text = await glRes.text();
						entries = text ? JSON.parse(text) : [];
					} catch (err) {
						console.warn('Failed to parse grocery list response', err);
						entries = [];
					}
				}

				const list = entries.map(r => ({ list_id: r.list_id, productName: r.product?.product_name ?? 'Unknown', remaining: Number(r.qToBuy ?? 0) }));
				setItems(list.filter(i => i.remaining > 0));
			} catch (err: any) {
				console.error(err);
				setError(err.message || String(err));
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	return (
		<div style={{
			backgroundImage: "url('/home-bg.jpg')",
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			paddingTop: '4rem',
		}}>
			<div style={{ width: '80%', background: 'rgba(255,255,255,0.95)', padding: '1rem', borderRadius: 8 }}>
				<h2>Grocery List</h2>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div style={{ color: 'red' }}>{error}</div>
				) : items.length === 0 ? (
					<div>No items to buy.</div>
				) : (
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>Product</th>
								<th style={{ textAlign: 'right', borderBottom: '1px solid #ccc', padding: 8 }}>Remaining To Buy</th>
							</tr>
						</thead>
						<tbody>
							{items.map(it => (
								<tr key={it.list_id}>
									<td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{it.productName}</td>
									<td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{it.remaining}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				{/* <div style={{ marginTop: 12 }}>
					<button onClick={() => navigate('/addItem')} style={{ padding: '0.5rem 0.75rem' }}>Add Item</button>
				</div> */}
			</div>
		</div>
	);
};

export default GroceryList;

