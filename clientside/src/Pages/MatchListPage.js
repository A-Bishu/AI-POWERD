import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, List, ListItem, Avatar, Button as MuiButton } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Grid from '@mui/material/Grid';

const MatchListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const competition = new URLSearchParams(location.search).get('competition');
      const token = process.env.REACT_APP_SOCCER_API_TOKEN;
      if (!token) {
        console.error('API token is missing. Please check your environment variables.');
        alert('API token is missing. Please check your environment variables.');
        return;
      }
      
      try {
        const response = await axios.get(`https://soccer.entitysport.com/competition/${competition}/matches`, {
          params: {
            token,
            status: 1, // 1 for upcoming matches
            date: '2023-12-27_2023-12-27',
            timezone: '+5:30'
          }
        });
        const fetchedMatches = response.data.response?.items || [];
        setMatches(fetchedMatches);
        console.log('Fetched matches:', fetchedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error.response ? error.response.data : error.message);
        alert('Error fetching matches. Please try again later.');
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
            Match List
          </Typography>
          <List>
            {matches.length > 0 ? (
              matches.map((match) => (
                <ListItem key={match.mid} sx={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Grid container alignItems="center" justifyContent="center" spacing={2}>
                    <Grid item>
                      <Avatar src={match.teams.home.logo} alt={match.teams.home.tname} />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        {match.teams.home.tname} vs {match.teams.away.tname}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Avatar src={match.teams.away.logo} alt={match.teams.away.tname} />
                    </Grid>
                  </Grid>
                  <Typography variant="body2" sx={{ textAlign: 'center', mt: { xs: 1, sm: 0 } }}>
                    Date: {match.datestart} Time: {match.time}
                  </Typography>
                  <MuiButton variant="contained" color="primary" onClick={() => handleViewPrediction(match.mid)} sx={{ mt: { xs: 1, sm: 0 } }}>
                    View Prediction
                  </MuiButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No matches found.
              </Typography>
            )}
          </List>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default MatchListPage;
