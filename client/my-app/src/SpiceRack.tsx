import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { usePantry } from './PantryContext';
interface PantryItem {
  inventory_id: number;
  quantity: number;
  unit?: string;
  location?: string;
  date_added?: string;
  expiration_date?: string;
  qPref?: number;
  product?: {
    product_id: number;
    product_name: string;
  };
}

const SpiceRack: React.FC = () => {
  const navigate = useNavigate();
  const { removeItem } = usePantry();
  const [spiceRackItems, setPantryItems] = useState<PantryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  // Track quantity changes: map inventory_id -> adjusted quantity
  const [quantityChanges, setQuantityChanges] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const fetchSpiceRack = async () => {
      try {
        const userIdStr = localStorage.getItem('user_id');
        if (!userIdStr) 
          return console.error('No user_id found');
        const user_id = Number(userIdStr);
        if (isNaN(user_id)) 
          return console.error('Invalid user_id');
        const response = await fetch(`/api/user-inventory/findSpiceRack/${user_id}`);
        if (!response.ok) 
          throw new Error(`HTTP ${response.status}`);
        console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
        const data: PantryItem[] = await response.json();
        console.log(data);
        setPantryItems(data);
      } catch (err) {
        console.error('Error fetching pantry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpiceRack();
  }, []);

  if (loading) return <div>Loading...</div>;
    return (
    <div 
        style={{
            backgroundImage: "url('/home-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            //justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '4rem',
        }}
    >
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>Spice Rack</h1>
      <div style={{ width: '80%', margin: '0 auto', marginTop: 8 }}>
        <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#ff0000ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Back
      </button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            onClick={async () => {
              // Collect all items to process: selected items (to delete) + quantity-changed items
              const itemsToDelete = new Set(selectedIds);
              const changedIds = Array.from(quantityChanges.keys());
              
              // Add items with qty=0 to delete set
              changedIds.forEach(id => {
                if (quantityChanges.get(id) === 0) {
                  itemsToDelete.add(id);
                }
              });
              
              // Items to update (qty changed but not 0)
              const itemsToUpdate = changedIds.filter(id => {
                const newQty = quantityChanges.get(id)!;
                return newQty > 0;
              });
              
              const totalChanges = itemsToDelete.size + itemsToUpdate.length;
              if (totalChanges === 0) return alert('No changes to confirm');
              
              if (!window.confirm(`Confirm changes for ${totalChanges} item(s)?`)) return;
              setDeleting(true);
              try {
                const promises: Promise<void>[] = [];
                
                // Delete items (selected or qty=0)
                itemsToDelete.forEach(id => {
                  const itemToDelete = spiceRackItems.find(item => item.inventory_id === id);
                  promises.push(
                    fetch(`/api/user-inventory/${id}`, { method: 'DELETE' }).then(res => {
                      if (!res.ok) throw new Error(`Failed to delete ${id}`);
                      // Trigger notification for deleted item
                      if (itemToDelete?.product) {
                        removeItem({ name: itemToDelete.product.product_name });
                      }
                    })
                  );
                });
                
                // Update items (qty changed but not 0)
                itemsToUpdate.forEach(id => {
                  const newQty = quantityChanges.get(id)!;
                  promises.push(
                    fetch(`/api/user-inventory/${id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ quantity: newQty })
                    }).then(res => {
                      if (!res.ok) throw new Error(`Failed to update ${id}`);
                    })
                  );
                });
                
                await Promise.all(promises);
                
                // Update UI: remove deleted items, update quantities for changed items
                setPantryItems(prev => prev
                  .filter(item => !itemsToDelete.has(item.inventory_id))
                  .map(item => {
                    const newQty = quantityChanges.get(item.inventory_id);
                    return newQty !== undefined && newQty > 0 ? { ...item, quantity: newQty } : item;
                  })
                );
                setQuantityChanges(new Map());
                setSelectedIds(new Set());
                alert('Changes confirmed');
              } catch (err) {
                console.error('Update error', err);
                alert('Failed to confirm changes. See console for details.');
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting || (quantityChanges.size === 0 && selectedIds.size === 0)}
            style={{ padding: '0.5rem 0.75rem', marginLeft: 8 }}
          >
            {deleting ? 'Processing...' : 'Confirm changes'}
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Delete
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Product Name
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Quantity
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Adjust
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Expiration Date
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Date Added
            </th>
          </tr>
        </thead>
        <tbody>
          {spiceRackItems.map(item => {
            const originalQty = item.quantity;
            const currentQty = quantityChanges.has(item.inventory_id) 
              ? quantityChanges.get(item.inventory_id)! 
              : originalQty;
            
            return (
            <tr key={item.inventory_id}>
              <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  id={`select-${item.inventory_id}`}
                  checked={selectedIds.has(item.inventory_id)}
                  onChange={() => setSelectedIds(prev => {
                    const next = new Set(prev);
                    if (next.has(item.inventory_id)) next.delete(item.inventory_id);
                    else next.add(item.inventory_id);
                    return next;
                  })}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.product?.product_name ?? 'Unknown product'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {currentQty} {item.unit || ''}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    const newQty = Math.max(0, currentQty - 1);
                    setQuantityChanges(prev => new Map(prev).set(item.inventory_id, newQty));
                  }}
                  disabled={currentQty === 0}
                  style={{ 
                    padding: '0.25rem 0.5rem', 
                    marginRight: '0.5rem',
                    cursor: currentQty === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  −
                </button>
                <button
                  onClick={() => {
                    const newQty = Math.min(originalQty, currentQty + 1);
                    setQuantityChanges(prev => {
                      const next = new Map(prev);
                      if (newQty === originalQty) {
                        next.delete(item.inventory_id);
                      } else {
                        next.set(item.inventory_id, newQty);
                      }
                      return next;
                    });
                  }}
                  disabled={currentQty >= originalQty}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    cursor: currentQty >= originalQty ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.date_added ? new Date(item.date_added).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
                 {/* <ul style={{ background: 'white', color: 'black', borderRadius: '8px', padding: '1rem' }}>
            {spiceRackItems.map((item, idx) => (
                <li key={idx}>{item.product?.product_name} (x{item.quantity})</li>
        ))}
      </ul> */}
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => navigate('/addItem?category=pantry')} style={{ padding: '0.5rem 0.75rem' }}>Add Item</button>
            </div>
          </div>
    </div>
    );
};
export default SpiceRack;