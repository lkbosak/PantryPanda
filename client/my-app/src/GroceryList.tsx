import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product { product_id?: number; product_name?: string; barcode_upc?: string | null }
interface GroceryRow { list_id: number; qToBuy: number; isPurchased: boolean; product?: Product }
interface InventoryRow { inventory_id: number; quantity: number; expiration_date?: string | null; product?: Product }

const GroceryList: React.FC = () => {
  const [items, setItems] = useState<Array<{ list_id: number; productName: string; barcode?: string; original: number; remaining: number }>>([]);
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

        // fetch full grocery list for user
        const glRes = await fetch(`/api/grocery-list/${user_id}`);
        if (!glRes.ok) throw new Error(`Failed to load grocery list: ${glRes.status}`);
        const glData: GroceryRow[] = await glRes.json();

        // group by barcode
        const groups = new Map<string, { best: GroceryRow }>();
        for (const row of glData) {
          const barcode = row.product?.barcode_upc ?? String(row.product?.product_id ?? '');
          if (!barcode) continue;
          const existing = groups.get(barcode);
          if (!existing || (row.qToBuy ?? 0) > (existing.best.qToBuy ?? 0)) {
            groups.set(barcode, { best: row });
          }
        }

        // create a list of grocery items (take highest qToBuy per barcode)
        const groceryMap = new Map<string, { list_id: number; productName: string; barcode?: string; original: number; remaining: number }>();
        groups.forEach((v, barcode) => {
          const r = v.best;
          const productName = r.product?.product_name ?? 'Unknown';
          const original = Number(r.qToBuy ?? 0);
          groceryMap.set(barcode, { list_id: r.list_id, productName, barcode, original, remaining: original });
        });

        // fetch user's inventory
        const invRes = await fetch(`/api/user-inventory/${user_id}`);
        if (!invRes.ok) throw new Error(`Failed to load inventory: ${invRes.status}`);
        const invData: InventoryRow[] = await invRes.json();

        const now = new Date();
        // decrement remaining based on non-expired inventory items
        for (const inv of invData) {
          // skip expired items
          if (inv.expiration_date) {
            const d = new Date(inv.expiration_date);
            if (!isNaN(d.getTime()) && d < now) continue;
          }
          const barcode = inv.product?.barcode_upc ?? String(inv.product?.product_id ?? '');
          if (!barcode) continue;
          const entry = groceryMap.get(barcode);
          if (!entry) continue;
          const qtyHave = Number(inv.quantity ?? 0);
          entry.remaining = Math.max(0, entry.remaining - qtyHave);
        }

        // build final array of items with remaining > 0
        const final = Array.from(groceryMap.values()).filter(i => i.remaining > 0);
        setItems(final);
      } catch (err: any) {
        console.error(err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Grocery List</h2>
      {items.length === 0 ? (
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

      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate('/addItem')} style={{ padding: '0.5rem 0.75rem' }}>Add Item</button>
      </div>
    </div>
  );
};

export default GroceryList;
