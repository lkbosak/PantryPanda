import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './Home';
import Pantry from './Pantry';
import Recipes from './Recipes';
import Login from './Login';
import UserSettings from './UserSettings';
import SignUp from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import Fridge from './Fridge';
import Freezer from './Freezer';
import SpiceRack from './SpiceRack';
import DryGoods from './DryGoods';
import AddItemPage from './AddItemPage';
import RemoveItemPage from './RemoveItemPage';
import BarcodeScanner from './BarcodeScanner';
import NavBar from './NavBar';


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
    globalThis.location.href = '/';
  };

    return (
    <BrowserRouter>
      <PantryProvider>
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/ForgotPasswordForm" element={<ForgotPasswordForm />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/freezer" element={<Freezer />} />
          <Route path="/spicerack" element={<SpiceRack />} />
          <Route path="/drygoods" element={<DryGoods />} />
          <Route path="/addItem" element={<AddItemPage />} />
          <Route path="/removeItem" element={<RemoveItemPage />} />
          <Route path="/scanner" element={<BarcodeScanner onDetected={(code) => console.log("Detected barcode:", code)} />} />
        </Routes>
      </PantryProvider>
    </BrowserRouter>
  );
}

export default App;
