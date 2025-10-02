import React from 'react';
import { usePantry } from './PantryContext';
const SpiceRack = () => {
    const { pantryItems } = usePantry();
    const spiceRackItems = pantryItems.filter(item => item.category === 'Spice Rack');

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
         <ul style={{ background: 'white', color: 'black', borderRadius: '8px', padding: '1rem' }}>
            {spiceRackItems.map((item, idx) => (
                <li key={idx}>{item.name} (x{item.quantity})</li>
        ))}
      </ul>
    </div>
    );
};
export default SpiceRack;