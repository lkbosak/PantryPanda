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
            background: 'rgba(175, 84, 84, 0.36)', // Semi-transparent background
            padding: '4rem',
            borderRadius: '10px',
            //textAlign: 'center',
            color: 'white' // Change text color to white for contrast
        }}>
            <h2 style= {{ textAlign: 'center' }}>Our Features:</h2>
            <table style={{ width: '30%', borderCollapse: 'collapse', border: '3px solid white', textAlign: 'center', flexDirection: 'column', margin: '0 auto', backgroundColor: 'rgba(175, 84, 84, 1)', borderRadius: '8px'
             }}>
                <tbody>
                    <tr>
                        <td>Scan items with your camera</td>
                    </tr>
                    <tr>
                        <td >Track expiration dates</td>
                    </tr>
                    <tr>
                        <td >Set minimum stock levels</td>
                    </tr>
                    <tr>
                        <td >Organize items by fridge, freezer, dry goods, or spice rack</td>
                    </tr>
                    <tr>
                        <td >Generate shopping lists</td>
                    </tr>
                </tbody>
            </table>
            <h3 style= {{ textAlign: 'center' }}>Get started today by signing up and adding to your pantry!</h3>
        </div>

        <footer style={{
            background: 'rgba(175, 84, 84, 0.31)', // Semi-transparent background
            padding: '4rem',
            textAlign: 'center',
            color: 'white' // Change text color to white for contrast
        }}>
            <h3>Who made it happen:</h3>
            <p>Matt, Christian, Ife, John, Laura</p>
        </footer>
    </div>
);

export default Home;