import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Pantry from './Pantry';
import Recipes from './Recipes';
import Login from './Login';
import UserSettings from './UserSettings';
import SignUp from './SignUp';
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
      <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
