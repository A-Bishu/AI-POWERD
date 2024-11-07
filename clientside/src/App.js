// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './Pages/HomePage';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import CompetitionSelectionPage from './Pages/CompetitionSelectionPage';
import MatchListPage from './Pages/MatchListPage';
import MatchPredictionPage from './Pages/MatchPredictionPage';
import SameDateMatchesPage from './Pages/SameDateMatchesPage';

// NFL Pages
import NFLCompetitionSelectionPage from './Pages/NFL/NFLCompetitionSelectionPage';
import NFLMatchListPage from './Pages/NFL/NFLMatchListPage';

// Basketball Pages
import BasketballCompetitionSelectionPage from './Pages/BASKETBALL/BasketballCompetitionSelectionPage';
import BasketballMatchListPage from './Pages/BASKETBALL/BasketballMatchListPage';





function App() {
  return (
    <Router>
    <AuthProvider>
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*<Route path="/register" element={<Register />} />*/}
          {/*<Route path="/login" element={<Login />} />*/}
          <Route path="/competition-selection"  element={<CompetitionSelectionPage />} />
          <Route path="/match-list" element={<ProtectedRoute element={<MatchListPage />} />} />
          <Route path="/match-prediction" element={<ProtectedRoute element={<MatchPredictionPage />} />} />
          <Route path="/same-date-matches" element={<SameDateMatchesPage />} />
          

           {/* NFL Routes */}
          <Route path="/nfl/competition-selection" element={<NFLCompetitionSelectionPage />} />
          <Route path="/nfl/match-list" element={<NFLMatchListPage />} />

            {/* Basketball Routes */}
          <Route path="/basketball/competition-selection" element={<BasketballCompetitionSelectionPage />} />
          <Route path="/basketball/match-list" element={<BasketballMatchListPage />} />
          
        </Routes>
      
    </AuthProvider>
    </Router>
  );
}

export default App;
