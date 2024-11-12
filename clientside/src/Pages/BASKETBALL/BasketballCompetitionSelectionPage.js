import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper, Button as MuiButton, useTheme, useMediaQuery } from '@mui/material';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Dropdown from '../../Components/Dropdown';
import Button from '../../Components/Button';

const apiBaseUrls = {
  basketball: process.env.REACT_APP_BASKETBALL_API_BASE_URL
};

const BasketballCompetitionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCompetitions = async () => {
      const sport = new URLSearchParams(location.search).get('sport');
      const token = process.env.REACT_APP_BASKETBALL_API_KEY;

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
      navigate(`/basketball/match-list?competition=${cid}`);
    } else {
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
          <Paper
            elevation={6}
            sx={{
              py: 4,
              px: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Basketball Competitions
            </Typography>
            {error && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Grid container spacing={isSmallScreen ? 1 : 2} sx={{ mt: 4 }}>
              {competitions.map((competition) => (
                <Grid item xs={12} sm={6} md={4} key={competition.value}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #ff6f91 30%, #ff9671 90%)',
                      color: '#fff',
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    <Typography variant="h6" component="h2" gutterBottom>
                      {competition.label}
                    </Typography>
                    <MuiButton
                      variant="contained"
                      sx={{
                        backgroundColor: '#ff9671',
                        '&:hover': { backgroundColor: '#ff6f91' },
                      }}
                      onClick={() => handleViewMatches(competition.value)}
                    >
                      View Matches
                    </MuiButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
              More Competitions
            </Typography>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={8} md={6} lg={4}>
                <Dropdown
                  label="Competition"
                  options={competitions}
                  onChange={handleCompetitionSelect}
                  value={selectedCompetition}
                  fullWidth
                  sx={{ backgroundColor: '#f5f5f5' }} // Added background color
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button text="View Matches" onClick={() => handleViewMatches(selectedCompetition)} fullWidth />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default BasketballCompetitionSelectionPage;
