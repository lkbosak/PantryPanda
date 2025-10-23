import React from 'react';
import { usePantry } from './PantryContext';
import { useNavigate } from 'react-router-dom';
const Fridge = () => {
    const { pantryItems } = usePantry();
    const fridgeItems = pantryItems.filter(item => item.category === 'Fridge');
    const navigate = useNavigate();

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
                <li key={idx}>{item.name} (x{item.quantity})</li>
        ))}
      </ul>
            <div style={{ marginTop: 12 }}>
                <button onClick={() => navigate('/addItem?category=Fridge')} style={{ padding: '0.5rem 0.75rem' }}>Add Item</button>
            </div>
    </div>
    );
};
export default Fridge;