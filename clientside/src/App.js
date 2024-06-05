
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import CompetitionSelectionPage from './Pages/CompetitionSelectionPage';
import MatchListPage from './Pages/MatchListPage';
import MatchPredictionPage from './Pages/MatchPredictionPage';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/competition-selection" element={<CompetitionSelectionPage />} />
      <Route path="/match-list" element={<MatchListPage />} />
      <Route path="/match-prediction" element={<MatchPredictionPage />} />
    </Routes>
  </Router>
    
   
  );
};

export default App;
