import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import API from './api';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);

  const handleLogout = async () => {
    await API.get('/logout');
    setLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <>
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
