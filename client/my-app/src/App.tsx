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
    </BrowserRouter>
  );
}

export default App;
