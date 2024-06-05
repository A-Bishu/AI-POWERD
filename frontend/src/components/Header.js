//Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/App.css';

const Header = () => (
  <header className="header">
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li> 
        <li><Link to="/fetch-upcoming-matches">Fetch Upcoming Matches</Link></li>
        <li><Link to="/get-prediction">Get Prediction</Link></li> {/* Corrected Link */}
        
       
      </ul>
    </nav>
  </header>
);

export default Header;
