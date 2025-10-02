import React from 'react';
import { Link } from 'react-router-dom';
import { usePantry } from './PantryContext';

const clearButtonStyle = {
  width: '100%',
  height: '120px',
  fontSize: '1.3rem',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.7)',
  color: '#333',
  border: '2px solid #ddd',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'background 0.2s, box-shadow 0.2s'
};

const Pantry = () => {
    const { pantryItems } = usePantry();
    const fridgeItems = pantryItems.filter(item => item.category === 'Fridge');
    const freezerItems = pantryItems.filter(item => item.category === 'Freezer');
    const dryGoodsItems = pantryItems.filter(item => item.category === 'Dry Goods');
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
            <h1 style={{ 
                marginBottom: '6rem',
                color: 'white' 
                }}>
                    Your Pantry
            </h1>
            {/* <h2>Fridge</h2>
            <ul>
                {fridgeItems.map((item, idx) => (
                <li key={idx}>{item.name} (x{item.quantity})</li>
                ))}
            </ul>
            <h2>Freezer</h2>
            <ul>
                {freezerItems.map((item, idx) => (
                <li key={idx}>{item.name} (x{item.quantity})</li>
                ))}
            </ul>
            <h2>Dry Goods</h2>
            <ul>
                {dryGoodsItems.map((item, idx) => (
                <li key={idx}>{item.name} (x{item.quantity})</li>
                ))}
            </ul>
            <h2>Spice Rack</h2>
            <ul>
                {spiceRackItems.map((item, idx) => (
                <li key={idx}>{item.name} (x{item.quantity})</li>
                ))}
            </ul> */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1.5rem', 
                width: '100%', 
                maxWidth: '700px', 
                margin: '0 auto'
            }}>
                <Link to="/fridge">
                    <button style={clearButtonStyle}>Fridge</button>
                </Link>
                <Link to="/freezer">
                    <button style={clearButtonStyle}>Freezer</button>
                </Link>
                <Link to="/spicerack">
                    <button style={clearButtonStyle}>Spice Rack</button>
                </Link>
                <Link to="/drygoods">
                    <button style={clearButtonStyle}>Dry Goods</button>
                </Link>
                <Link to="/AddItem">
                    <button style={clearButtonStyle}>Add Item</button>
                </Link>
                <Link to="/RemoveItem">
                    <button style={clearButtonStyle}>Remove Item</button>
                </Link>
            </div>
        </div>
    );
};
export default Pantry;
