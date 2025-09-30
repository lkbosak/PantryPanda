
import React from 'react';
import { Link } from 'react-router-dom';

const clearButtonStyle = {
  width: '100%',
  height: '180px',
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

const Pantry = () => (
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
        </div>
    </div>
);
export default Pantry;
