import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MatchDetails from './pages/MatchDetails';
import Prediction from './pages/Prediction';
import PredictionForm from './components/PredictionForm'; 
import Header from './components/Header';
import FetchUpcomingMatches from './components/FetchUpcomingMatches'; 
import './components/styles/App.css';


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:mid" element={<MatchDetails />} />
        <Route path="/predict/:mid" element={<Prediction />} />
        <Route path="/get-prediction" element={<PredictionForm />} />
        <Route path="/fetch-upcoming-matches" element={<FetchUpcomingMatches />} />
       
      </Routes>
    </Router>
  );
};

export default App;

