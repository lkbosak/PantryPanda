import React, { useState, useEffect, use } from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './Home';
import Pantry from './Pantry';
import Recipes from './Recipes';
import Login from './Login';
import UserSettings from './UserSettings';
import SignUp from './SignUpForm';
import Fridge from './Fridge';
import Freezer from './Freezer';
import SpiceRack from './SpiceRack';
import DryGoods from './DryGoods';
//import AddItemForm from './AddItemForm';
import AddItemPage from './AddItemPage';
//import RemoveItemForm from './RemoveItemForm';
import RemoveItemPage from './RemoveItemPage';


import './App.css';
import { PantryProvider } from './PantryContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('mockUser'));
  
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('mockUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <PantryProvider>
        <nav style={{ marginBottom: '2rem' }}>
          {isLoggedIn ? (
            <>
              <Link to="/">Home</Link>
              {' |'}<Link to="/pantry">Pantry</Link>
              {' | '}<Link to="/settings">User Settings</Link>
              {' | '}<button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              {' | '}<Link to="/login">Login</Link>
              {' | '}<Link to="/signup">Sign Up</Link>
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
        </Routes>
      </PantryProvider>
    </BrowserRouter>
  );
}

export default App;
