import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './Home';
import Pantry from './Pantry';
import Recipes from './Recipes';
import Login from './Login';
import UserSettings from './UserSettings';
import SignUp from './SignUpForm';
import SettingsHome from './SettingsHome';
import './App.css';
import Inbox from './Inbox';

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <PantryProvider>
        <nav style={{background: 'rgba(175, 84, 84, 0.39)', padding: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isLoggedIn ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/pantry">Pantry</Link>
              <Link to="/settings">User Settings</Link>
              <button onClick={handleLogout} className="nav-link-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/freezer" element={<Freezer />} />
          <Route path="/spicerack" element={<SpiceRack />} />
          <Route path="/drygoods" element={<DryGoods />} />
          <Route path="/addItem" element={<AddItemPage />} /> 
          <Route path="/removeItem" element={< RemoveItemPage/>} />
          <Route path="/scanner" element={<BarcodeScanner onDetected={code => console.log('Detected barcode:', code)} />} />
        </Routes>
      </PantryProvider>
=======
      <nav>
        <Link to="/">Home</Link> | <Link to="/pantry">Pantry</Link> | <Link to="/settings">User Settings</Link> | <Link to="/inbox">📥 Inbox</Link> | <Link to="/login">Logout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
        <Route path="/settings" element={<UserSettings />}>
          <Route index element={<SettingsHome />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
>>>>>>> origin/main
    </BrowserRouter>
  );
}

export default App;
