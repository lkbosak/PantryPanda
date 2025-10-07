import React, { useState, useEffect } from 'react';
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
import AddItemForm from './AddItemForm';
import AddItemPage from './AddItemPage';
import RemoveItemForm from './RemoveItemForm';


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
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/pantry">Pantry</Link> | <Link to="/recipes">Recipes</Link> | <Link to="/login">Login</Link>| <Link to="/settings">User Settings</Link>| 
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      <Route path="/settings" element={<UserSettings />} />
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/freezer" element={<Freezer />} />
        <Route path="/spicerack" element={<SpiceRack />} />
        <Route path="/drygoods" element={<DryGoods />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
