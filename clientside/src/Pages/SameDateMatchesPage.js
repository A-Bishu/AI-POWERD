import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper, Avatar, Button as MuiButton, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const apiBaseUrls = {
    soccer: `${process.env.REACT_APP_SOCCER_API_BASE_URL}`,
  };

const SameDateMatchesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMatches = async () => {
      const token = process.env.REACT_APP_SOCCER_API_KEY;

      if (!token) {
        setError('API token is missing. Please check your environment variables.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrls.soccer}/matches`, {
          params: {
            token,
            status: 1,
            per_page: 50,
            pre_squad: true,
            
          }
        });
        const fetchedMatches = response.data.response?.items || [];
        setMatches(fetchedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Error fetching matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [location]);

  const handleViewPrediction = (matchId) => {
    navigate(`/match-prediction?match=${matchId}`);
  };

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
          Featured Match
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
              <Typography variant="body1" component="p" sx={{ ml: 2 }}>
                Loading matches...
              </Typography>
            </Box>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            <Grid container spacing={isSmallScreen ? 1 : 2}>
              {matches.length > 0 ? (
                matches.map((match) => (
                    <Grid item xs={12} md={8} lg={6} key={match.mid}>
                    <Paper sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'lightblue' }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={5} container alignItems="center">
                          <Avatar src={match.teams.home.logo} alt={match.teams.home.tname} />
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {isSmallScreen ? match.teams.home.abbr : match.teams.home.tname}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} container alignItems="center" justifyContent="flex-end">
                        <Avatar src={match.teams.away.logo} alt={match.teams.away.tname} />
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            {isSmallScreen ? match.teams.away.abbr : match.teams.away.tname}
                          </Typography>
                          
                        </Grid>
                      </Grid>
                      <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography variant="body2">
                          Date: {match.datestart}
                        </Typography>
                        <Typography variant="body2">
                          Competition: {match.competition.cname}
                        </Typography>
                      </Box>
                      <MuiButton variant="contained" color="primary" onClick={() => handleViewPrediction(match.mid)} sx={{ mt: 1 }}>
                        View Prediction
                      </MuiButton>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No matches found.
                </Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default SameDateMatchesPage;
