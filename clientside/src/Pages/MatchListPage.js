// src/Pages/MatchListPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

dayjs.extend(utc);



const MatchListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMatches = async () => {
      const competition = new URLSearchParams(location.search).get('competition');
      const token = process.env.REACT_APP_SOCCER_API_KEY;
      const apiBaseUrls = process.env.REACT_APP_SOCCER_API_BASE_URL;

      if (!competition) {
        setError('No competition ID provided.');
        setLoading(false);
        return;
      }

      if (!token || !apiBaseUrls) {
        setError('API token or base URL is missing. Please check your environment variables.');
        setLoading(false);
        return;
      }

      try {
        // **Fixed the date parameter to a valid range**
        // Alternatively, make this dynamic based on current date or user input
        const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
        const endDate = dayjs().add(1, 'month').format('YYYY-MM-DD');
        const dateRange = `${startDate}_${endDate}`;

        const response = await axios.get(`${apiBaseUrls}/competition/${competition}/matches`, {
          params: {
            token,
            status: 1,
            per_page: 20,
            pre_squad: true,
            date: dateRange, // **Updated to dynamic date range**
            timezone: '+5:30',
          },
        });

        const fetchedMatches = response.data.response?.items || [];
        setMatches(fetchedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);

        // **Enhanced error handling**
        if (error.response) {
          // Server responded with a status other than 2xx
          setError(`Error: ${error.response.data.message || 'Failed to fetch matches.'}`);
        } else if (error.request) {
          // No response received
          setError('Network error: Unable to reach the server.');
        } else {
          // Other errors
          setError('An unexpected error occurred.');
        }

        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [location.search]); // **Updated dependency array**

  const handleViewPrediction = (matchId) => {
    navigate(`/match-prediction?match=${matchId}`);
  };

  // **Fallback avatar image URL**
  const fallbackAvatar = 'https://via.placeholder.com/40';

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          background: isSmallScreen
            ? 'linear-gradient(to bottom, #3f51b5, #2196f3)'
            : 'linear-gradient(to right, #3f51b5, #2196f3)',
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
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px',
            }}
          >
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography
                variant={isSmallScreen ? 'h5' : 'h4'}
                color="primary"
                component="h1"
                gutterBottom
              >
                Matches
              </Typography>

              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress />
                  <Typography variant="body1" component="p" sx={{ ml: 2 }}>
                    Loading matches...
                  </Typography>
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ backgroundColor: '#fdecea', borderRadius: '8px' }}>
                  {error}
                </Alert>
              ) : matches.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  No matches found.
                </Typography>
              ) : (
                <Grid container spacing={isSmallScreen ? 1 : 2}>
                  {matches.map((match) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={match.mid}>
                      <Paper
                        sx={{
                          p: 2,
                          border: '1px solid #ddd',
                          borderRadius: '12px',
                          backgroundColor: 'lightblue',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: 3,
                          },
                        }}
                      >
                        <Grid container justifyContent="space-between" alignItems="center">
                          {/* Home Team */}
                          <Grid
                            item
                            xs={5}
                            container
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item>
                              <Avatar
                                src={match.teams.home.logo || fallbackAvatar}
                                alt={match.teams.home.tname || 'Home Team'}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = fallbackAvatar;
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h6"
                                sx={{ fontSize: isSmallScreen ? '1rem' : '1.2rem' }}
                              >
                                {isSmallScreen ? match.teams.home.abbr : match.teams.home.tname}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* Away Team */}
                          <Grid
                            item
                            xs={5}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                            spacing={1}
                          >
                            <Grid item>
                              <Avatar
                                src={match.teams.away.logo || fallbackAvatar}
                                alt={match.teams.away.tname || 'Away Team'}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = fallbackAvatar;
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h6"
                                sx={{ fontSize: isSmallScreen ? '1rem' : '1.2rem' }}
                              >
                                {isSmallScreen ? match.teams.away.abbr : match.teams.away.tname}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Match Date */}
                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            {dayjs(match.datestart).format('dddd, MMM D • h:mm A')}
                          </Typography>
                        </Box>

                        {/* View Prediction Button */}
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewPrediction(match.mid)}
                            fullWidth
                          >
                            View Prediction
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MatchListPage;
