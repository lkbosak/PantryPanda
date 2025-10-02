import React from 'react';
import { usePantry } from './PantryContext';
const Freezer = () => {
    const { pantryItems } = usePantry();
    const freezerItems = pantryItems.filter(item => item.category === 'Freezer');

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
        <h1 style={{ color: 'white' }}>Freezer</h1>
         <ul style={{ background: 'white', color: 'black', borderRadius: '8px', padding: '1rem' }}>
            {freezerItems.map((item, idx) => (
                <li key={idx}>{item.name} (x{item.quantity})</li>
        ))}
      </ul>
    </div>
    );
};
export default Freezer;
