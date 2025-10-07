import React from 'react';
const Home = () => (
    <div 
        style={{
                backgroundImage: "url('/home-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh'
        }}
    >
        <h1>Welcome to Pantry Panda!</h1>
        <p>Your personal pantry management app.</p>
    </div>
);
export default Home;