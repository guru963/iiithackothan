import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import { auth, logout } from '../firebase';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img className="logo-picture" src={logo} alt="Eco Travel Logo"></img>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><a href="/route-optimization.html">Route Optimization</a></li>
          <li><Link to="/itinerary-planner">Itinerary Planner</Link></li>
          <li><a href="eco-accommodations.html">Eco Hotels</a></li>
          <li><Link to="/activities">Activities</Link></li>
          <li><a href="/eco-packing.html">Eco Packing</a></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        {user ? (
          <>
            <span className="welcome-message">Welcome, {user.displayName || user.email}</span>
            <button className="logout-button" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">Log In</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;