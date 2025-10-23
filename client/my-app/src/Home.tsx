import React from 'react';

const Home = () => (
    <div 
        style={{
            backgroundImage: "url('/home-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between' // Space between main content and footer
        }}
    >
        <header style={{
            background: 'rgba(175, 84, 84, 0.39)', // Semi-transparent background
            padding: '4rem',
            borderRadius: '10px',
            textAlign: 'center',
            color: 'white' // Change text color to white for contrast
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Welcome to Pantry Panda!</h1>
            <p>Your personal pantry management app.</p>
        </header>

        <div style={{
            background: 'rgba(175, 84, 84, 0.39)', // Semi-transparent background
            padding: '4rem',
            borderRadius: '10px',
            //textAlign: 'center',
            color: 'white' // Change text color to white for contrast
        }}>
            <h2>Our Features:</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>Scan items with your camera</li>
                <li>Track expiration dates</li>
                <li>Set minimum stock levels</li>
                <li>Organize items by fridge, freezer, dry goods, or spice rack</li>
                <li>Generate shopping lists</li>
            </ul>

            <h3>Get started today by signing up and adding to your pantry!</h3>
        </div>

        <footer style={{
            background: 'rgba(175, 84, 84, 0.31)', // Semi-transparent background
            padding: '4rem',
            //textAlign: 'center',
            color: 'white' // Change text color to white for contrast
        }}>
            <h3>Who made it happen:</h3>
            <p>Matt, Christian, Ife, John, Laura</p>
        </footer>
    </div>
);

export default Home;