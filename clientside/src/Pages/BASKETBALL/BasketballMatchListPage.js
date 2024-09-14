
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper, Avatar, Button as MuiButton, useTheme, useMediaQuery } from '@mui/material';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const BasketballMatchListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMatches = async () => {
      const competition = new URLSearchParams(location.search).get('competition');
      const token = process.env.REACT_APP_BASKETBALL_API_TOKEN;
      const baseUrl = process.env.REACT_APP_BASKETBALL_API_BASE_URL;
      if (!token) {
        console.error('API token is missing. Please check your environment variables.');
        alert('API token is missing. Please check your environment variables.');
        return;
      }
      
      try {
        const response = await axios.get(`${baseUrl}/competition/${competition}/matches`, {
          params: {
            token,
            status: 2,
            timezone: '+5:30'
          }
        });
        const fetchedMatches = response.data.response?.items || [];
        setMatches(fetchedMatches);
       
      } catch (error) {
        console.error('Error fetching matches:', error.response ? error.response.data : error.message);
        alert('Error fetching matches. Please try again later.');
      }
    };

    fetchMatches();
  }, [location]);

  const handleViewPrediction = (matchId) => {
    navigate(`/basketball/match-prediction?match=${matchId}`);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #3f51b5, #2196f3)',
          py: 4,
        }}
      >
      <Container>
      <Paper elevation={6} sx={{ py: 4, px: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Basketball Match List
          </Typography>
          <Grid container spacing={isSmallScreen ? 1 : 2} justifyContent="center">
            {matches.length > 0 ? (
              matches.map((match) => (
                <Grid item xs={12} md={8} lg={6} key={match.mid}>
                  <Paper sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'lightblue', margin: 'auto' }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item xs={5} container alignItems="center">
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {isSmallScreen ? match.teams.home.abbr : match.teams.home.tname}
                        </Typography>
                        <Avatar src={match.teams.home.logo} alt={match.teams.home.tname} />
                      </Grid>
                      <Grid item xs={5} container alignItems="center" justifyContent="flex-end">
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          {isSmallScreen ? match.teams.away.abbr : match.teams.away.tname}
                        </Typography>
                        <Avatar src={match.teams.away.logo} alt={match.teams.away.tname} />
                      </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <Typography variant="body2">
                        Date: {match.datestart}
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
        </Box>
        </Paper>
      </Container>
      </Box>
      <Footer />
    </>
  );
};

export default BasketballMatchListPage;
