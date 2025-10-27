import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ loggedIn, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <span className="font-bold">OAuth App</span>
      <div>
        {loggedIn ? (
          <>
            <Link className="mr-4" to="/profile">Profile</Link>
            <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
