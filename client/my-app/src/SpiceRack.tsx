import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
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
  const [spiceRackItems, setPantryItems] = useState<PantryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

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
              // delete selected
              if (selectedIds.size === 0) return alert('No items selected');
              if (!window.confirm(`Delete ${selectedIds.size} selected item(s)?`)) return;
              setDeleting(true);
              try {
                const ids = Array.from(selectedIds);
                await Promise.all(ids.map(id => fetch(`/api/user-inventory/${id}`, { method: 'DELETE' }).then(res => {
                  if (!res.ok) throw new Error(`Failed to delete ${id}`);
                })));
                // remove from UI
                setPantryItems(prev => prev.filter(item => !selectedIds.has(item.inventory_id)));
                setSelectedIds(new Set());
                alert('Selected items deleted');
              } catch (err) {
                console.error('Delete error', err);
                alert('Failed to delete some items. See console for details.');
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting || selectedIds.size === 0}
            style={{ padding: '0.5rem 0.75rem', marginLeft: 8 }}
          >
            {deleting ? 'Deleting...' : 'Delete selected'}
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Select
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Product Name
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Quantity
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
          {spiceRackItems.map(item => (
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
                {item.quantity} 
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.date_added ? new Date(item.date_added).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
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