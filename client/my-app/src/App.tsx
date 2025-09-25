import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Pantry from './Pantry';
import Recipes from './Recipes';
import Login from './Login';
<<<<<<< HEAD
import UserSettings from './UserSettings';
import SignUp from './SignUp';
=======
import SignUp from './SignUpForm';
import Fridge from './Fridge';
import Freezer from './Freezer';
import SpiceRack from './SpiceRack';
import DryGoods from './DryGoods';

>>>>>>> 9e29881 (updated pantry page, signup form, and created blank pages for categories of pantry)
import './App.css';

function App() {
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
<<<<<<< HEAD
      <Route path="/settings" element={<UserSettings />} />
=======
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/freezer" element={<Freezer />} />
        <Route path="/spicerack" element={<SpiceRack />} />
        <Route path="/drygoods" element={<DryGoods />} />
>>>>>>> 9e29881 (updated pantry page, signup form, and created blank pages for categories of pantry)
      </Routes>
    </BrowserRouter>
  );
}

export default App;
