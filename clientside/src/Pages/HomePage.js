import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, Typography, Grid, Button, Paper, CircularProgress } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

import soccerBackground from '../Assets/soccer-background.jpg';
import nflBackground from '../Assets/nfl-background.jpg';
import basketballBackground from '../Assets/basketball-background.jpg';
import PredictionList from '../Pages/PredictionList';
import VideoSection from '../Components/VideoSection'; // Adjust the path if necessary



const HomePage = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('');
  const [loading, setLoading] = useState(false);

  const sportsOptions = [
    { value: 'soccer', label: 'SOCCER', background: soccerBackground },
    { value: 'nfl', label: 'NFL', background: nflBackground },
    { value: 'basketball', label: 'BASKETBALL', background: basketballBackground },
  ];

  const handleSportSelect = (value) => {
    setSelectedSport(value);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switch (value) {
        case 'soccer':
          navigate(`/competition-selection?sport=${value}`);
          break;
        case 'nfl':
          navigate(`/nfl/competition-selection?sport=${value}`);
          break;
        case 'basketball':
          navigate(`/basketball/competition-selection?sport=${value}`);
          break;
        default:
          alert('This sport is not yet supported.');
          break;
      }
    }, 1000);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          background: 'black',
          backgroundSize: 'cover',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={6}
            sx={{
              py: 6,
              px: { xs: 2, sm: 4 },
              textAlign: 'center',
              backgroundImage: 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                mb: 2,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
              }}
            >
              Welcome To SportifyAI!
              
            </Typography>

            <VideoSection />

            <Paper
              elevation={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                borderRadius: '50px',
                border: '4px solid #3a1c71',
                backgroundColor: 'purple',
                maxWidth: '75%', // Adjust width to be responsive
                width: { xs: '90%', sm: '650px' }, // Responsive width
                margin: '0 auto',
                mt: 4,
                mb: 4,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{
                  color: '#f0f0f0',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                }}
              >
                Our Sports Prediction & Analysis App provides detailed predictions and analysis for various sport matches.
                Whether you're a fan of Soccer, NFL, or Basketball, our app leverages advanced algorithms and data analysis
                to give you insights into upcoming games.
              </Typography>
            </Paper>

            <Typography variant="h4" component="h3" sx={{ mb: 2, fontSize: { xs: '1.8rem', sm: '2rem' } }}>
              Select Your Sport
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {sportsOptions.map((option) => (
                <Grid item xs={12} sm={6} md={4} key={option.value}>
                  <Paper
                    elevation={3}
                    onClick={() => handleSportSelect(option.value)}
                    sx={{
                      height: '200px',
                      padding: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${option.background}) center center / cover no-repeat`,
                      color: '#fff',
                      border: selectedSport === option.value ? '2px solid #3f51b5' : '2px solid transparent',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                    aria-label={`Select ${option.label}`}
                  >
                    <Typography variant="h4" component="p" fontSize={{ xs: '1.2rem', sm: '1.5rem' }}>
                      {loading && selectedSport === option.value ? <CircularProgress size={24} color="inherit" /> : option.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            

            <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
              <Grid item>
                <Typography variant="h4" component="h3" sx={{ mb: 2, fontSize: { xs: '1.8rem', sm: '2rem' } }}>
                  Try For Free
                </Typography>
                <Paper
                  elevation={6}
                  sx={{
                    padding: '16px',
                    backgroundColor: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    component={Link}
                    to="/same-date-matches"
                    variant="contained"
                    color="primary"
                    sx={{
                      bgcolor: '#fff',
                      color: '#3a1c71',
                      fontWeight: 'bold',
                      padding: { xs: '8px 16px', sm: '12px 24px' },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                      },
                    }}
                  >
                    Featured Matchs
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h4" component="h3" sx={{ mb: 2, mt: 4, fontSize: { xs: '1.8rem', sm: '2rem' } }}>
              Latest Predictions
            </Typography>

            {/* Insert the PredictionList component */}
            <PredictionList />

          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
