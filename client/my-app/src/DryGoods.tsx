import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const DryGoods: React.FC = () => {
  const navigate = useNavigate();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const userIdStr = localStorage.getItem('user_id');
        if (!userIdStr) 
          return console.error('No user_id found');
        const user_id = Number(userIdStr);
        if (isNaN(user_id)) 
          return console.error('Invalid user_id');
        const response = await fetch(`/api/user-inventory/findPantry/${user_id}`);
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
    fetchPantry();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dry Goods</h1>
      <ul>
        {pantryItems.map(item => (
          <li key={item.inventory_id}>
            {item.product?.product_name ?? 'Unknown product'} (x{item.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DryGoods;

