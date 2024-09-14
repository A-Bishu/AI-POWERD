
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper } from '@mui/material';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Dropdown from '../../Components/Dropdown';
import Button from '../../Components/Button';

const apiBaseUrls = {
  nfl: process.env.REACT_APP_NFL_API_BASE_URL,
};

const NFLCompetitionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompetitions = async () => {
      const sport = new URLSearchParams(location.search).get('sport');
      const token = process.env.REACT_APP_NFL_API_TOKEN;

      if (apiBaseUrls[sport] && token) {
        try {
          const response = await axios.get(`${apiBaseUrls[sport]}/competitions`, {
            params: {
              token,
              status: 2,
              per_page: 10,
              paged: 1
            }
          });
          const fetchedCompetitions = response.data.response.items.map(item => ({ value: item.cid, label: item.cname }));
          setCompetitions(fetchedCompetitions);
        } catch (error) {
          console.error('Error fetching competitions:', error);
          if (error.response && error.response.status === 401) {
            setError('Unauthorized access. Please check your API token.');
          } else {
            setError('Error fetching competitions. Please try again later.');
          }
        }
      } else {
        setError('Invalid sport or API token is missing.');
      }
    };

    fetchCompetitions();
  }, [location]);

  const handleCompetitionSelect = (event) => {
    setSelectedCompetition(event.target.value);
  };

  const handleViewMatches = (cid) => {
    if (cid) {
      navigate(`/nfl/match-list?competition=${cid}`);
    }else {
      setError('Please select a competition first.');
    }
    
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
            <Typography variant="h4" component="h1" gutterBottom>
              NFL Competitions
            </Typography>
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={8} md={6} lg={4}>
                <Dropdown label="Competition" options={competitions} onChange={handleCompetitionSelect} value={selectedCompetition} fullWidth />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button text="View Matches" onClick={handleViewMatches} fullWidth />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default NFLCompetitionSelectionPage;
