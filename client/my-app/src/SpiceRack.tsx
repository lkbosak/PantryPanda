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
        <h1 style={{ color: 'white' }}>Spice Rack</h1>
        <table style={{ width: '80%', borderCollapse: 'collapse', marginTop: '20px', margin: '0 auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Product Name
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Quantity
            </th>
            <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              Expiration Date
            </th>
          </tr>
        </thead>
        <tbody>
          {spiceRackItems.map(item => (
            <tr key={item.inventory_id}>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.product?.product_name ?? 'Unknown product'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {item.quantity} {item.unit || ''}
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
            <div style={{ marginTop: 12 }}>
                <button onClick={() => navigate('/addItem?category=spice%20rack')} style={{ padding: '0.5rem 0.75rem' }}>Add Item</button>
            </div>
    </div>
    );
};
export default SpiceRack;