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
const Fridge: React.FC = () => {
  const navigate = useNavigate();
  const [fridgeItems, setPantryItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFridge = async () => {
      try {
        const userIdStr = localStorage.getItem('user_id');
        if (!userIdStr) 
          return console.error('No user_id found');
        const user_id = Number(userIdStr);
        if (isNaN(user_id)) 
          return console.error('Invalid user_id');
        const response = await fetch(`/api/user-inventory/findFridge/${user_id}`);
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
    fetchFridge();
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
        <h1 style={{ color: 'white' }}>Fridge</h1>
                 <ul style={{ background: 'white', color: 'black', borderRadius: '8px', padding: '1rem' }}>
            {fridgeItems.map((item, idx) => (
                <li key={idx}>{item.product?.product_name} (x{item.quantity})</li>
        ))}
      </ul>
            <div style={{ marginTop: 12 }}>
                <button onClick={() => navigate('/addItem?category=Fridge')} style={{ padding: '0.5rem 0.75rem' }}>Add Item</button>
            </div>
    </div>
    );
};
export default Fridge;