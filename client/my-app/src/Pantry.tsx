import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
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
    const navigate = useNavigate();
    return (
        <div style={{
                    backgroundImage: "url('/home-bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    //justifyContent: 'center',
                    alignItems: 'center',
                    //paddingTop: '4rem',
                }}>
            <h1 style={{ color: 'white' }}>Your Pantry</h1>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'relative',
                        left: '10rem',// Align with the table
                        padding: "0.5rem 1rem",
                        backgroundColor: "#fb0000ff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginBottom: '1rem', // Adjust spacing to match SpiceRack
                    }}
                >
                    Back
                </button>
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
                    <Link to="/AddItem" style={{ gridColumn: '1 / -1' }}>
                        <button style={clearButtonStyle}>Add Item</button>
                    </Link>
                    {/* <Link to="/RemoveItem">
                        <button style={clearButtonStyle}>Remove Item</button>
                    </Link> */}
                </div>
            </div>
        </div>
    );
};
export default Pantry;
