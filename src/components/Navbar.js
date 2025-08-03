import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import auth from Firebase
import { signOut } from 'firebase/auth';
import '../css/Navbar.css'; // Import the external CSS file

const Navbar = () => {
  const navigate = useNavigate(); // To navigate programmatically after logout

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      alert('Logged out successfully!');
      navigate('/login'); // Redirect to Login page after logout
    } catch (error) {
      console.error('Error logging out: ', error.message);
      alert('Logout failed.');
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink to="/" className="nav-link" activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/habit-tracker" className="nav-link" activeClassName="active">
            Habit Tracker
          </NavLink>
        </li>
        <li>
          <NavLink to="/journal" className="nav-link" activeClassName="active">
            Journal
          </NavLink>
        </li>
        <li>
          <NavLink to="/entries" className="nav-link" activeClassName="active">
            Entries
          </NavLink>
        </li>
        <li>
          <NavLink to="/tracker" className="nav-link" activeClassName="active">
            Trackers
          </NavLink>
        </li>
        <li className="logout">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
